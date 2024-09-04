import { DebugElasticProvider, mciServiceLogIndexName } from "@providers/elasticsearch/constants";
import { esBaseClient } from '@providers/elasticsearch/ESBase';
import { ESMciServiceLogIndexBody } from './ESMciServiceLogMapping';
import { ESMciServiceLogInterface } from './interfaces/ESMciServiceLogInterface';

/**
 * Function to create the mciServiceLogIndex if it doesn't exist
 */
export async function createMciServiceLogIndex() {
    try {
      const indexExists = await esBaseClient.indices.exists({ index: mciServiceLogIndexName });
      if (!indexExists.body) {
        await esBaseClient.indices.create({
          index: mciServiceLogIndexName,
          body: ESMciServiceLogIndexBody,
        });
        if (DebugElasticProvider) console.log(`Index "${mciServiceLogIndexName}" created successfully.`);
      } else {
        if (DebugElasticProvider) console.log(`Index "${mciServiceLogIndexName}" already exists.`);
      }
    } catch (error) {
      console.error("Error creating mciServiceLogIndex:", error);
    }
  }
  
  /**
   * Log API request and response to Elasticsearch, with index existence check
   * @param level Log level (info, error, etc.)
   * @param message Log message
   * @param request Request details (payload, headers)
   * @param response Response details (status, body)
   */
  export async function logApiRequest(level: string, message: string, request: any, response: any, service_name:string="mciService") {
    // Ensure the index exists before logging
    try {
      const indexExists = await esBaseClient.indices.exists({ index: mciServiceLogIndexName });
      if (!indexExists.body) {
        await createMciServiceLogIndex();
      }
    } catch (error) {
      console.error("Error checking or creating index:", error);
      return;  // Optionally return or handle the error
    }
  
    // Log the entry once the index exists
    const logEntry: ESMciServiceLogInterface = {
      timestamp: new Date().toISOString(),
      level,
      message,
      request,
      response,
      service_name: service_name, // You can dynamically set the service name if needed
    };
  
    try {
      await esBaseClient.index({
        index: mciServiceLogIndexName,
        body: logEntry,
      });
  
      if (DebugElasticProvider) console.log(`Log entry indexed successfully in ${mciServiceLogIndexName}.`);
    } catch (error) {
      console.error("Error indexing log entry:", error);
    }
  }