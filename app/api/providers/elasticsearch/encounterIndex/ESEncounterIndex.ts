import { cassandraClient } from "@api/providers/cassandra/cassandra";
import { CASSANDRA_DEFAULT_KEYSPACE, CASSANDRA_PAGE_SIZE, CASSANDRA_SHR_KEYSPACE } from "@api/providers/cassandra/constants";
import { DebugElasticProvider, ELASTIC_BATCH_SIZE, encounterIndexName } from "@providers/elasticsearch/constants";
import { esBaseClient } from '@providers/elasticsearch/ESBase';
import { CDEncounterInterface } from "@utils/interfaces/Cassandra/CDEncounterInterface";
import fetchAndCacheFacilityInfo from "@utils/providers/fetchAndCacheFacilityInfo";
import { blankCreatedAndUpdatedByEncounterESObject, timeUUIDToDate } from "@utils/utilityFunctions";
import { stringify } from "uuid";
import { ESEncounterIndexBody } from "./ESEncounterMapping";
import { ESEncounterInterface } from "./interfaces/ESEncounterInterface";
let indexCount = 0;
const batchSize = ELASTIC_BATCH_SIZE;


let listOfErrorEncounters: string[] = [];
let errorCount = 0;

/**
 * Function to create the encounterLogIndex if it doesn't exist
 */
export async function creatEncounterIndex() {
  try {
    const indexExists = await esBaseClient.indices.exists({ index: encounterIndexName });
    if (!indexExists.body) {
      await esBaseClient.indices.create({
        index: encounterIndexName,
        body: ESEncounterIndexBody,
      });
      if (DebugElasticProvider) console.log(`Index "${encounterIndexName}" created successfully.`);
    } else {
      if (DebugElasticProvider) console.log(`Index "${encounterIndexName}" already exists.`);
    }
  } catch (error) {
    console.error("Error creating mciServiceLogIndex:", error);
  }
}

/**
 * Maps Cassandra Encounter data to Elasticsearch Encounter index
 * @param doc 
 * @returns 
 */
async function convertDataToEncounterESFormat(doc: CDEncounterInterface, indexedTime: Date): Promise<any[]> {
  if (!doc.encounter_id) {
    if (DebugElasticProvider) {
      console.log("ERROR Encounter ID NOT FOUND");
      errorCount++;
    }
    return await Promise.resolve([]);
  }
  if (!doc.health_id) {
    if (DebugElasticProvider) {
      console.log("ERROR Health ID NOT FOUND");
      errorCount++;
    }
    return await Promise.resolve([]);
  }
  try {
    const esDoc: ESEncounterInterface = convertCassandraEncounterToESEncounterIndexObject(doc, indexedTime);
    if (!doc.created_by) {
      if (DebugElasticProvider) {
        console.log("FACILITY NOT FOUND!");
        console.log(doc.created_by);
        errorCount++;
      }
      return await Promise.resolve([]);
    }
    if (DebugElasticProvider) {
      console.log("Before Created By Parse");
      console.log(doc.health_id);
      console.log(doc.created_by);
    }

    esDoc.created_by = JSON.parse(doc.created_by ?? {});
    const created_facility_id = esDoc.created_by.facilityId ? Number(esDoc.created_by.facilityId) : null;


    if (DebugElasticProvider) {
      console.log("created_facility_id is");
      console.log(created_facility_id);
      console.log(typeof created_facility_id);
    }

    if (!created_facility_id) {
      errorCount++;
      return await Promise.resolve([]);
    }

    esDoc.updated_by = JSON.parse(doc.updated_by ?? {});
    const updated_facility_id = esDoc.updated_by.facilityId ? Number(esDoc.updated_by.facilityId) : null;

    if (!updated_facility_id) {
      errorCount++;
      return await Promise.resolve([]);
    }
    // Fetch created and updated facility info concurrently
    const [createdFacilityInfo, updatedFacilityInfo] = await Promise.all([
      created_facility_id ? await fetchAndCacheFacilityInfo(created_facility_id) : null,
      updated_facility_id ? await fetchAndCacheFacilityInfo(updated_facility_id) : null,
    ])
    esDoc.created_facility_id = created_facility_id;
    esDoc.updated_facility_id = updated_facility_id;
    if (createdFacilityInfo) {
      esDoc.created_by.provider = null;
    }

    //Map the facility info to the document
    if (updatedFacilityInfo) {
      esDoc.updated_by.provider = null;
    }

    if (DebugElasticProvider) {
      console.log("ES Document Generated - ");
      console.log(esDoc);
    }
    return Promise.resolve([{ index: { _index: encounterIndexName, _id: esDoc.encounter_id } }, esDoc]);

  } catch (error) {
    if (DebugElasticProvider) {
      console.log('Error Found');
      console.log(error);
      // console.log(esDoc.created_by);
      // console.log(esDoc.updated_by);
      // console.log(doc);
      errorCount++;
    }
    return Promise.reject([]);
  }
}

