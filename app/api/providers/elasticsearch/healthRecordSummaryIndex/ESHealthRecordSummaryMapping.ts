import { RequestBody } from "@elastic/elasticsearch/lib/Transport";

/**
 * Elasticsearch mapping for Health Record Index
 * Mapping fields are defined in accordance to
 * the fields in the Patient Model coming from
 * Cassandra databse
 */
export const ESHealthRecordSummaryMapping = {
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
      bin_brn: {
        type: "text",
        analyzer: "autocomplete",
        search_analyzer: "standard",
      },
      created_at: { type: "date" },
      created_client_id: { 
        type: "long"
      },
      created_facility_id: { 
        type: "long"
      },
      national_id: {
        type: "text",
        analyzer: "autocomplete",
        search_analyzer: "standard",
      },
      updated_at: { type: "date" },
      updated_facility_id: { type: "long" },
    },
  };


/**
 * Elasticsearch Health Record Body
 */
export const ESHealthRecordSummaryIndexBody:RequestBody = {
    mappings: ESHealthRecordSummaryMapping,
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
  