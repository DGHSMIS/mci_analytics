export interface FacilityTypeWiseStatsInterface {
  totalCount: number;
  openMRSCount: number;
  openSRPCount: number;
  aaloClincCount: number;
  eMISCount: number;
  uncategorizedCount: number; // New field for facilities that couldn't be categorized
  validationPassed: boolean;   // New field to indicate if counts sum correctly
  message?: string;
  errors?: string[];          // New field for tracking categorization errors
}

export interface FacilityCategorization {
  facilityId: string;
  facilityType: 'openMRS+' | 'openSRP' | 'aaloClinic' | 'eMIS' | 'uncategorized';
  facilityName?: string;
  docCount: number;
  error?: string;
}

export interface FacilityCategorizationService {
  categorizeFacilities(facilityBuckets: FacilityBucket[]): Promise<FacilityCategorization[]>;
  categorizeSingleFacility(facilityId: string, docCount: number): Promise<FacilityCategorization>;
}

export interface FacilityBucket {
  key: string;
  doc_count: number;
}

export interface CategoryStats {
  openMRSCount: number;
  openSRPCount: number;
  aaloClinicCount: number;
  eMISCount: number;
  uncategorizedCount: number;
  totalProcessed: number;
  errors: string[];
}