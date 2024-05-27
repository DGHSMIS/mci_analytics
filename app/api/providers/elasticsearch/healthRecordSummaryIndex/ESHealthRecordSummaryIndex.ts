import { cassandraClient } from "@api/providers/cassandra/cassandra";
import { CASSANDRA_PAGE_SIZE } from "@api/providers/cassandra/constants";
import { DebugElasticProvider, ELASTIC_BATCH_SIZE, healthRecordESIndexName } from "@providers/elasticsearch/constants";
import { esBaseClient } from '@providers/elasticsearch/ESBase';
import { CDPatientInterface } from "@utils/interfaces/CDPatientInterface";
import { timeUUIDToDate } from "@utils/utilityFunctions";
import { stringify } from "uuid";
import { temporarilyHotFixJSONObject } from "../patientIndex/ESPatientIndex";
import { ESHealthRecordSummaryInterface } from "./interfaces/ESHealthRecordSummaryInterface";


let indexCount = 0;
let errorCount = 0;
// Set the desired batch size for indexing
const batchSize = ELASTIC_BATCH_SIZE;


/**
 * Maps Cassandra Patient data to Elasticsearch Patient data index format
 * @param doc 
 * @returns 
 */
async function convertDataToHealthRecordSummaryESFormat(doc: CDPatientInterface) {

  if (!doc.health_id) {
    if (DebugElasticProvider) {
      console.log("ERROR HEALTH ID NOT FOUND");
      errorCount++;
    }
    return await Promise.resolve([]);
  }

  try {
    const esDoc: ESHealthRecordSummaryInterface = convertCassandraPatientToESHealthRecordSummaryIndexObject(doc);

    if (DebugElasticProvider) {
      console.log("Before Created By Parse");
      console.log(doc.health_id);
    }

    const created_byTemp = temporarilyHotFixJSONObject(doc.created_by, doc.health_id, "created_by");
    const created_by = JSON.parse(created_byTemp ?? {});
    let created_facility_id = created_by.facility ? Number(created_by.facility.id) : null;

    if (DebugElasticProvider) {
      console.log("created_facility_id is");
      console.log(created_facility_id);
      console.log(typeof created_facility_id);
    }

    if (!created_facility_id) {
      errorCount++;
      return await Promise.resolve([]);
    }

    const updated_byTemp = temporarilyHotFixJSONObject(doc.updated_by, doc.health_id, "updated_by");
    const updated_by = JSON.parse(updated_byTemp ?? {});
    const updated_facility_id = updated_by ? updated_by.facility ? updated_by.facility.id ? Number(updated_by.facility.id) : null : null : null;


    if (!updated_facility_id) {
      errorCount++;
      return await Promise.resolve([]);
    }

    esDoc.created_facility_id = created_facility_id;
    esDoc.updated_facility_id = updated_facility_id;

    return Promise.resolve([{ index: { _index: healthRecordESIndexName, _id: esDoc.health_id } }, esDoc]);
  }
  catch (error) {
    if (DebugElasticProvider) {
      console.log('Error Found');
      console.log(error);
      errorCount++;
    }
    return Promise.reject([]);
  }
}

/**
 * Fetch ALL data from Cassandra database and Index it in Elasticsearch
 */
export async function indexAllHealthRecordsESData() {
  try {
    indexCount = 0;
    const results: CDPatientInterface[] = [];
    let i: number = 0;
    // Define a function to process each page of results
    const getAllPatientData = async (pageState: any, query: string = "SELECT * FROM patient") => {
      if (DebugElasticProvider) console.log("Retrieving page with pageIndex", i);
      const queryOptions = { prepare: true, fetchSize: CASSANDRA_PAGE_SIZE, pageState };
      const result: any = await cassandraClient.execute(
        `${query}`,
        [],
        queryOptions,
      );

      const rows: CDPatientInterface[] = result.rows;
      // Process each row here...
      if (DebugElasticProvider) console.log("Pushing page to allRows");
      // console.log("rows");
      // console.log(rows);
      results.push(...rows);
      i++;

      // Check if there are more pages
      if (result.pageState) {
        if (DebugElasticProvider) console.log("More pages to come" + result.pageState);
        await getAllPatientData(result.pageState);
      }
    };

    // Call the getAllPaginatedData function to start retrieving pages
    await getAllPatientData(null);

    // Index the data in batches
    for (let i = 0; i < results.length; i += batchSize) {
      const batch = results.slice(i, i + batchSize);
      // Step 1: Format the data
      const formattedDocsPromises = batch.map(patient => convertDataToHealthRecordSummaryESFormat(patient));
      let formattedDocs = await Promise.all(formattedDocsPromises);
      // Filter out empty array responses from formattedDocs
      formattedDocs = formattedDocs.filter(doc => doc.length > 0);

      // Step 2: Flatten the array
      const flattenedDocs = formattedDocs.reduce((acc, val) => acc.concat(val), []);

      // Step 3: Send the data to ES Index, ensuring there's something to index
      if (flattenedDocs.length > 0) {
        if (DebugElasticProvider) { indexCount += flattenedDocs.length; }
        await esBaseClient.bulk({ index: healthRecordESIndexName, body: flattenedDocs });
        if (DebugElasticProvider) console.log(`Indexed ${flattenedDocs.length} documents in current batch`);
      }
    }

    if (DebugElasticProvider) {
      console.log("List of Health Records");
      console.log(indexCount);
    }
    return true;
  } catch (error) {
    console.error("Error in indexing all patient data", error);
    return false;
  }
}

export const convertCassandraPatientToESHealthRecordSummaryIndexObject = (doc: CDPatientInterface): ESHealthRecordSummaryInterface => {
  return {
    health_id: doc.health_id,
    active: doc.active,
    bin_brn: String(doc.bin_brn ?? ""),
    created_facility_id: null,
    created_client_id: null,
    created_at: Object.keys(doc.created_at.buffer).length > 0
      ? timeUUIDToDate(stringify(doc.created_at.buffer)).toISOString()
      : null,
    national_id: doc.national_id ? String(doc.national_id) : null,
    updated_facility_id: null,
    updated_at: Object.keys(doc.updated_at.buffer).length > 0
      ? timeUUIDToDate(stringify(doc.updated_at.buffer)).toISOString()
      : null,
  }
}