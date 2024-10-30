import { RequestBody } from "@elastic/elasticsearch/lib/Transport";

/**
 * Elasticsearch mapping for EncounterMapping Index
 * Mapping fields are defined in accordance to
 * the fields in the Patient Model coming from
 * Cassandra databse
**/



export const ESPediatricNCDMapping = {
  properties: {
    id: {
      type: "text",
      analyzer: "autocomplete",
      search_analyzer: "standard",
      fields: {
        keyword: {
          type: "keyword",
        },
      },
    },
    patient_id: {
      type: "text",
      analyzer: "autocomplete",
      search_analyzer: "standard",
      fields: {
        keyword: {
          type: "keyword",
        },
      },
    },
    patient_name: {
      type: "text",
      analyzer: "autocomplete",
      search_analyzer: "standard",
      fields: {
        keyword: {
          type: "keyword",
        },
      },
    },
    date_of_visit: { type: "date" },
    dob: { type: "date" },
    gender: { type: "keyword" },
    facility_id: {
      type: "long"
    },
    service_location: { type: "keyword" },
    disease_id: {
      type: "long"
    },
    is_referred_to_higher_facility: { type: "boolean" },
    is_follow_up: { type: "boolean" }
  },
};

/**
 * Elasticsearch Health Record Body
 */
export const ESPediatricNCDIndexBody: RequestBody = {
  mappings: ESPediatricNCDMapping,
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


// https://www.elastic.co/guide/en/elasticsearch/reference/current/search-with-synonyms.html
// https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-synonym-tokenfilter.html