/**
 * This function takes in one patient data and
 * indexes it to a new patient in Elasticsearch
 * Indexing Single Encounter Item to the Index
 * @param patient
 */
export async function insertOrUpdateSingleEncounterToESIndex(encounterId: String) {
  try {
    const results: CDEncounterInterface[] = [];
    cassandraClient.keyspace = CASSANDRA_SHR_KEYSPACE;
    const queryString = `SELECT * from freeshr.encounter WHERE encounter_id='${encounterId}' LIMIT 1;`;
    if (DebugElasticProvider) {
      console.log("Query String");
      console.log(queryString);
    }
    const encounterSearch: any = await cassandraClient.execute(queryString);
    const rows: CDEncounterInterface[] = encounterSearch.rows;
    if (DebugElasticProvider) {
      console.log("Rows");
      console.log(rows);
    }
    if (rows.length == 0) {
      console.log("No data found for the encounterId " + encounterId);
      return Promise.resolve(false);
    }

    results.push(...rows);
    if (DebugElasticProvider) {
      console.log("Results");
      console.log(results);
    }

    // Find the document from ElasticSearch to get indexed_time and then update the document
    const getRecordFromES = await esBaseClient.search({
      index: encounterIndexName,
      body: {
        query: {
          match: {
            encounter_id: encounterId,
          },
        },
      },
    });

    const batch = results.slice(0, 1);

    const formattedDocsPromises = await batch.map(async (encounter) => {
      console.log("Get Record from ES, how many exists?");
      console.log(getRecordFromES.body.hits.hits.length);
      let indexedTime = new Date();
      if (getRecordFromES.body.hits.hits.length) {
        console.log("<<<< Indexed Item >>>>");
        console.log(getRecordFromES.body.hits.hits[0]._source);
        console.log(getRecordFromES.body.hits.hits[0]._source['index_time']);
        if (getRecordFromES.body.hits.hits[0]._source.index_time) {
          console.log("<<<< index_time exists>>>>");
          indexedTime = getRecordFromES.body.hits.hits[0]._source.index_time ?? new Date();
        } else {
          console.log("<<<< index_time not in index >>>>");
        }
        console.log("<<<< index_time set >>>>");
        console.log(indexedTime);
      }
      return await convertDataToEncounterESFormat(encounter, indexedTime);
    });

    let formattedDocs = await Promise.all(formattedDocsPromises);
    // Filter out empty array responses from formattedDocs
    formattedDocs = formattedDocs.filter(doc => doc.length > 0);
    // Step 2: Flatten the array
    const flattenedDocs = formattedDocs.reduce((acc, val) => acc.concat(val), []);
    if (DebugElasticProvider) {
      console.log("Flattened Docs");
      console.log(flattenedDocs);
    }
    //Add Single Row to the existing Index
    if (flattenedDocs.length > 0) {
      await esBaseClient.bulk({ index: encounterIndexName, body: flattenedDocs });
      if (DebugElasticProvider) console.log(`Indexed ${flattenedDocs.length} documents in current batch`);
    } else {
      if (DebugElasticProvider) {
        console.log("No data to index");
      }
    }

    if (DebugElasticProvider) {
      console.log("New Item added to the Index");
    }
    cassandraClient.keyspace = CASSANDRA_DEFAULT_KEYSPACE;
    cassandraClient.shutdown();
    // await esBaseClient.close();
    return Promise.resolve(true);
  } catch (error) {
    console.error("Error in add encounter data to the index", error);
    cassandraClient.keyspace = CASSANDRA_DEFAULT_KEYSPACE;
    cassandraClient.shutdown();
    // await esBaseClient.close();
    return Promise.resolve(false);
  }
}

/**
 * Fetch ALL data from Cassandra database and Index it in Elasticsearch
 */
