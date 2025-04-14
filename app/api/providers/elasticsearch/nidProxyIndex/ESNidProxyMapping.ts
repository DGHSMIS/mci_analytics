import { RequestBody } from "@elastic/elasticsearch/lib/Transport";

/**
 * Elasticsearch mapping for VerificationInfo Index
 * Mapping fields are defined in accordance with
 * the fields in the VerificationInfoInterface
 */

export const ESNidProxyMapping = {
    properties: {
      id: {
        type: "keyword", // BigInt converted to string, stored as a keyword
      },
      client_id: {
        type: "keyword", // Optimized for filtering
      },
      performer_id: {
        type: "text",
        analyzer: "autocomplete",
        search_analyzer: "standard",
        fields: {
          keyword: {
            type: "keyword",
          },
        },
      },
      nid_requested: {
        type: "keyword",
      },
      nid_10_digit: {
        type: "keyword",
      },
      nid_17_digit: {
        type: "keyword",
      },
      nid_photo: {
        type: "text",
        analyzer: "standard",
      },
      brn: {
        type: "keyword",
      },
      dob: {
        type: "keyword", // Stored as a string in the database
      },
      mobile: {
        type: "keyword",
      },
      info_hash: {
        type: "keyword",
      },
      token: {
        type: "text",
        analyzer: "standard",
      },
      received_at: {
        type: "date", // Optimized for date filtering and range queries
      },
      generated_at: {
        type: "date", // Optimized for date filtering and range queries
      },
      time_took_ms: {
        type: "integer",
      },
      aes_key_salt: {
        type: "keyword",
      },
      request_doc_type: {
        type: "keyword",
      },
    },
  };

  /**
 * Elasticsearch Index Body for VerificationInfo
 */
export const ESNidProxyIndexBody: RequestBody = {
    mappings: ESNidProxyMapping,
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
  };