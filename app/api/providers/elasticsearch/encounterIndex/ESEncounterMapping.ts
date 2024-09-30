import { RequestBody } from "@elastic/elasticsearch/lib/Transport";

/**
 * Elasticsearch mapping for EncounterMapping Index
 * Mapping fields are defined in accordance to
 * the fields in the Patient Model coming from
 * Cassandra databse
**/



export const ESEncounterMapping = {
  properties: {
    encounter_id: {
      type: "text",
      analyzer: "autocomplete",
      search_analyzer: "standard",
      fields: {
        keyword: {
          type: "keyword",
        },
      },
    },
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
    patient_confidentiality: {
      type: "text",
      analyzer: "autocomplete",
      search_analyzer: "standard",
      fields: {
        keyword: {
          type: "keyword",
        },
      },
    },
    encounter_confidentiality: {
      type: "text",
      analyzer: "autocomplete",
      search_analyzer: "standard",
      fields: {
        keyword: {
          type: "keyword",
        },
      },
    },
    received_at: { type: "date" },
    created_facility_id: {
      type: "long"
    },
    content_v1: {
      type: "text"
    },
    content_v2: {
      type: "text"
    },
    content_v3: {
      type: "text",
      analyzer: "autocomplete",
      search_analyzer: "standard",
      fields: {
        keyword: {
          type: "keyword",
        },
      },
    },
    content_version: {
      type: "text"
    },
    content_version_v1: {
      type: "text"
    },
    content_version_v2: {
      type: "text"
    },
    content_version_v3: {
      type: "text"
    },
    updated_at: { type: "date" },
    updated_facility_id: { type: "long" },
    index_time: { type: "date" },
  },
};

/**
 * Elasticsearch Health Record Body
 */
export const ESEncounterIndexBody: RequestBody = {
  mappings: ESEncounterMapping,
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