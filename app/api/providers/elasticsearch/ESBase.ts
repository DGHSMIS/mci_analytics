import { Client, ClientOptions } from "@elastic/elasticsearch";
import { RequestBody } from "@elastic/elasticsearch/lib/Transport";
import { ELASTICSEARCH_HOST, ELASTIC_PASSWORD, ELASTIC_USER, maxCompressedResponseSize, requestTimeoutInMS } from "@providers/elasticsearch/constants";


interface ESRequestOptions {
  authHeader: string;
  esUrl: string;
}

/**
 * Method to get all available Elasticsearch nodes from the list.
 * It attempts to ping each node and returns the list of nodes that respond.
 * 
 * @returns {Promise<string[]>} - A promise that resolves to an array of available Elasticsearch node URLs.
 * @throws {Error} - Throws an error if no nodes are available.
 */
async function getAllAvailableNodes(): Promise<string[]> {
  const availableNodes: string[] = [];

  for (const node of ELASTICSEARCH_HOST) {
    try {
      console.log("The node is ", node);
      console.log("The user is ", ELASTIC_USER);
      console.log("The password is ", ELASTIC_PASSWORD);
      // Create a temporary client to ping the node
      const tempClient = new Client({ 
        nodes: [node],         
        auth: {
          username: ELASTIC_USER,
          password: ELASTIC_PASSWORD
        } 
      });
      
      // Ping the node
      await tempClient.ping();

      // If the node responds, add it to the availableNodes array
      console.log(`Elasticsearch node is available: ${node}`);
      availableNodes.push(node);
    } catch (error) {
      console.log(`Elasticsearch node is unavailable: ${node}`);
    }
  }

  // If no nodes are available, throw an error
  if (availableNodes.length === 0) {
    throw new Error("No Elasticsearch nodes are available");
  }

  return availableNodes;
}

/**
 * Method to create an Elasticsearch client using all available nodes.
 * It attempts to get the list of available nodes and creates the client with those nodes.
 * 
 * @returns {Promise<Client>} - A promise that resolves to the Elasticsearch client instance.
 */
async function createESClient(): Promise<Client> {
  // Get the list of available nodes
  const availableNodes = await getAllAvailableNodes();

  // Define client options using all available nodes
  const clientOptions: ClientOptions = {
    nodes: availableNodes,  // Use all available nodes
    compression: "gzip",
    resurrectStrategy: "ping",
    requestTimeout: requestTimeoutInMS, // Timeout for requests (e.g., 10 minutes)
    maxCompressedResponseSize: maxCompressedResponseSize,
    auth: {
      username: ELASTIC_USER,
      password: ELASTIC_PASSWORD,
    },
  };

  // Create and return the Elasticsearch client with the available nodes
  return new Client(clientOptions);
}

export const esBaseClient = await createESClient();


/**
 * Method to get the first available Elasticsearch node from the list of nodes.
 * It attempts to ping each node and returns the first node that responds.
 * 
 * @returns {Promise<string>} - A promise that resolves to the available Elasticsearch node URL.
 * @throws {Error} - Throws an error if no nodes are available.
 */
async function getFastestRespondingESNode(): Promise<string> {
  for (const node of ELASTICSEARCH_HOST) {
    try {
      // Create a temporary client to ping the node
      const tempClient = new Client({ nodes: [node] });
      
      // Ping the current node to check if it is available
      await tempClient.ping();

      // If ping is successful, return the node
      console.log(`Elasticsearch node is available: ${node}`);
      return node;
    } catch (error) {
      // If ping fails, log the error and move to the next node
      console.log(`Elasticsearch node is unavailable: ${node}`);
    }
  }

  // If no nodes are available, throw an error
  throw new Error("No Elasticsearch nodes are available");
}

/**
 * Method to generate the Elasticsearch Auth Header dynamically based on an available node.
 * It attempts to dynamically select an available node rather than always using the first node in the list.
 * 
 * @param {string} esEndpoint - The Elasticsearch endpoint for which the auth header is generated.
 * @returns {Promise<{esUrl: string, authHeader: string}>} - A promise that resolves to an object containing the Elasticsearch URL and the basic authorization header.
 */
export const getESAuthHeader = async (esEndpoint: string): Promise<{ esUrl: string; authHeader: string }> => {
  // Dynamically get the first available node
  const availableNode = await getFastestRespondingESNode();

  // Return the Elasticsearch URL and base64 encoded authorization header
  return {
    esUrl: `${availableNode}/${esEndpoint}`,
    authHeader: 'Basic ' + Buffer.from(ELASTIC_USER + ':' + ELASTIC_PASSWORD).toString('base64')
  };
  
};

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
  const esAuthOptions: ESRequestOptions = await getESAuthHeader(indexName);
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
    const indexExists = await esBaseClient.indices.exists({ index: indexName });
    if (indexExists.body) {
      console.log(`Index ${indexName} exists.`);
      return Promise.resolve({ exists: true });
    } else {
      console.log(`Index ${indexName} does not exist.`);
      return Promise.resolve({ exists: false });
    }
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
  const esAuthOptions: ESRequestOptions = await getESAuthHeader(indexName);

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
export async function deleteESIndex(indexName: string, ignore_unavailable = true) {
  try {
    const indexExists = await esBaseClient.indices.exists({ index: indexName });
    if (!indexExists.body && ignore_unavailable) {
      console.log("Index does not exist, skipping delete");
      return Promise.resolve(true);
    }

    const response = await esBaseClient.indices.delete({ index: indexName });
    if (response.body.acknowledged) {
      console.log(`Index ${indexName} deleted successfully.`);
      console.log("Index deleted successfully");
      console.log("Status:", response.statusCode);
      console.log("Headers:", response.headers);
      console.log("Body:", response.body);
      return Promise.resolve(true);
    } else {
      throw new Error(`Failed to delete index ${indexName}.`);
    }
  } catch (error) {
    console.error("Error deleting index:", error);
    throw new Error(`Index ${indexName} could not be deleted: ${(error as any).message || error}`);
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
  const esAuthOptions: ESRequestOptions = await getESAuthHeader(esIndexName);
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