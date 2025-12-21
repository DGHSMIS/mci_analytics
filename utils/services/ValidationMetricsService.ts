export interface ValidationMetrics {
  totalValidations: number;
  successfulValidations: number;
  failedValidations: number;
  successRate: number;
  lastValidationTime: string;
  averageProcessingTime: number;
  errorPatterns: { [key: string]: number };
}

export interface ValidationResult {
  passed: boolean;
  expectedTotal: number;
  calculatedTotal: number;
  discrepancy: number;
  timestamp: string;
  processingTime: number;
  errorDetails?: string[];
}

export class ValidationMetricsService {
  private metrics: ValidationMetrics;
  private validationHistory: ValidationResult[] = [];
  private readonly maxHistorySize: number = 100;

  constructor() {
    this.metrics = {
      totalValidations: 0,
      successfulValidations: 0,
      failedValidations: 0,
      successRate: 0,
      lastValidationTime: '',
      averageProcessingTime: 0,
      errorPatterns: {}
    };
  }

  /**
   * Record a validation result and update metrics
   */
  recordValidation(result: ValidationResult): void {
    this.metrics.totalValidations++;
    this.metrics.lastValidationTime = result.timestamp;

    if (result.passed) {
      this.metrics.successfulValidations++;
    } else {
      this.metrics.failedValidations++;
      
      // Track error patterns
      const errorKey = this.categorizeError(result);
      this.metrics.errorPatterns[errorKey] = (this.metrics.errorPatterns[errorKey] || 0) + 1;
    }

    // Update success rate
    this.metrics.successRate = (this.metrics.successfulValidations / this.metrics.totalValidations) * 100;

    // Update average processing time
    const totalTime = this.validationHistory.reduce((sum, v) => sum + v.processingTime, 0) + result.processingTime;
    const totalCount = this.validationHistory.length + 1;
    this.metrics.averageProcessingTime = totalTime / totalCount;

    // Add to history
    this.validationHistory.push(result);

    // Maintain history size limit
    if (this.validationHistory.length > this.maxHistorySize) {
      this.validationHistory = this.validationHistory.slice(-this.maxHistorySize);
    }

    // Log significant validation failures
    if (!result.passed) {
      console.warn(`[ValidationMetrics] Validation failed: expected=${result.expectedTotal}, calculated=${result.calculatedTotal}, discrepancy=${result.discrepancy}`);
      
      if (Math.abs(result.discrepancy) > 1000) {
        console.error(`[ValidationMetrics] Large discrepancy detected: ${result.discrepancy} records`);
      }
    }
  }

  /**
   * Get current validation metrics
   */
  getMetrics(): ValidationMetrics {
    return { ...this.metrics };
  }

  /**
   * Get recent validation history
   */
  getValidationHistory(count: number = 10): ValidationResult[] {
    return this.validationHistory.slice(-count);
  }

  /**
   * Get validation trend (success rate over time)
   */
  getValidationTrend(): { timestamp: string; successRate: number }[] {
    const recentValidations = this.validationHistory.slice(-20);
    const trendPoints: { timestamp: string; successRate: number }[] = [];
    
    for (let i = 0; i < recentValidations.length; i += 5) {
      const batch = recentValidations.slice(i, i + 5);
      const successCount = batch.filter(v => v.passed).length;
      const successRate = (successCount / batch.length) * 100;
      
      trendPoints.push({
        timestamp: batch[batch.length - 1].timestamp,
        successRate
      });
    }
    
    return trendPoints;
  }

  /**
   * Check if validation metrics indicate a problem
   */
  hasValidationConcerns(): { hasConcerns: boolean; concerns: string[] } {
    const concerns: string[] = [];
    
    // Check success rate
    if (this.metrics.successRate < 95 && this.metrics.totalValidations > 5) {
      concerns.push(`Low success rate: ${this.metrics.successRate.toFixed(1)}%`);
    }
    
    // Check for recent failures
    const recentValidations = this.validationHistory.slice(-5);
    const recentFailures = recentValidations.filter(v => !v.passed).length;
    if (recentFailures >= 3) {
      concerns.push(`${recentFailures} failures in last 5 validations`);
    }
    
    // Check for large discrepancies
    const recentLargeDiscrepancies = recentValidations.filter(v => Math.abs(v.discrepancy) > 1000).length;
    if (recentLargeDiscrepancies > 0) {
      concerns.push(`${recentLargeDiscrepancies} large discrepancies detected`);
    }
    
    // Check processing time trend
    if (this.metrics.averageProcessingTime > 5000) { // 5 seconds
      concerns.push(`High processing time: ${this.metrics.averageProcessingTime.toFixed(0)}ms`);
    }
    
    return {
      hasConcerns: concerns.length > 0,
      concerns
    };
  }

  /**
   * Reset all metrics (useful for testing)
   */
  resetMetrics(): void {
    this.metrics = {
      totalValidations: 0,
      successfulValidations: 0,
      failedValidations: 0,
      successRate: 0,
      lastValidationTime: '',
      averageProcessingTime: 0,
      errorPatterns: {}
    };
    this.validationHistory = [];
  }

  /**
   * Categorize validation errors for pattern tracking
   */
  private categorizeError(result: ValidationResult): string {
    const discrepancy = Math.abs(result.discrepancy);
    
    if (discrepancy === 0) {
      return 'no_discrepancy_but_failed'; // Shouldn't happen, but track it
    } else if (discrepancy < 10) {
      return 'small_discrepancy';
    } else if (discrepancy < 100) {
      return 'medium_discrepancy';
    } else if (discrepancy < 1000) {
      return 'large_discrepancy';
    } else {
      return 'very_large_discrepancy';
    }
  }

  /**
   * Export metrics for external monitoring systems
   */
  exportMetricsForMonitoring(): Record<string, number | string> {
    const concerns = this.hasValidationConcerns();
    
    return {
      'facility_stats_validation_total': this.metrics.totalValidations,
      'facility_stats_validation_success_rate': this.metrics.successRate,
      'facility_stats_validation_failures': this.metrics.failedValidations,
      'facility_stats_avg_processing_time': this.metrics.averageProcessingTime,
      'facility_stats_has_concerns': concerns.hasConcerns ? 1 : 0,
      'facility_stats_concern_count': concerns.concerns.length,
      'facility_stats_last_validation': this.metrics.lastValidationTime
    };
  }
}