# Requirements Document

## Introduction

Fix the facility type registration statistics API to ensure accurate counting and proper data aggregation. The current API has a discrepancy where the total count doesn't match the sum of individual platform counts, indicating issues with the counting logic and data categorization.

## Glossary

- **Health_Record**: A patient registration record in the Elasticsearch index
- **Facility_Type**: The platform/system type (OpenMRS+, VaxEPI/OpenSRP, Aalo Clinic, eMIS)
- **Registration_Stats**: Aggregated counts of health records by facility type
- **Facility_Categorization**: The process of determining facility type from facility information

## Requirements

### Requirement 1: Accurate Total Count Calculation

**User Story:** As a data analyst, I want the total registration count to equal the sum of all platform-specific counts, so that I can trust the accuracy of the statistics.

#### Acceptance Criteria

1. WHEN the API calculates registration statistics, THE System SHALL ensure the total count equals the sum of all platform counts
2. WHEN aggregating facility data, THE System SHALL account for all health records without gaps or overlaps
3. WHEN a facility cannot be categorized, THE System SHALL log the issue and include it in a separate "uncategorized" count
4. THE System SHALL validate that sum(openMRSCount + openSRPCount + aaloClinicCount + eMISCount + uncategorizedCount) equals totalCount

### Requirement 2: Comprehensive Facility Categorization

**User Story:** As a system administrator, I want all facilities to be properly categorized by type, so that no registrations are missed or miscounted.

#### Acceptance Criteria

1. WHEN processing facility aggregations, THE System SHALL categorize every facility based on facility information
2. WHEN facility information is unavailable, THE System SHALL handle the error gracefully and categorize as "uncategorized"
3. WHEN the facility categorization logic fails, THE System SHALL log detailed error information
4. THE System SHALL provide a fallback categorization mechanism for unknown facility types

### Requirement 3: Consistent Data Source Usage

**User Story:** As a developer, I want the API to use consistent data sources for all counts, so that the statistics are internally consistent.

#### Acceptance Criteria

1. WHEN calculating statistics, THE System SHALL use the same Elasticsearch query base for both total and categorized counts
2. WHEN aggregating facility data, THE System SHALL ensure all health records are included in exactly one category
3. THE System SHALL use the same index and filtering criteria for all count calculations
4. WHEN facility lookup fails, THE System SHALL handle the error without affecting other facility counts

### Requirement 4: Error Handling and Logging

**User Story:** As a system administrator, I want comprehensive error handling and logging, so that I can diagnose and fix data quality issues.

#### Acceptance Criteria

1. WHEN facility information lookup fails, THE System SHALL log the facility ID and error details
2. WHEN categorization logic encounters unknown facility types, THE System SHALL log the facility information
3. WHEN aggregation results don't sum correctly, THE System SHALL log a warning with detailed counts
4. THE System SHALL continue processing other facilities when individual facility lookups fail

### Requirement 5: Performance Optimization

**User Story:** As an API consumer, I want the registration statistics to load quickly, so that dashboard performance is acceptable.

#### Acceptance Criteria

1. WHEN processing facility aggregations, THE System SHALL minimize the number of facility lookup calls
2. WHEN facility information is cached, THE System SHALL reuse cached data appropriately
3. THE System SHALL process facility categorization efficiently using batch operations where possible
4. WHEN the aggregation size is large, THE System SHALL handle it without timeout errors