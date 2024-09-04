import { Client, ClientOptions } from "@elastic/elasticsearch";
import { RequestBody } from "@elastic/elasticsearch/lib/Transport";
import { ELASTICSEARCH_HOST, ELASTIC_PASSWORD, ELASTIC_USER, maxCompressedResponseSize, requestTimeoutInMS } from "@providers/elasticsearch/constants";


interface ESRequestOptions {
  authHeader: string;
  esUrl: string;
}
/**
 * Establish connection to Elasticsearch
 */
const clientOptions: ClientOptions = {
  nodes: ELASTICSEARCH_HOST,
  compression: "gzip",
  resurrectStrategy: "ping",
  requestTimeout: requestTimeoutInMS, // 10 Minutes
  maxCompressedResponseSize: maxCompressedResponseSize,
  auth: {
    username: ELASTIC_USER,
    password: ELASTIC_PASSWORD,
  },
};

// Establish connection to Elasticsearch
export const esBaseClient = new Client(clientOptions);

/**
 * Method to generate the ElasticSearch Auth Header
 * @param esEndpoint 
 * @returns 
 */
export const getESAuthHeader = (esEndpoint: string) => {
  return {
    esUrl: `${ELASTICSEARCH_HOST[0]}/${esEndpoint}`,
    authHeader: 'Basic ' + Buffer.from(ELASTIC_USER + ':' + ELASTIC_PASSWORD).toString('base64')
  }
}

/**
 * Method to create an Elasticsearch Index
 * @param indexName 
 * @param body 
 * @param master_timeout 
 * @param timeout 
 * @param wait_for_active_shards 
 * @returns 
 */
export async function createESIndex(indexName: string, body: RequestBody) {
  const esAuthOptions: ESRequestOptions = getESAuthHeader(indexName);
  try {
    const response = await fetch(esAuthOptions.esUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': esAuthOptions.authHeader,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Index created successfully:", data);
    return Promise.resolve(true);
  } catch (error) {
    console.error("Error creating index:", (error as any).message || error);
    throw new Error(`Error creating new index: ${(error as any).message || error}`);
  }
}
/**
 * Method to check if an Elasticsearch Index exists
 * @param indexName 
 * @returns 
 */
export async function doesESIndexExist(indexName: string) {
  try {
    const indexInstance = await checkESIndexAndGetUUID(indexName);
    console.log("Index instance is - ");
    console.log(indexInstance);
    return Promise.resolve({ exists: true, indexInstance: indexInstance });
  } catch (error) {
    console.error("Error checking index existence:", error);
    return Promise.resolve({ exists: false });
  }
}



/**
 * Method to check if an Elasticsearch Index exists and get its UUID
 * @param indexName 
 * @returns 
 */
async function checkESIndexAndGetUUID(indexName: string) {
  const esAuthOptions: ESRequestOptions = getESAuthHeader(indexName);

  try {
    // Check if the index exists
    const existsResponse = await fetch(esAuthOptions.esUrl, {
      method: 'HEAD',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': esAuthOptions.authHeader
      }
    });

    if (existsResponse.status === 200) {
      // Get index information
      const indexInfoResponse = await fetch(esAuthOptions.esUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': esAuthOptions.authHeader
        }
      });

      if (!indexInfoResponse.ok) {
        throw new Error(`HTTP error! status: ${indexInfoResponse.status}` as string);
      }

      const indexInfo = await indexInfoResponse.json();
      console.log(`Body of Index - ${indexName} is ${JSON.stringify(indexInfo[indexName])}`);
      console.log(indexInfo[indexName]);
      console.log(`UUID of ${indexName} is ${indexInfo[indexName].settings.index.uuid}`);

      return indexInfo[indexName].settings.index.uuid;
    } else {
      console.log(`Index ${indexName} does not exist.`);
      return null;
    }
  } catch (error) {
    if ((error as any).response && (error as any).response.status === 404) {
      console.log(`Index ${indexName} does not exist.`);
      return null;
    } else {
      console.error("Error checking index existence:", (error as any).message || error);
      throw new Error(`Error checking index named - ${indexName}'s existence | ${(error as any).message || error}` as string);
    }
  }
}

/**
 * Method to delete an Elasticsearch Index
 * @param indexName 
 * @param ignore_unavailable OPTIONAL - Ignore unavailable index
 * @returns boolean - true if index is deleted successfully
 */

// Example usage of deleteESIndex function
export async function deleteESIndex(indexName: string, ignore_unavailable = true) {
  const esAuthOptions: ESRequestOptions = getESAuthHeader(indexName);

  const indexUUID = await checkESIndexAndGetUUID(indexName);

  if (!indexUUID && ignore_unavailable) {
    console.log("Index does not exist, skipping delete");
    return Promise.resolve(true);
  } else if (!indexUUID && !ignore_unavailable) {
    throw new Error(`Index ${indexName} does not exist` as string);
  }

  try {
    console.log("Deleting Index:", indexName);
    const response = await fetch(esAuthOptions.esUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': esAuthOptions.authHeader
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}` as string);
    }

    const data = await response.json();
    console.log("Index deleted successfully");
    console.log("Status:", response.status);
    console.log("Headers:", response.headers);
    console.log("Data:", data);
    return Promise.resolve(true);
  } catch (error) {
    console.error("Exception in Delete Index:", (error as any).message || error);
    throw new Error(`Index ${indexName} could not be deleted | ${(error as any).message || error}` as string);
  }
}


/**
 * Method to remove existing Elasticsearch Index and create a new one (with mapping)
 * Warning: This method will delete the existing index and all its data
 * @param esIndexName 
 * @param esIndexBody 
 * @returns 
 */
export async function dropAndGenerateIndex(esIndexName: string, esIndexBody: RequestBody) {

  try {
    const isIndexDeleted = await deleteESIndex(esIndexName);
    console.log(`Index deleted successfully - ${String(isIndexDeleted)}`);
    return await createESIndex(esIndexName, esIndexBody);

  } catch (error) {
    console.error("Error occurred while deleting index:", error);
    throw new Error(`Error occurred: Index ${esIndexName} could not be deleted | ${(error as any).message || error}` as string);
  }
}

/**
 * Method to update the mapping of an existing Elasticsearch Index
 * @param indexName
 * @param mappingBody
 * @returns boolean - true if mapping is updated successfully
 */
export async function updateESIndexMapping(esIndexName: string, esIndexBody: RequestBody):Promise<boolean> {
  const esAuthOptions: ESRequestOptions = getESAuthHeader(esIndexName);
  console.log("Updating mapping for index:", esIndexName);
  try {
    console.log("Hello 2");
    const response = await fetch(`${esAuthOptions.esUrl}/_mapping`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': esAuthOptions.authHeader
      },
      body: JSON.stringify(esIndexBody),
    });
    const data = await response.json();
    console.log("Hello 3");
    console.log(data);
    
    if (!response.ok) {
      return Promise.resolve(false);
    }

    
    console.log("Mapping updated successfully:", data);
    return Promise.resolve(true);
  } catch (error) {
    console.error("Error updating mapping:", (error as any).message || error);
    throw new Error(`Error occurred: Mapping for Index ${esIndexName} could not be updated | ${(error as any).message || error}` as string);
  }
}