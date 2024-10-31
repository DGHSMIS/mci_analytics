import { PGPatientVisitInterface } from "@api/providers/prisma/ncd_data_models/PGPatientVisitInterface";
import { PatientVisit } from "@prisma/client";
import { DebugElasticProvider, ELASTIC_BATCH_SIZE, ncdIndexName } from "@providers/elasticsearch/constants";
import { esBaseClient } from '@providers/elasticsearch/ESBase';
import prisma from '@providers/prisma/prismaClient';
import { ESPediatricNCDIndexBody } from "./ESPediatricNCDMapping";

let indexCount = 0;
const batchSize = ELASTIC_BATCH_SIZE;
const totalDataToFetchPostGreSQL = 30;


let listOfErrorEncounters: string[] = [];
let errorCount = 0;

/**
 * Function to create the encounterLogIndex if it doesn't exist
 */
export async function creatPediatricNCDIndex() {
  try {
    const indexExists = await esBaseClient.indices.exists({ index: ncdIndexName });
    if (!indexExists.body) {
      await esBaseClient.indices.create({
        index: ncdIndexName,
        body: ESPediatricNCDIndexBody,
      });
      if (DebugElasticProvider) console.log(`Index "${ncdIndexName}" created successfully.`);
      return true;
    } else {
      if (DebugElasticProvider) console.log(`Index "${ncdIndexName}" already exists.`);
      return true;
    }
  } catch (error) {
    console.error("Error creating mciServiceLogIndex:", error);
    return false;
  }
}

// /**
//  * Maps Cassandra Encounter data to Elasticsearch Encounter index
//  * @param doc 
//  * @returns 
//  */
async function convertDataToPediatricNCDDataESFormat(doc: PGPatientVisitInterface): Promise<any[]> {
  if (!doc.id) {
    if (DebugElasticProvider) {
      console.log("ERROR Encounter ID NOT FOUND");
      errorCount++;
    }
    return await Promise.resolve([]);
  }
  if (!doc.patientId) {
    if (DebugElasticProvider) {
      console.log("ERROR Health ID NOT FOUND");
      errorCount++;
    }
    return await Promise.resolve([]);
  }
  try {
    const esDoc: PGPatientVisitInterface = {
      id: doc.id,
      patientId: doc.patientId,
      patientName: doc.patientName,
      dateOfVisit: doc.dateOfVisit,
      dob: doc.dob,
      gender: doc.gender,
      facilityId: doc.facilityId,
      facilityName: doc.facilityName,
      serviceLocation: doc.serviceLocation,
      diseaseId: doc.diseaseId,
      isReferredToHigherFacility: doc.isReferredToHigherFacility,
      isFollowUp: doc.isFollowUp,
      createdAt: doc.createdAt,
    }

    return Promise.resolve([{ index: { _index: ncdIndexName, _id: esDoc.id } }, esDoc]);

  } catch (error) {
    if (DebugElasticProvider) {
      console.log('Error Found');
      console.log(error);
      errorCount++;
    }
    return Promise.reject([]);
  }
}