export async function indexAllEncountersInESData() {
  try {
    indexCount = 0;
    const results: CDEncounterInterface[] = [];
    cassandraClient.keyspace = CASSANDRA_SHR_KEYSPACE;
    let i: number = 0;
    // Define a function to process each page of results
    const getAllEncounterData = async (pageState: any, query: string = "SELECT * FROM encounter") => {
      if (DebugElasticProvider) console.log("Retrieving page with pageIndex", i);
      const queryOptions = { prepare: true, fetchSize: CASSANDRA_PAGE_SIZE, pageState };
      const result: any = await cassandraClient.execute(
        `${query}`,
        [],
        queryOptions,
      );

      const rows: CDEncounterInterface[] = result.rows;
      // Process each row here...
      if (DebugElasticProvider) console.log("Pushing page to allRows");
      console.log("row of Encounter data");
      console.log(rows);
      results.push(...rows);
      i++;

      // Check if there are more pages
      if (result.pageState) {
        if (DebugElasticProvider) console.log("More pages to come" + result.pageState);
        await getAllEncounterData(result.pageState);
      }
    };

    // Call the getAllPaginatedData function to start retrieving pages
    await getAllEncounterData(null);

    // Index the data in batches
    for (let i = 0; i < results.length; i += batchSize) {
      const batch = results.slice(i, i + batchSize);
      // Step 1: Format the data
      const formattedDocsPromises = batch.map(encounter => convertDataToEncounterESFormat(encounter, new Date()));
      let formattedDocs = await Promise.all(formattedDocsPromises);
      // Filter out empty array responses from formattedDocs
      formattedDocs = formattedDocs.filter(doc => doc.length > 0);

      // Step 2: Flatten the array
      const flattenedDocs = formattedDocs.reduce((acc, val) => acc.concat(val), []);

      // Step 3: Send the data to ES Index, ensuring there's something to index
      if (flattenedDocs.length > 0) {
        if (DebugElasticProvider) { indexCount += flattenedDocs.length; }
        await esBaseClient.bulk({ index: encounterIndexName, body: flattenedDocs });
        if (DebugElasticProvider) console.log(`Indexed ${flattenedDocs.length} documents in current batch`);
      }
    }

    if (DebugElasticProvider) {
      console.log("List of Encounter with Invalid JSON Object");
      console.log(JSON.stringify(listOfErrorEncounters));
      console.log("Count of Invalid JSON Object");
      console.log(listOfErrorEncounters.length);
      console.log("Error Count during indexing");
      console.log(errorCount);
      console.log("Total Indexed Documents");
      console.log(indexCount);
    }
    // await esBaseClient.close();
    cassandraClient.keyspace = CASSANDRA_DEFAULT_KEYSPACE;
    cassandraClient.shutdown();
    // await esBaseClient.close();
    return true;
  } catch (error) {
    console.error("Error in indexing all encounter data", error);
    cassandraClient.keyspace = CASSANDRA_DEFAULT_KEYSPACE;
    cassandraClient.shutdown();
    // await esBaseClient.close();
    return false;
  }
}

/**
 * Convert Cassandra Encounter data to ES Encounter Index Object
 * @param doc 
 * @param indexed_time 
 * @returns 
 */
export const convertCassandraEncounterToESEncounterIndexObject = (doc: CDEncounterInterface, indexed_time: Date): ESEncounterInterface => {
  return {
    encounter_id: doc.encounter_id,
    received_at: Object.keys(doc.received_at.buffer).length > 0
      ? timeUUIDToDate(stringify(doc.received_at.buffer)).toISOString()
      : null,
    content_v1: null,
    content_v2: null,
    content_v3: null,
    content_version: doc.content_version ?? null,
    content_version_v1: doc.content_version ?? null,
    content_version_v2: doc.content_version ?? null,
    content_version_v3: doc.content_version ?? null,
    created_by: blankCreatedAndUpdatedByEncounterESObject,
    created_facility_id: null,
    health_id: doc.health_id,
    encounter_confidentiality: doc.encounter_confidentiality ?? "N",
    patient_confidentiality: doc.patient_confidentiality ?? "N",
    updated_at: Object.keys(doc.updated_at.buffer).length > 0
      ? timeUUIDToDate(stringify(doc.updated_at.buffer)).toISOString()
      : null,
    updated_by: blankCreatedAndUpdatedByEncounterESObject,
    updated_facility_id: null,
    indexed_time: indexed_time
  }
}