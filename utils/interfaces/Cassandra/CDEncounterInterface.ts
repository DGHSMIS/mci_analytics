import { TimeUuid } from "./CDPatientInterface";

export interface CDEncounterInterface {
    encounter_id: string;
    received_at: TimeUuid;
    content_v1: string | null;
    content_v2: string | null;
    content_v3: string | null;
    content_version: string | null;
    content_version_v1: string | null;
    content_version_v2: string | null;
    content_version_v3: string | null;
    created_by: string;
    health_id: string;
    encounter_confidentiality: string;
    patient_confidentiality: string;
    updated_at: TimeUuid;
    updated_by: string;
}