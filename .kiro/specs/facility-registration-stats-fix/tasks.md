# Implementation Plan: Facility Registration Stats Fix

## Overview

This implementation plan addresses the facility type registration statistics API discrepancy by restructuring the counting logic, improving error handling, and ensuring data consistency. The approach uses a single aggregation-based method to eliminate counting discrepancies.

## Tasks

- [x] 1. Create enhanced interfaces and types
  - Create updated `FacilityTypeWiseStatsInterface` with validation fields
  - Define `FacilityCategorization` and `FacilityCategorizationService` interfaces
  - Add error tracking types for comprehensive logging
  - _Requirements: 1.1, 2.1, 4.1_

- [ ]* 1.1 Write property test for interface validation
  - **Property 1: Count Conservation**
  - **Validates: Requirements 1.1, 1.4**

- [ ] 2. Implement facility categorization service
  - [x] 2.1 Create `FacilityCategorizationService` class
    - Implement batch categorization logic
    - Add error handling for individual facility failures
    - Include caching mechanism for facility lookups
    - _Requirements: 2.1, 2.2, 5.1, 5.2_

  - [ ]* 2.2 Write property test for categorization completeness
    - **Property 2: Complete Categorization**
    - **Validates: Requirements 1.2, 2.1, 3.2**

  - [ ]* 2.3 Write property test for error handling
    - **Property 3: Error Handling Graceful Degradation**
    - **Validates: Requirements 1.3, 2.2, 3.4, 4.4**

- [ ] 3. Refactor main statistics calculation function
  - [x] 3.1 Replace dual-query approach with single aggregation
    - Modify `getTotalRegistrationStats` to use single Elasticsearch query
    - Implement comprehensive facility bucket processing
    - Add validation logic for count consistency
    - _Requirements: 3.1, 3.3, 1.1_

  - [ ]* 3.2 Write property test for data source consistency
    - **Property 4: Consistent Data Source Usage**
    - **Validates: Requirements 3.1, 3.3**

  - [ ]* 3.3 Write unit tests for statistics calculation
    - Test specific facility type scenarios
    - Test edge cases (empty results, missing facilities)
    - _Requirements: 1.1, 1.2_

- [ ] 4. Implement enhanced error handling and logging
  - [x] 4.1 Add comprehensive logging for categorization failures
    - Log facility IDs and error details for failed lookups
    - Add validation warnings when counts don't sum correctly
    - Include detailed error tracking in response
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ]* 4.2 Write property test for error logging
    - **Property 5: Comprehensive Error Logging**
    - **Validates: Requirements 2.3, 4.1, 4.2, 4.3**

- [x] 5. Checkpoint - Ensure core functionality works
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement performance optimizations
  - [x] 6.1 Add batch processing for facility categorization
    - Implement `categorizeFacilitiesInBatches` function
    - Add configurable batch size for processing
    - Optimize Promise handling for concurrent requests
    - _Requirements: 5.1, 5.3_

  - [ ]* 6.2 Write property test for cache efficiency
    - **Property 6: Cache Efficiency**
    - **Validates: Requirements 5.1, 5.2**

  - [ ]* 6.3 Write property test for batch processing
    - **Property 7: Batch Processing Optimization**
    - **Validates: Requirements 5.3**

- [ ] 7. Update the main API route
  - [x] 7.1 Integrate new statistics calculation into route handler
    - Replace existing `getTotalRegistrationStats` call
    - Add error response handling for validation failures
    - Update response headers and caching configuration
    - _Requirements: 1.1, 4.3_

  - [ ]* 7.2 Write integration tests for API route
    - Test complete API response structure
    - Test error scenarios and response codes
    - _Requirements: 1.1, 4.3_

- [x] 8. Add monitoring and validation
  - [x] 8.1 Implement runtime validation checks
    - Add count sum validation in production
    - Include validation status in API response
    - Add metrics for categorization success rates
    - _Requirements: 1.4, 4.3_

  - [ ]* 8.2 Write unit tests for validation logic
    - Test validation success and failure scenarios
    - Test metrics collection and reporting
    - _Requirements: 1.4, 4.3_

- [x] 9. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties across all inputs
- Unit tests validate specific examples and edge cases
- The implementation maintains backward compatibility with existing API consumers
- Performance optimizations ensure the API can handle large facility datasets efficiently