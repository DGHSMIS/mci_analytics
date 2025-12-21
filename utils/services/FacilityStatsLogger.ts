import { FacilityCategorization, CategoryStats } from "@utils/interfaces/Analytics/PublicDashboard/FacilityTypeWiseStatsInterface";

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  context?: Record<string, any>;
}

export class FacilityStatsLogger {
  private logs: LogEntry[] = [];
  private readonly maxLogs: number = 1000; // Keep last 1000 log entries

  /**
   * Log facility categorization failure
   */
  logCategorizationFailure(facilityId: string, error: string, context?: Record<string, any>): void {
    this.addLog('error', `Facility categorization failed for ${facilityId}: ${error}`, {
      facilityId,
      error,
      ...context
    });
    
    // Also log to console for immediate visibility
    console.error(`[FacilityStats] Categorization failed for facility ${facilityId}:`, error, context);
  }

  /**
   * Log validation warning when counts don't sum correctly
   */
  logValidationWarning(calculated: number, expected: number, stats: CategoryStats): void {
    const message = `Count validation failed: calculated=${calculated}, expected=${expected}`;
    
    this.addLog('warn', message, {
      calculatedTotal: calculated,
      expectedTotal: expected,
      breakdown: {
        openMRS: stats.openMRSCount,
        openSRP: stats.openSRPCount,
        aaloClinic: stats.aaloClinicCount,
        eMIS: stats.eMISCount,
        uncategorized: stats.uncategorizedCount
      },
      totalProcessed: stats.totalProcessed,
      errorCount: stats.errors.length
    });
    
    console.warn(`[FacilityStats] ${message}`, {
      breakdown: {
        openMRS: stats.openMRSCount,
        openSRP: stats.openSRPCount,
        aaloClinic: stats.aaloClinicCount,
        eMIS: stats.eMISCount,
        uncategorized: stats.uncategorizedCount
      }
    });
  }

  /**
   * Log successful statistics calculation
   */
  logSuccessfulCalculation(totalRecords: number, facilityCount: number, errorCount: number): void {
    this.addLog('info', `Statistics calculated successfully: ${totalRecords} records across ${facilityCount} facilities`, {
      totalRecords,
      facilityCount,
      errorCount,
      successRate: facilityCount > 0 ? ((facilityCount - errorCount) / facilityCount * 100).toFixed(2) + '%' : '0%'
    });
    
    console.info(`[FacilityStats] Processed ${totalRecords} records across ${facilityCount} facilities (${errorCount} errors)`);
  }

  /**
   * Log facility lookup failure
   */
  logFacilityLookupFailure(facilityId: string, error: string): void {
    this.addLog('error', `Facility lookup failed for ${facilityId}: ${error}`, {
      facilityId,
      error,
      operation: 'facility_lookup'
    });
    
    console.error(`[FacilityStats] Facility lookup failed for ${facilityId}:`, error);
  }

  /**
   * Log unknown facility type encountered
   */
  logUnknownFacilityType(facilityId: string, facilityName?: string, facilityType?: string): void {
    this.addLog('warn', `Unknown facility type encountered for facility ${facilityId}`, {
      facilityId,
      facilityName,
      facilityType,
      operation: 'facility_categorization'
    });
    
    console.warn(`[FacilityStats] Unknown facility type for ${facilityId}:`, { facilityName, facilityType });
  }

  /**
   * Log batch processing metrics
   */
  logBatchProcessingMetrics(batchNumber: number, batchSize: number, successCount: number, errorCount: number): void {
    this.addLog('info', `Batch ${batchNumber} processed: ${successCount} success, ${errorCount} errors`, {
      batchNumber,
      batchSize,
      successCount,
      errorCount,
      batchSuccessRate: batchSize > 0 ? (successCount / batchSize * 100).toFixed(2) + '%' : '0%'
    });
  }

  /**
   * Log cache performance metrics
   */
  logCacheMetrics(cacheHits: number, cacheMisses: number, cacheSize: number): void {
    const totalRequests = cacheHits + cacheMisses;
    const hitRate = totalRequests > 0 ? (cacheHits / totalRequests * 100).toFixed(2) + '%' : '0%';
    
    this.addLog('info', `Cache performance: ${hitRate} hit rate (${cacheHits}/${totalRequests})`, {
      cacheHits,
      cacheMisses,
      cacheSize,
      hitRate,
      totalRequests
    });
    
    console.info(`[FacilityStats] Cache hit rate: ${hitRate} (size: ${cacheSize})`);
  }

  /**
   * Get recent logs for debugging
   */
  getRecentLogs(count: number = 50): LogEntry[] {
    return this.logs.slice(-count);
  }

  /**
   * Get error logs only
   */
  getErrorLogs(): LogEntry[] {
    return this.logs.filter(log => log.level === 'error');
  }

  /**
   * Get logs by facility ID
   */
  getLogsByFacility(facilityId: string): LogEntry[] {
    return this.logs.filter(log => 
      log.context?.facilityId === facilityId
    );
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Get summary statistics of logs
   */
  getLogSummary(): { total: number; errors: number; warnings: number; info: number } {
    return {
      total: this.logs.length,
      errors: this.logs.filter(log => log.level === 'error').length,
      warnings: this.logs.filter(log => log.level === 'warn').length,
      info: this.logs.filter(log => log.level === 'info').length
    };
  }

  /**
   * Add a log entry
   */
  private addLog(level: LogEntry['level'], message: string, context?: Record<string, any>): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context
    };
    
    this.logs.push(logEntry);
    
    // Keep only the most recent logs to prevent memory issues
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }
}