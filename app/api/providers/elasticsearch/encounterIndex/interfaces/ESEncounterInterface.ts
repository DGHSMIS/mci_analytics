export interface CreateAndUpdatedByEncounterInterface {
  facilityId: string | null;
  provider: string | null;
};
export interface ESEncounterInterface {
  encounter_id: string;
  health_id: string;
  patient_confidentiality: string;
  encounter_confidentiality: string;
  received_at: any;
  content_v1: string | null;
  content_v2: string | null;
  content_v3: string | null;
  content_version: string | null;
  content_version_v1: string | null;
  content_version_v2: string | null;
  content_version_v3: string | null;
  created_facility_id: Number | null;
  created_by: CreateAndUpdatedByEncounterInterface;
  updated_at: any;
  updated_by: CreateAndUpdatedByEncounterInterface;
  updated_facility_id: Number | null;
  indexed_time: any;
}
