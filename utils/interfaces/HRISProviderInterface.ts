export default interface HRISProviderInterface {
    name: string;
    url: string;
    id: string;
    active: string; // Note: this is a string in your JSON, consider using boolean if it represents a boolean value
    createdAt: string;
    updatedAt: string;
    birthDate: string;
    profile_pic_path: string;
    gender: string;
    organization: HRISProviderOrganization;
    identifiers: HRISProviderCodedIdentifier[];
    telecom: HRISProviderCodedIdentifier[];
    address:  HRISProviderAddress[]
    properties: HRISProviderPropertiesInterface;
  }

  ``
  
  export interface HRISProviderOrganization {
    reference: string;
    display: string;
    latitude: string;
    longitude: string;
    division_id: string;
    division_name: string;
    district_id: string;
    district_name: string;
    upazila_id: string;
    upazila_name: string;
  }
  
  export interface HRISProviderCodedIdentifier {
    system: string;
    value: string | null;
  }
  
  
  export interface HRISProviderAddress {
    text: string;
  }
  
  export interface HRISProviderPropertiesInterface {
    maritalStatus: string;
    freedomFighter: string;
    tribial: string;
    qualification: string | null;
    category: string;
    discipline: string;
    department: string | null;
    attendanceid: string | null;
    professionalDiscipline: string;
    designation: string;
    designationBdProfessionalCategory: string;
    designationDiscipline: string;
    machineid: string | null;
  }