import { RequestBody } from "@elastic/elasticsearch/lib/Transport";
/**
 * Elasticsearch mapping for Patient Facility Nested Object mapping
 */
export const ESPatientFacilityMapping = {
  type: "object",
  properties: {
    id: { type: "long" },
    name: { type: "text" },
    solutionType: { type: "keyword" },
    divisionCode: { type: "short" },
    districtCode: { type: "short" },
    upazilaCode: { type: "short" },
    catchment: { type: "long" },
    careLevel: { type: "keyword" },
    ownership: { type: "keyword" },
    orgType: { type: "keyword" },
  },
};

/**
 * Elasticsearch mapping for Patient Admin Nested Object mapping
 */
export const ESPatientModifierAdminMapping = {
  type: "object",
  properties: {
    id: { type: "long" },
    name: { type: "text" },
  },
};


/**
 * Elasticsearch mapping for Patient Index
 * Mapping fields are defined in accordance to
 * the fields in the Patient Model coming from
 * Cassandra databse
 */
export const ESPatientMapping = {
  properties: {
    health_id: {
      type: "text",
      analyzer: "autocomplete",
      search_analyzer: "standard",
      fields: {
        keyword: {
          type: "keyword",
        },
      },
    },
    active: { type: "boolean" },
    address_line: { type: "text" },
    area_mouja: { type: "keyword" },
    assigned_by: { type: "keyword" },
    bin_brn: {
      type: "text",
      analyzer: "autocomplete",
      search_analyzer: "standard",
    },
    blood_group: { type: "keyword" },
    city_corporation_id: { type: "short" },
    confidential: { type: "boolean" },
    country_code: { type: "keyword" },
    created_at: { type: "date" },
    created_client_id: { 
      type: "long"
    },
    created_facility_id: { 
      type: "long"
    },
    created_by: {
      type: "nested",
      properties: {
        facility: { ...ESPatientFacilityMapping },
        provider: {
          type: "text",
          analyzer: "autocomplete",
          search_analyzer: "standard",
        },
        // admin: { type: "keyword" },
        admin: { ...ESPatientModifierAdminMapping }
      },
    },
    date_of_birth: { type: "date" },
    date_of_death: { type: "date" },
    disability: { type: "keyword" },
    district_id: { type: "short" },
    division_id: { type: "short" },
    dob_type: { type: "keyword" },
    edu_level: {
      type: "text",
      analyzer: "autocomplete",
      search_analyzer: "standard",
    },
    ethnicity: { type: "keyword" },
    fathers_brn: { type: "keyword" },
    fathers_given_name: { type: "text" },
    fathers_name_bangla: { type: "text" },
    fathers_nid: {
      type: "text",
      analyzer: "autocomplete",
      search_analyzer: "standard",
    },
    fathers_sur_name: { type: "text" },
    fathers_uid: { type: "keyword" },
    full_name_bangla: { type: "text" },
    gender: { type: "keyword" },
    given_name: {
      type: "text", "fields": {
        "keyword": {
          "type": "keyword",
        },
      },
    },
    hid_card_status: { type: "keyword" },
    holding_number: { type: "keyword" },
    household_code: { type: "keyword" },
    index_time: { type: "date" },
    index_updated_time: { type: "date" },
    marital_relations: { type: "keyword" },
    marital_status: { type: "keyword" },
    marriage_id: { type: "keyword" },
    merged_with: { type: "keyword" },
    mothers_brn: { type: "keyword" },
    mothers_given_name: { type: "text" },
    mothers_name_bangla: { type: "text" },
    mothers_nid: { type: "keyword" },
    mothers_sur_name: { type: "text" },
    mothers_uid: { type: "keyword" },
    national_id: {
      type: "text",
      analyzer: "autocomplete",
      search_analyzer: "standard",
    },
    nationality: { type: "keyword" },
    occupation: { type: "keyword" },
    pending_approvals: { type: "keyword" },
    permanent_address_line: { type: "text" },
    permanent_area_mouja: { type: "keyword" },
    permanent_city_corporation_id: { type: "keyword" },
    permanent_country_code: { type: "keyword" },
    permanent_district_id: { type: "keyword" },
    permanent_division_id: { type: "keyword" },
    permanent_holding_number: { type: "keyword" },
    permanent_post_code: { type: "keyword" },
    permanent_post_office: { type: "keyword" },
    permanent_rural_ward_id: { type: "keyword" },
    permanent_street: { type: "text" },
    permanent_union_or_urban_ward_id: { type: "keyword" },
    permanent_upazila_id: { type: "keyword" },
    permanent_village: { type: "text" },
    phone_no: {
      type: "text",
      analyzer: "autocomplete",
      search_analyzer: "standard",
    },
    phone_number_area_code: { type: "keyword" },
    phone_number_country_code: { type: "keyword" },
    phone_number_extension: { type: "keyword" },
    place_of_birth: { type: "keyword" },
    post_code: { type: "keyword" },
    post_office: { type: "keyword" },
    primary_contact: { type: "keyword" },
    primary_contact_no: {
      type: "text",
      analyzer: "autocomplete",
      search_analyzer: "standard",
    },
    primary_contact_number_area_code: { type: "keyword" },
    primary_contact_number_country_code: { type: "keyword" },
    primary_contact_number_extension: { type: "keyword" },
    relations: { type: "text" },
    religion: { type: "short" },
    rural_ward_id: { type: "keyword" },
    status: { type: "keyword" },
    street: { type: "text" },
    sur_name: { type: "text" },
    uid: { type: "keyword" },
    union_or_urban_ward_id: { type: "short" },
    upazila_id: { type: "short" },
    updated_at: { type: "date" },
    updated_facility_id: { type: "long" },
    updated_by: {
      type: "nested",
      properties: {
        facility: { ...ESPatientFacilityMapping },
        provider: {
          type: "text",
          analyzer: "autocomplete",
          search_analyzer: "standard",
        },
        admin: { type: "keyword" },
      },
    },
    village: { type: "text" },
  },
};

/**
 * Elasticsearch Patient Index Body
 */
export const ESPatientIndexBody:RequestBody = {
  mappings: ESPatientMapping,
  settings: {
    analysis: {
      filter: {
        autocomplete_filter: {
          type: "edge_ngram",
          min_gram: 1,
          max_gram: 20,
        },
      },
      analyzer: {
        autocomplete: {
          type: "custom",
          tokenizer: "autocomplete",
          filter: ["lowercase", "autocomplete_filter"],
        },
      },
      tokenizer: {
        autocomplete: {
          type: "edge_ngram",
          min_gram: 1,
          max_gram: 20,
          token_chars: ["letter", "digit", "whitespace"],
        },
      },
    },
  },
}
