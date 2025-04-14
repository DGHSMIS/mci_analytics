export interface ESPediatricNCDInterface {
    id: string;
    visit_id: string;
    health_id: string;
    patient_id: string;
    patient_name: string;
    date_of_visit:Date;
    dob: Date;
    gender: string;
    facility_code: string;
    facility_name: string;
    division_name: string;
    district_name: string;
    service_location: string;
    diseases_on_visit: string[];
    is_referred_to_higher_facility: boolean;
    is_follow_up:boolean;
    created_at: Date;
}