// /**
//  * Fetch ALL data from POSTGRESQL database and Index it in Elasticsearch
//  */
export async function indexAllPediatricNCDDataInESData() {
  try {
    indexCount = 0;
    const results: PatientVisit[] = [];

    let i: number = 0;
    console.log("Fetching all data from the database");
    // Define a function to process each page of results
    const getAllNCDData = async () => {
      if (DebugElasticProvider) console.log("Retrieving page with pageIndex", i);
      const rows: PatientVisit[] = await prisma.patientVisit.findMany({
        take: totalDataToFetchPostGreSQL,
        skip: i * totalDataToFetchPostGreSQL,
        where: {
          id: {
            gt: 0
          },
        }
      });
      // Process each row here...
      if (DebugElasticProvider) console.log("Pushing page to allRows");
      console.log("row of Encounter data");
      console.log(rows);
      results.push(...rows);
      i++;

      // Check if there are more pages
      if (rows.length == totalDataToFetchPostGreSQL) {
        if (DebugElasticProvider) console.log("More pages to come" + i);
        await getAllNCDData();
      }
    };

    // Call the getAllPaginatedData function to start retrieving pages
    await getAllNCDData();

    //   // Index the data in batches
    for (let i = 0; i < results.length; i += batchSize) {
      const batch = results.slice(i, i + batchSize);
      // Step 1: Format the data
      const formattedDocsPromises = batch.map(ncdData => convertDataToPediatricNCDDataESFormat(ncdData));
      let formattedDocs = await Promise.all(formattedDocsPromises);
      // Filter out empty array responses from formattedDocs
      formattedDocs = formattedDocs.filter(doc => doc.length > 0);

      // Step 2: Flatten the array
      const flattenedDocs = formattedDocs.reduce((acc, val) => acc.concat(val), []);

      // Step 3: Send the data to ES Index, ensuring there's something to index
      if (flattenedDocs.length > 0) {
        if (DebugElasticProvider) { indexCount += flattenedDocs.length; }
        await esBaseClient.bulk({ index: ncdIndexName, body: flattenedDocs });
        if (DebugElasticProvider) console.log(`Indexed ${flattenedDocs.length} documents in current batch`);
      }
    }

    if (DebugElasticProvider) {
      console.log("List of NCD DATA with Invalid JSON Object");
      console.log(JSON.stringify(listOfErrorEncounters));
      console.log("Count of Invalid JSON Object");
      console.log(listOfErrorEncounters.length);
      console.log("Error Count during indexing");
      console.log(errorCount);
      console.log("Total Indexed Documents");
      console.log(indexCount);
    }
    return true;
  } catch (error) {
    console.error("Error in indexing all ncd patient data", error);
    return false;
  }
}

/**
 * This function takes in one patient data and
 * indexes it to a new patient in Elasticsearch
 * Indexing Single Encounter Item to the Index
 * @param patient
 */
export async function insertOrUpdateNCDDataByCreatedTimeToESIndex(time: string) {
  try {
    indexCount = 0;
    const results: PatientVisit[] = [];

    let i: number = 0;
    console.log(`Fetching all data from the database for the given time ${time}`);
    // Define a function to process each page of results
    
    const getAllNCDData = async () => {
      if (DebugElasticProvider) console.log("Retrieving page with pageIndex", i);
      const rows: PatientVisit[] = await prisma.patientVisit.findMany({
        take: totalDataToFetchPostGreSQL,
        skip: i * totalDataToFetchPostGreSQL,
        where: {
          createdAt: {
            gte: time
          }
        }
      });
      // Process each row here...
      if (DebugElasticProvider) console.log("Pushing page to allRows");
      console.log("row of Encounter data");
      console.log(rows);
      console.log(rows.length);
      results.push(...rows);
      i++;

      // Check if there are more pages
      if (rows.length == totalDataToFetchPostGreSQL) {
        if (DebugElasticProvider) console.log("More pages to come" + i);
        await getAllNCDData();
      }
    };

    // Call the getAllPaginatedData function to start retrieving pages
    await getAllNCDData();

    //   // Index the data in batches
    for (let i = 0; i < results.length; i += batchSize) {
      const batch = results.slice(i, i + batchSize);
      // Step 1: Format the data
      const formattedDocsPromises = batch.map(ncdData => convertDataToPediatricNCDDataESFormat(ncdData));
      let formattedDocs = await Promise.all(formattedDocsPromises);
      // Filter out empty array responses from formattedDocs
      formattedDocs = formattedDocs.filter(doc => doc.length > 0);

      // Step 2: Flatten the array
      const flattenedDocs = formattedDocs.reduce((acc, val) => acc.concat(val), []);

      // Step 3: Send the data to ES Index, ensuring there's something to index
      if (flattenedDocs.length > 0) {
        if (DebugElasticProvider) { indexCount += flattenedDocs.length; }
        await esBaseClient.bulk({ index: ncdIndexName, body: flattenedDocs });
        if (DebugElasticProvider) console.log(`Indexed ${flattenedDocs.length} documents in current batch`);
      }
    }

    if (DebugElasticProvider) {
      console.log("List of NCD DATA with Invalid JSON Object");
      console.log(JSON.stringify(listOfErrorEncounters));
      console.log("Count of Invalid JSON Object");
      console.log(listOfErrorEncounters.length);
      console.log("Error Count during indexing");
      console.log(errorCount);
      console.log("Total Indexed Documents");
      console.log(indexCount);
    }
    return true;
  } catch (error) {
    console.error("Error in indexing all ncd patient data", error);
    return false;
  }
}