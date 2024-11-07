/**
 * MCI Response for Patient Info
 */
export default interface PatientInfoInterface {
  hid: string;
  nid: string;
  name_bangla: string;
  given_name: string;
  sur_name: string;
  date_of_birth: string;
  dob_type: string;
  gender: string;
  nationality: string;
  present_address: {
    address_line: string;
    division_id: string;
    district_id: string;
    upazila_id: string;
    country_code: string;
  };
  phone_number: {
    number: string;
  };
  confidential: string;
  created_by: {
    facility: {
      id: string;
      name: string | null;
    };
    provider: any | null;
    admin: any | null;
  };
  updated_by: {
    facility: {
      id: string;
      name: string | null;
    };
    provider: any | null;
    admin: any | null;
  };
  status: {
    type: string;
  };
  active: boolean;
  hid_card_status: string;
  provider: any | null;
  modified: string;
  created: string;
}

export interface MaritalStatusInterface {
  [key: string]: string;
}

export interface ReligionInterface {
  [key: string]: string;
}

export interface BloodGroupInterface {
  [key: string]: string;
}

export interface DisabilityInterface {
  [key: string]: string;
}

export interface OccupationInterface {
  [key: string]: string;
}

export interface GenderInterface {
  [key: string]: string;
}

export interface EducationInterface {
  [key: string]: string;
}
