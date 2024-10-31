

export interface ESPediatricNCDInterface {
    id: string;
    patient_id: string;
    patient_name: string;
    date_of_visit:Date;
    dob: Date;
    gender: string;
    facility_code: string;
    service_location: string;
    disease_id: string
    is_referred_to_higher_facility: boolean;
    is_follow_up:boolean;
}