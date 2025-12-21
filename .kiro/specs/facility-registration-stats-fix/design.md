# Design Document

## Overview

This design addresses the facility type registration statistics API discrepancy where the total count doesn't match the sum of individual platform counts. The solution involves restructuring the counting logic to ensure data consistency, improving error handling, and optimizing the facility categorization process.

## Architecture

The current API has two separate counting mechanisms:
1. A total count query that counts all documents in the index
2. A facility aggregation query that groups by `created_facility_id`

The fix involves using a single aggregation-based approach that ensures all records are counted exactly once and properly categorized.

## Components and Interfaces

### Enhanced Registration Stats Interface

```typescript
interface FacilityTypeWiseStatsInterface {
  totalCount: number;
  openMRSCount: number;
  openSRPCount: number;
  aaloClincCount: number;
  eMISCount: number;
  uncategorizedCount: number; // New field for facilities that couldn't be categorized
  validationPassed: boolean;   // New field to indicate if counts sum correctly
}
```

### Facility Categorization Service

```typescript
interface FacilityCategorization {
  facilityId: string;
  facilityType: 'openMRS+' | 'openSRP' | 'aaloClinic' | 'eMIS' | 'uncategorized';
  facilityName?: string;
  error?: string;
}

interface FacilityCategorizationService {
  categorizeFacilities(facilityIds: string[]): Promise<FacilityCategorization[]>;
  categorizeSingleFacility(facilityId: string): Promise<FacilityCategorization>;
}
```

## Data Models

### Elasticsearch Aggregation Query Structure

```typescript
interface FacilityAggregationQuery {
  aggs: {
    facility_stats: {
      terms: {
        field: "created_facility_id";
        size: number;
        missing: "unknown"; // Handle records with missing facility_id
      };
    };
  };
}
```

### Enhanced Counting Logic

The new approach uses a single aggregation query with post-processing:

1. **Single Source of Truth**: Use facility aggregation as the primary data source
2. **Comprehensive Categorization**: Process all facility buckets, including those with missing IDs
3. **Validation**: Ensure sum of categories equals total from aggregation
4. **Error Tracking**: Track and report categorization failures

## Implementation Strategy

### Phase 1: Refactor Counting Logic

```typescript
async function getTotalRegistrationStatsFixed() {
  // Single aggregation query with larger size to capture all facilities
  const facilityAggregation = await esBaseClient.search({
    index: healthRecordESIndexName,
    body: {
      size: 0, // Only return aggregations
      aggs: {
        facility_stats: {
          terms: {
            field: "created_facility_id",
            size: 50000, // Increased size to capture all facilities
            missing: "unknown" // Handle missing facility IDs
          }
        }
      }
    }
  });

  const buckets = facilityAggregation.body.aggregations.facility_stats.buckets;
  const totalFromAggregation = buckets.reduce((sum, bucket) => sum + bucket.doc_count, 0);
  
  // Process facilities in batches for better performance
  const categorizedFacilities = await categorizeFacilitiesInBatches(buckets);
  
  // Calculate counts and validate
  const stats = calculateStatsFromCategorization(categorizedFacilities, totalFromAggregation);
  
  return stats;
}
```

### Phase 2: Batch Facility Categorization

```typescript
async function categorizeFacilitiesInBatches(buckets: any[]): Promise<FacilityCategorization[]> {
  const batchSize = 100;
  const results: FacilityCategorization[] = [];
  
  for (let i = 0; i < buckets.length; i += batchSize) {
    const batch = buckets.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(
      batch.map(bucket => categorizeSingleFacility(bucket.key, bucket.doc_count))
    );
    
    // Handle both successful and failed categorizations
    batchResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        // Handle failed categorization
        results.push({
          facilityId: batch[index].key,
          facilityType: 'uncategorized',
          error: result.reason?.message || 'Unknown error'
        });
      }
    });
  }
  
  return results;
}
```

### Phase 3: Enhanced Facility Categorization

```typescript
async function categorizeSingleFacility(facilityId: string, docCount: number): Promise<FacilityCategorization> {
  try {
    // Handle special cases first
    if (facilityId === "unknown") {
      return {
        facilityId,
        facilityType: 'uncategorized',
        docCount
      };
    }
    
    if (isAaloClinic(facilityId)) {
      return {
        facilityId,
        facilityType: 'aaloClinic',
        docCount
      };
    }
    
    // Fetch facility information with error handling
    const facilityInfo = await fetchAndCacheFacilityInfo(facilityId);
    const facilityType = getFacilitySolutionTypeFromName(facilityInfo.name ?? facilityId);
    
    return {
      facilityId,
      facilityType: facilityType === 'openSRP' ? 'openSRP' : 'openMRS+',
      facilityName: facilityInfo.name,
      docCount
    };
    
  } catch (error) {
    console.error(`Failed to categorize facility ${facilityId}:`, error);
    return {
      facilityId,
      facilityType: 'uncategorized',
      error: error.message,
      docCount
    };
  }
}
```

