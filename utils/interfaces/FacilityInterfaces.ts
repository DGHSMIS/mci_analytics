export interface FacilityInterface {
  id: number | string;
  name?: string;
  address?: string;
  solutionType: string;
  divisionCode?: string;
  districtCode?: string;
  upazilaCode?: string;
  catchment?: string;
  careLevel?: string;
  ownership?: string;
  orgType?: string;
  hasApiError?: boolean;
}


export interface HRISFacilityInterface {
  name: string;
  url: string;
  id: string;
  code: string;
  active: string;
  createdAt: string;
  updatedAt: string;
  coordinates: [string, string];
  identifiers: {
    agency: string;
    context: string;
    id: string;
  };
  properties: {
    ownership: string;
    org_type_id: string;
    org_type: string;
    org_level: string;
    care_level: string | null;
    deleted_at: string | null;
    services: string[];
    locations: {
      division_code: string;
      district_code: string;
      upazila_code: string;
      paurasava_code: string;
      union_code: string;
      ward_code: string;
    };
    contacts: {
      name: string;
      email: string;
      phone: string;
      mobile: string;
      fax: string | null;
    };
    catchment: [string];
    photo: string | null;
  };
}
