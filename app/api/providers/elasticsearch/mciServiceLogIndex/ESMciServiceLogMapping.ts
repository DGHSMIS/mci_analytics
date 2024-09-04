import { RequestBody } from "@elastic/elasticsearch/lib/Transport";

/**
 * Elasticsearch mapping for MCI Service Log Index
 * Fields include log level, message, timestamp, request, and response details
 */
export const ESMciServiceLogMapping = {
  properties: {
    timestamp: { type: "date" },   // Date type for timestamp
    level: { type: "keyword" },    // Keyword type for log level (info, error, etc.)
    message: {
      type: "text",                // Full-text search on message
      analyzer: "standard",
      fields: {
        keyword: {
          type: "keyword",         // Exact match on the message
        },
      },
    },
    request: { type: "object" },   // Object type to store the request payload/headers
    response: { type: "object" },  // Object type to store the response status/body
    service_name: { type: "keyword" }, // Service name as a keyword for exact match
  },
};

/**
 * Elasticsearch MCI Service Log Body (including mappings and settings)
 */
export const ESMciServiceLogIndexBody: RequestBody = {
  mappings: ESMciServiceLogMapping,
  settings: {
    number_of_shards: 1,
    number_of_replicas: 1,
    analysis: {
      analyzer: {
        standard: {
          type: "standard",
        },
      },
    },
  },
};
