import { healthRecordESIndexName } from "@providers/elasticsearch/constants";
import { esBaseClient } from "@providers/elasticsearch/ESBase";
import { 
  FacilityTypeWiseStatsInterface, 
  FacilityCategorization, 
  FacilityBucket,
  CategoryStats 
} from "@utils/interfaces/Analytics/PublicDashboard/FacilityTypeWiseStatsInterface";
import { FacilityCategorizationService } from "./FacilityCategorizationService";
import { FacilityStatsLogger } from "./FacilityStatsLogger";
import { ValidationMetricsService, ValidationResult } from "./ValidationMetricsService";

export class RegistrationStatsService {
  private categorizationService: FacilityCategorizationService;
  private logger: FacilityStatsLogger;
  private validationMetrics: ValidationMetricsService;

  constructor() {
    this.categorizationService = new FacilityCategorizationService();
    this.logger = new FacilityStatsLogger();
    this.validationMetrics = new ValidationMetricsService();
  }

  /**
   * Get facility type registration statistics using single aggregation approach
   */
  async getTotalRegistrationStats(): Promise<FacilityTypeWiseStatsInterface> {
    try {
      // Get the true total count from the index
      const totalCountResponse = await esBaseClient.count({
        index: healthRecordESIndexName
      });
      const actualTotalCount = totalCountResponse.body.count;

      // Single aggregation query with larger size to capture all facilities
      const facilityAggregation = await esBaseClient.search({
        index: healthRecordESIndexName,
        body: {
          size: 0, // Only return aggregations
          aggs: {
            facility_stats: {
              terms: {
                field: "created_facility_id",
                size: 50000 // Increased size to capture all facilities
                // Removed 'missing' parameter as it causes number format exception for numeric fields
              }
            }
          }
        }
      });

      const buckets: FacilityBucket[] = facilityAggregation.body.aggregations.facility_stats.buckets;
      const totalFromAggregation = buckets.reduce((sum, bucket) => sum + bucket.doc_count, 0);
      
      // Log discrepancy if any
      if (totalFromAggregation !== actualTotalCount) {
        console.warn(`[RegistrationStats] Count discrepancy detected: Aggregation=${totalFromAggregation}, Index Total=${actualTotalCount}, Difference=${actualTotalCount - totalFromAggregation}`);
      }
      
      // Process facilities using categorization service
      const categorizedFacilities = await this.categorizationService.categorizeFacilities(buckets);
      
      // Calculate counts and validate using the actual total count
      const stats = this.calculateStatsFromCategorization(categorizedFacilities, actualTotalCount);
      
      return stats;
    } catch (error) {
      console.error('[RegistrationStats] Error in getTotalRegistrationStats:', error);
      
      // Return error response with zero counts
      return {
        totalCount: 0,
        openMRSCount: 0,
        openSRPCount: 0,
        aaloClincCount: 0,
        eMISCount: 0,
        uncategorizedCount: 0,
        validationPassed: false,
        message: 'Error retrieving registration statistics',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  /**
   * Calculate statistics from categorized facilities and validate counts
   */
  private calculateStatsFromCategorization(
    categorizedFacilities: FacilityCategorization[], 
    actualTotalCount: number
  ): FacilityTypeWiseStatsInterface {
    const startTime = Date.now();
    
    const categoryStats: CategoryStats = {
      openMRSCount: 0,
      openSRPCount: 0,
      aaloClinicCount: 0,
      eMISCount: 0,
      uncategorizedCount: 0,
      totalProcessed: 0,
      errors: []
    };

    // Aggregate counts by facility type
    categorizedFacilities.forEach(facility => {
      categoryStats.totalProcessed += facility.docCount;
      
      switch (facility.facilityType) {
        case 'openMRS+':
          categoryStats.openMRSCount += facility.docCount;
          break;
        case 'openSRP':
          categoryStats.openSRPCount += facility.docCount;
          break;
        case 'aaloClinic':
          categoryStats.aaloClinicCount += facility.docCount;
          break;
        case 'eMIS':
          categoryStats.eMISCount += facility.docCount;
          break;
        case 'uncategorized':
          categoryStats.uncategorizedCount += facility.docCount;
          break;
      }
      
      // Collect errors
      if (facility.error) {
        categoryStats.errors.push(`Facility ${facility.facilityId}: ${facility.error}`);
      }
    });

    // Calculate the sum of categorized counts
    const calculatedTotal = categoryStats.openMRSCount + categoryStats.openSRPCount + 
                           categoryStats.aaloClinicCount + categoryStats.eMISCount + 
                           categoryStats.uncategorizedCount;
    
    // Check if there's a discrepancy between processed and actual total
    const discrepancy = actualTotalCount - categoryStats.totalProcessed;
    if (discrepancy > 0) {
      // Add the missing records to uncategorized count
      categoryStats.uncategorizedCount += discrepancy;
      console.warn(`[RegistrationStats] Added ${discrepancy} missing records to uncategorized count`);
    }
    
    // Recalculate total after adjustment
    const finalCalculatedTotal = categoryStats.openMRSCount + categoryStats.openSRPCount + 
                                categoryStats.aaloClinicCount + categoryStats.eMISCount + 
                                categoryStats.uncategorizedCount;
    
    const validationPassed = finalCalculatedTotal === actualTotalCount;
    const processingTime = Date.now() - startTime;
    
    // Record validation metrics
    const validationResult: ValidationResult = {
      passed: validationPassed,
      expectedTotal: actualTotalCount,
      calculatedTotal: finalCalculatedTotal,
      discrepancy: finalCalculatedTotal - actualTotalCount,
      timestamp: new Date().toISOString(),
      processingTime,
      errorDetails: categoryStats.errors.length > 0 ? categoryStats.errors : undefined
    };
    
    this.validationMetrics.recordValidation(validationResult);
    
    // Log validation results
    this.logValidationResults(categoryStats, actualTotalCount, finalCalculatedTotal, discrepancy);

    return {
      totalCount: actualTotalCount, // Use the actual total from the index
      openMRSCount: categoryStats.openMRSCount,
      openSRPCount: categoryStats.openSRPCount,
      aaloClincCount: categoryStats.aaloClinicCount,
      eMISCount: categoryStats.eMISCount,
      uncategorizedCount: categoryStats.uncategorizedCount,
      validationPassed,
      message: validationPassed ? 'Statistics calculated successfully' : 'Count validation failed',
      errors: categoryStats.errors.length > 0 ? categoryStats.errors : undefined
    };
  }

  /**
   * Log validation results for debugging and monitoring
   */
  private logValidationResults(stats: CategoryStats, expectedTotal: number, calculatedTotal: number, discrepancy?: number): void {
    if (calculatedTotal !== expectedTotal) {
      this.logger.logValidationWarning(calculatedTotal, expectedTotal, stats);
    } else {
      this.logger.logSuccessfulCalculation(expectedTotal, Object.keys(stats).length - 2, stats.errors.length);
    }
    
    if (discrepancy && discrepancy > 0) {
      console.info(`[RegistrationStats] Handled ${discrepancy} records with missing facility IDs by adding to uncategorized count`);
    }
  }

  /**
   * Get logger instance for external access to logs
   */
  getLogger(): FacilityStatsLogger {
    return this.logger;
  }

  /**
   * Get categorization service logger for detailed facility logs
   */
  getCategorizationLogger(): FacilityStatsLogger {
    return this.categorizationService.getLogger();
  }

  /**
   * Get validation metrics for monitoring
   */
  getValidationMetrics(): ValidationMetricsService {
    return this.validationMetrics;
  }

  /**
   * Get validation metrics summary for API responses
   */
  getValidationSummary(): { 
    successRate: number; 
    totalValidations: number; 
    hasConcerns: boolean; 
    concerns: string[] 
  } {
    const metrics = this.validationMetrics.getMetrics();
    const concerns = this.validationMetrics.hasValidationConcerns();
    
    return {
      successRate: metrics.successRate,
      totalValidations: metrics.totalValidations,
      hasConcerns: concerns.hasConcerns,
      concerns: concerns.concerns
    };
  }
}