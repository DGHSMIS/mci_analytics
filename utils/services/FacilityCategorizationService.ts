import { 
  FacilityCategorization, 
  FacilityCategorizationService as IFacilityCategorizationService,
  FacilityBucket 
} from "@utils/interfaces/Analytics/PublicDashboard/FacilityTypeWiseStatsInterface";
import fetchAndCacheFacilityInfo from "@utils/providers/fetchAndCacheFacilityInfo";
import { getFacilitySolutionTypeFromName, isAaloClinic } from "@utils/utilityFunctions";
import { FacilityStatsLogger } from "./FacilityStatsLogger";

export class FacilityCategorizationService implements IFacilityCategorizationService {
  private readonly batchSize: number;
  private readonly facilityCache: Map<string, FacilityCategorization>;
  private readonly logger: FacilityStatsLogger;
  private cacheHits: number = 0;
  private cacheMisses: number = 0;
  private totalProcessingTime: number = 0;
  private totalFacilitiesProcessed: number = 0;

  constructor(batchSize: number = 100) {
    this.batchSize = Math.max(1, Math.min(batchSize, 1000)); // Ensure reasonable batch size
    this.facilityCache = new Map();
    this.logger = new FacilityStatsLogger();
  }

  /**
   * Categorize multiple facilities in batches for better performance
   */
  async categorizeFacilities(facilityBuckets: FacilityBucket[]): Promise<FacilityCategorization[]> {
    const startTime = Date.now();
    const results: FacilityCategorization[] = [];
    let batchNumber = 1;
    
    console.info(`[FacilityStats] Starting batch processing of ${facilityBuckets.length} facilities with batch size ${this.batchSize}`);
    
    for (let i = 0; i < facilityBuckets.length; i += this.batchSize) {
      const batchStartTime = Date.now();
      const batch = facilityBuckets.slice(i, i + this.batchSize);
      
      const batchResults = await Promise.allSettled(
        batch.map(bucket => this.categorizeSingleFacility(bucket.key, bucket.doc_count))
      );
      
      let batchSuccessCount = 0;
      let batchErrorCount = 0;
      
      // Handle both successful and failed categorizations
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
          batchSuccessCount++;
        } else {
          // Handle failed categorization
          const failedBucket = batch[index];
          const errorMessage = result.reason?.message || 'Unknown categorization error';
          
          this.logger.logCategorizationFailure(failedBucket.key, errorMessage, {
            docCount: failedBucket.doc_count,
            batchNumber
          });
          
          results.push({
            facilityId: failedBucket.key,
            facilityType: 'uncategorized',
            docCount: failedBucket.doc_count,
            error: errorMessage
          });
          batchErrorCount++;
        }
      });
      
      const batchTime = Date.now() - batchStartTime;
      
      // Log batch processing metrics with timing
      this.logger.logBatchProcessingMetrics(batchNumber, batch.length, batchSuccessCount, batchErrorCount);
      console.info(`[FacilityStats] Batch ${batchNumber} completed in ${batchTime}ms (${(batchTime / batch.length).toFixed(2)}ms per facility)`);
      
      batchNumber++;
    }
    
    const totalTime = Date.now() - startTime;
    this.totalProcessingTime += totalTime;
    this.totalFacilitiesProcessed += facilityBuckets.length;
    
    // Log cache performance
    this.logger.logCacheMetrics(this.cacheHits, this.cacheMisses, this.facilityCache.size);
    
    console.info(`[FacilityStats] Batch processing completed in ${totalTime}ms. Average: ${(totalTime / facilityBuckets.length).toFixed(2)}ms per facility`);
    
    return results;
  }

  /**
   * Categorize a single facility with caching and error handling
   */
  async categorizeSingleFacility(facilityId: string | number, docCount: number): Promise<FacilityCategorization> {
    const facilityIdStr = String(facilityId);
    
    // Check cache first
    const cacheKey = `${facilityIdStr}_${docCount}`;
    if (this.facilityCache.has(cacheKey)) {
      this.cacheHits++;
      return this.facilityCache.get(cacheKey)!;
    }
    
    this.cacheMisses++;

    try {
      const categorization = await this.performCategorization(facilityIdStr, docCount);
      
      // Cache the result
      this.facilityCache.set(cacheKey, categorization);
      
      return categorization;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      this.logger.logCategorizationFailure(facilityIdStr, errorMessage, {
        docCount,
        operation: 'single_facility_categorization'
      });
      
      const errorCategorization: FacilityCategorization = {
        facilityId: facilityIdStr,
        facilityType: 'uncategorized',
        docCount,
        error: errorMessage
      };
      
      // Cache the error result to avoid repeated failures
      this.facilityCache.set(cacheKey, errorCategorization);
      
      return errorCategorization;
    }
  }

  /**
   * Perform the actual categorization logic
   */
  private async performCategorization(facilityId: string | number, docCount: number): Promise<FacilityCategorization> {
    // Convert facilityId to string for consistent handling
    const facilityIdStr = String(facilityId);
    
    // Handle special cases first - including records with missing facility_id
    if (facilityIdStr === "unknown" || !facilityIdStr || facilityIdStr.trim() === "" || facilityIdStr === "null" || facilityIdStr === "undefined") {
      return {
        facilityId: facilityIdStr || "unknown",
        facilityType: 'uncategorized',
        docCount,
        error: 'Missing or invalid facility ID'
      };
    }
    
    // Check if it's an Aalo Clinic
    if (isAaloClinic(facilityIdStr)) {
      return {
        facilityId: facilityIdStr,
        facilityType: 'aaloClinic',
        docCount
      };
    }
    
    // Fetch facility information with error handling
    try {
      const facilityInfo = await fetchAndCacheFacilityInfo(facilityIdStr);
      
      if (!facilityInfo || !facilityInfo.name) {
        this.logger.logFacilityLookupFailure(facilityIdStr, 'Facility information not found or missing name');
        return {
          facilityId: facilityIdStr,
          facilityType: 'uncategorized',
          docCount,
          error: 'Facility information not found'
        };
      }
      
      const facilityType = getFacilitySolutionTypeFromName(facilityInfo.name);
      
      // Map facility types to our categorization
      let mappedType: FacilityCategorization['facilityType'];
      switch (facilityType) {
        case 'openSRP':
          mappedType = 'openSRP';
          break;
        case 'openMRS+':
          mappedType = 'openMRS+';
          break;
        default:
          // Log unknown facility types for monitoring
          this.logger.logUnknownFacilityType(facilityIdStr, facilityInfo.name, facilityType);
          mappedType = 'eMIS';
          break;
      }
      
      return {
        facilityId: facilityIdStr,
        facilityType: mappedType,
        facilityName: facilityInfo.name,
        docCount
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown facility lookup error';
      this.logger.logFacilityLookupFailure(facilityIdStr, errorMessage);
      throw error; // Re-throw to be handled by the calling function
    }
  }

  /**
   * Clear the cache (useful for testing or memory management)
   */
  clearCache(): void {
    this.facilityCache.clear();
    this.cacheHits = 0;
    this.cacheMisses = 0;
    this.totalProcessingTime = 0;
    this.totalFacilitiesProcessed = 0;
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[]; hits: number; misses: number; hitRate: string; avgProcessingTime: number } {
    const totalRequests = this.cacheHits + this.cacheMisses;
    const hitRate = totalRequests > 0 ? (this.cacheHits / totalRequests * 100).toFixed(2) + '%' : '0%';
    const avgProcessingTime = this.totalFacilitiesProcessed > 0 ? 
      (this.totalProcessingTime / this.totalFacilitiesProcessed) : 0;
    
    return {
      size: this.facilityCache.size,
      keys: Array.from(this.facilityCache.keys()),
      hits: this.cacheHits,
      misses: this.cacheMisses,
      hitRate,
      avgProcessingTime: Math.round(avgProcessingTime * 100) / 100 // Round to 2 decimal places
    };
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): { 
    totalProcessingTime: number; 
    totalFacilitiesProcessed: number; 
    avgTimePerFacility: number;
    batchSize: number;
  } {
    return {
      totalProcessingTime: this.totalProcessingTime,
      totalFacilitiesProcessed: this.totalFacilitiesProcessed,
      avgTimePerFacility: this.totalFacilitiesProcessed > 0 ? 
        (this.totalProcessingTime / this.totalFacilitiesProcessed) : 0,
      batchSize: this.batchSize
    };
  }

  /**
   * Get logger instance for external access
   */
  getLogger(): FacilityStatsLogger {
    return this.logger;
  }
}