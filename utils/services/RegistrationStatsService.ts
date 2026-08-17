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

// In-memory fallback caches for external third-party services
let lastKnownEAppointmentCount: number = 0;
let lastKnownGovernmentOutdoorDispensaryCount: number = 0;

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
   * Fetch total patient registrations from eAppointment API with retry and cached fallback
   */
  private async getEAppointmentCount(): Promise<number> {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);
        const response = await fetch("https://eappointment.dghs.gov.bd/api/v1/stats", {
          signal: controller.signal,
          cache: "no-store",
          headers: {
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (compatible; DGHS-Analytics/1.0)",
          },
        });
        clearTimeout(timeoutId);
        if (response.ok) {
          const json = await response.json();
          if (json && typeof json.patients_all === "number") {
            lastKnownEAppointmentCount = json.patients_all;
            return json.patients_all;
          }
        }
      } catch (error) {
        console.warn(`[RegistrationStats] Attempt ${attempt} failed to fetch eAppointment stats:`, error instanceof Error ? error.message : error);
        if (attempt === 2) {
          if (lastKnownEAppointmentCount > 0) {
            console.info(`[RegistrationStats] Using last known eAppointment count: ${lastKnownEAppointmentCount}`);
            return lastKnownEAppointmentCount;
          }
        }
      }
    }
    return lastKnownEAppointmentCount;
  }

  /**
   * Fetch total patient registrations from Government Outdoor Dispensary (GOD) API with retry and cached fallback
   */
  private async getGovernmentOutdoorDispensaryCount(): Promise<number> {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        // Get today's date in YYYY-MM-DD format (Asia/Dhaka timezone)
        const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" });
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);
        const response = await fetch(`https://god-central.cmedhealth.com/openmrs/ws/dghs/api/hid/total-count?startDate=2026-01-01&endDate=${today}`, {
          signal: controller.signal,
          cache: "no-store",
          headers: {
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (compatible; DGHS-Analytics/1.0)",
          },
        });
        clearTimeout(timeoutId);
        if (response.ok) {
          const json = await response.json();
          if (json && json.data && typeof json.data.totalCount === "number") {
            lastKnownGovernmentOutdoorDispensaryCount = json.data.totalCount;
            return json.data.totalCount;
          }
        }
      } catch (error) {
        console.warn(`[RegistrationStats] Attempt ${attempt} failed to fetch Government Outdoor Dispensary stats:`, error instanceof Error ? error.message : error);
        if (attempt === 2) {
          if (lastKnownGovernmentOutdoorDispensaryCount > 0) {
            console.info(`[RegistrationStats] Using last known Government Outdoor Dispensary count: ${lastKnownGovernmentOutdoorDispensaryCount}`);
            return lastKnownGovernmentOutdoorDispensaryCount;
          }
        }
      }
    }
    return lastKnownGovernmentOutdoorDispensaryCount;
  }

  /**
   * Get facility type registration statistics using single aggregation approach
   */
  async getTotalRegistrationStats(): Promise<FacilityTypeWiseStatsInterface> {
    try {
      // Fetch ES count, ES aggregation, eAppointment count, and Government Outdoor Dispensary count concurrently
      const [totalCountResponse, facilityAggregation, eAppointmentCount, governmentOutdoorDispensaryCount] = await Promise.all([
        esBaseClient.count({
          index: healthRecordESIndexName
        }),
        esBaseClient.search({
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
        }),
        this.getEAppointmentCount(),
        this.getGovernmentOutdoorDispensaryCount()
      ]);

      const actualTotalCount = totalCountResponse.body.count;
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
      stats.eAppointmentCount = eAppointmentCount;
      stats.governmentOutdoorDispensaryCount = governmentOutdoorDispensaryCount;
      
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
        eAppointmentCount: 0,
        governmentOutdoorDispensaryCount: 0,
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