## Error Handling

### Graceful Degradation Strategy

1. **Individual Facility Failures**: Continue processing other facilities when one fails
2. **Partial Data**: Return partial results with clear indication of what failed
3. **Validation Warnings**: Log warnings when counts don't sum correctly
4. **Fallback Categorization**: Use facility ID patterns as fallback when API calls fail

### Logging Strategy

```typescript
interface CategoryStats {
  openMRSCount: number;
  openSRPCount: number;
  aaloClinicCount: number;
  eMISCount: number;
  uncategorizedCount: number;
  totalProcessed: number;
  errors: string[];
}

function logValidationResults(stats: CategoryStats, expectedTotal: number) {
  const calculatedTotal = stats.openMRSCount + stats.openSRPCount + 
                         stats.aaloClinicCount + stats.eMISCount + stats.uncategorizedCount;
  
  if (calculatedTotal !== expectedTotal) {
    console.warn(`Count validation failed: calculated=${calculatedTotal}, expected=${expectedTotal}`);
    console.warn('Individual counts:', stats);
  }
  
  if (stats.errors.length > 0) {
    console.error(`Categorization errors (${stats.errors.length}):`, stats.errors);
  }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing the acceptance criteria, several properties emerged that validate the core correctness requirements:

1. **Count Conservation**: The fundamental mathematical invariant that totals must equal sums
2. **Complete Categorization**: Every facility must be processed and categorized
3. **Error Isolation**: Individual failures shouldn't affect other processing
4. **Data Consistency**: Same data sources and consistent processing
5. **Performance Optimization**: Efficient processing through caching and batching

Some redundant properties were identified and consolidated:
- Requirements 1.1 and 1.4 both validate sum equality (combined into Property 1)
- Requirements 1.2 and 3.2 both ensure complete categorization (combined into Property 2)  
- Requirements 3.4 and 4.4 both address error isolation (combined into Property 4)

### Core Properties

**Property 1: Count Conservation**
*For any* set of facility aggregation data, the sum of all category counts (openMRS + openSRP + aaloClinic + eMIS + uncategorized) should equal the total count from the aggregation
**Validates: Requirements 1.1, 1.4**

**Property 2: Complete Categorization**
*For any* list of facility buckets from Elasticsearch aggregation, every facility should be assigned to exactly one category with no gaps or overlaps
**Validates: Requirements 1.2, 2.1, 3.2**

**Property 3: Error Handling Graceful Degradation**
*For any* facility that cannot be categorized due to lookup failures or missing data, it should be placed in the "uncategorized" category and processing should continue for other facilities
**Validates: Requirements 1.3, 2.2, 3.4, 4.4**

**Property 4: Consistent Data Source Usage**
*For any* statistics calculation, both total counts and categorized counts should derive from the same Elasticsearch query and index
**Validates: Requirements 3.1, 3.3**

**Property 5: Comprehensive Error Logging**
*For any* categorization failure or validation error, detailed error information should be logged including facility IDs and error details
**Validates: Requirements 2.3, 4.1, 4.2, 4.3**

**Property 6: Cache Efficiency**
*For any* facility that has been looked up previously, subsequent lookups should reuse cached data without making additional API calls
**Validates: Requirements 5.1, 5.2**

**Property 7: Batch Processing Optimization**
*For any* set of facilities to be categorized, the system should process them in batches rather than individual sequential calls when possible
**Validates: Requirements 5.3**

## Testing Strategy

### Dual Testing Approach

The implementation will use both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests** will focus on:
- Specific facility categorization examples (Aalo Clinic codes, DGHS facilities)
- Error handling scenarios (network failures, invalid facility IDs)
- Edge cases (empty aggregation results, missing facility information)
- Integration points between Elasticsearch and facility lookup services

**Property-Based Tests** will focus on:
- Universal properties that hold across all facility data sets
- Comprehensive input coverage through randomized facility data
- Validation of mathematical invariants (count conservation)
- Error isolation and graceful degradation behaviors

### Property-Based Testing Configuration

- **Testing Library**: Use `fast-check` for TypeScript property-based testing
- **Test Iterations**: Minimum 100 iterations per property test
- **Test Tagging**: Each property test tagged with format: **Feature: facility-registration-stats-fix, Property {number}: {property_text}**

### Test Data Generation Strategy

**Smart Generators** will be created to:
- Generate realistic facility aggregation data with various facility types
- Create scenarios with missing or invalid facility information
- Simulate network failures and API timeouts for error testing
- Generate large datasets to test performance characteristics

The generators will constrain inputs to realistic ranges while ensuring comprehensive coverage of edge cases and error conditions.