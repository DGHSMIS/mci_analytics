import { TimeUuid } from "./CDPatientInterface";

export interface CDPatientUpdateLogInterface {
    year: string;
    event_id: TimeUuid;
    health_id: string;
    approved_by: string;
    change_set: string;
    event_type: string;
    requested_by: string;
}
