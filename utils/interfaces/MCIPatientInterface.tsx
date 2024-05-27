import { FacilityInterface } from "@utils/interfaces/FacilityInterfaces";

export interface Admin {
  id: string | null;
  name: string | null;
}

export interface CreatedBy {
  facility: FacilityInterface | null;
  provider: string | null;
  admin: string | null;
}

export interface UpdatedBy {
  facility: FacilityInterface | null;
  provider: string | null;
  admin: Admin | null;
}

export interface Status {
  type: string | null;
}

export interface Address {
  address_line: string | null;
  division_id: string | null;
  district_id: string | null;
  upazila_id: string | null;
  country_code: string | null;
}

export default interface MCIPatientInterface {
  hid: string | null;
  nid: string | null;
  given_name: string;
  sur_name: string | null;
  date_of_birth: string | null;
  dob_type: string | null;
  gender: string | null;
  occupation: string | null;
  edu_level: string | null;
  religion: string | null;
  blood_group: string | null;
  disability: string | null;
  present_address: Address | null;
  marital_status: string | null;
  confidential: string | null;
  created_by: CreatedBy | null;
  updated_by: UpdatedBy | null;
  status: Status | null;
  active: boolean | null;
  hid_card_status: string | null;
  provider: any;
  created: string | null;
  modified: string | null;
}
