import { PGDiseasesOnVisit } from "@api/providers/prisma/models/PGDiseasesOnVisit";
import { PGPatientVisitInterface } from "@api/providers/prisma/models/PGPatientVisitInterface";
import { DebugElasticProvider, ELASTIC_BATCH_SIZE, ncdIndexName } from "@providers/elasticsearch/constants";
import { findOrCreateFacility } from "@utils/providers/fetchAndCacheFacilityInfo";
import { selectDistrictFromCode, selectDivisionFromCode } from "@utils/utilityFunctions";
import { esBaseClient } from 'app/api/providers/elasticsearch/ESBase';
import prisma from 'app/api/providers/prisma/prismaClient';
import { ESPediatricNCDIndexBody } from "./ESPediatricNCDMapping";
import { ESPediatricNCDInterface } from "./interfaces/ESPediatricNCDInterface";


export const ncdESIndex = ncdIndexName;
let indexCount = 0;
const batchSize = ELASTIC_BATCH_SIZE;
const totalDataToFetchPostGreSQL = 30;


let errorCount = 0;
/*
  * Creates the Pediatric NCD Index in Elasticsearch
*/
export async function creatPediatricNCDIndex() {
  try {
    const indexExists = await esBaseClient.indices.exists({ index: ncdESIndex });
    if (!indexExists.body) {
      await esBaseClient.indices.create({
        index: ncdESIndex,
        body: ESPediatricNCDIndexBody,
      });
      if (DebugElasticProvider) console.log(`Index "${ncdESIndex}" created successfully.`);
      return true;
    } else {
      if (DebugElasticProvider) console.log(`Index "${ncdESIndex}" already exists.`);
      return true;
    }
  } catch (error) {
    console.error("Error creating mciServiceLogIndex:", error);
    return false;
  }
}

// /**
//  * Maps PostGres NCD Patient Visit data to Elasticsearch NCDIndex index
//  * @param doc 
//  * @returns 
//  */
async function convertDataToPediatricNCDDataESFormat(doc: PGPatientVisitInterface): Promise<any[]> {
  if (!doc.id) {
    if (DebugElasticProvider) {
      console.log("ERROR Patient Visit ID NOT FOUND");
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
    let diseaseArray: string[] = [];
    if (doc.diseaseRef) {
      doc.diseaseRef.map(diseaseOnVisitItem => {
        console.log("Disease Concept UUID");
        console.log(diseaseOnVisitItem.disease?.conceptName);
        if(diseaseOnVisitItem.disease?.conceptName){
          diseaseArray.push(diseaseOnVisitItem.disease?.conceptName);
        }
      });
    }
    console.log("Disease Array");
    console.log(doc.diseaseRef);
    console.log(diseaseArray);
    const facilityData = await findOrCreateFacility(doc.facilityCode);
    const esDoc: ESPediatricNCDInterface = {
      id: String(doc.id),
      patient_id: String(doc.patientId),
      visit_id: String(doc.visitId),
      health_id: doc.healthId ?? "",
      patient_name: doc.patientName,
      date_of_visit: doc.dateOfVisit,
      dob: doc.dob,
      gender: doc.gender,
      facility_code: doc.facilityCode,
      facility_name: facilityData.name ?? "",
      division_name: facilityData.divisionCode ? selectDivisionFromCode(facilityData.divisionCode) : "",
      district_name: facilityData.divisionCode && facilityData.districtCode  ? selectDistrictFromCode(facilityData.divisionCode + facilityData.districtCode) : "",
      service_location: doc.serviceLocation,
      diseases_on_visit: diseaseArray,
      is_referred_to_higher_facility: doc.isReferredToHigherFacility,
      is_follow_up: doc.isFollowUp,
      created_at: doc.createdAt,
    }
    
    // console.log("Doc to be indexed");
    // console.log(esDoc)
    return Promise.resolve([{ index: { _index: ncdESIndex, _id: esDoc.id } }, esDoc]);

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
    const results: PGPatientVisitInterface[] = [];

    let i: number = 0;
    console.log("Fetching all data from the database");
    // Define a function to process each page of results
    const getAllNCDData = async () => {
      if (DebugElasticProvider) console.log("Retrieving page with pageIndex", i);
      const rows: any[] = await prisma.patientVisit.findMany({
        include: {
          dieasesOnVisit: {
            include:{
              disease: true
            }
            
          }
        },
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
      // console.log("row of NCD data TO be indexed");
      // console.log(rows);

      const rowFinal: PGPatientVisitInterface[] = rows.map(row => {
        const diseaseRef:PGDiseasesOnVisit[] = row.dieasesOnVisit;
        //unset the diseaseRef from the row
        delete row.dieasesOnVisit;
        return {
          ...row,
          diseaseRef: diseaseRef
        }
      });

      // console.log("row of NCD Index data");
      // console.log(rowFinal);
      results.push(...rowFinal);
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
        await esBaseClient.bulk({ index: ncdESIndex, body: flattenedDocs });
        if (DebugElasticProvider) console.log(`Indexed ${flattenedDocs.length} documents in current batch`);
      }
    }

    if (DebugElasticProvider) {
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
 * Indexing Single Patient Visit Item to the Index
 * @param patient
 */
export async function insertOrUpdateNCDDataByCreatedTimeToESIndex(time: string) {
  try {
    indexCount = 0;
    const results: PGPatientVisitInterface[] = [];

    let i: number = 0;
    console.log(`Fetching all data from the database for the given time ${time}`);
    // Define a function to process each page of results
    
    const getAllNCDData = async () => {
      if (DebugElasticProvider) console.log("Retrieving page with pageIndex", i);
      const rows: any[] = await prisma.patientVisit.findMany({
        include: {
          dieasesOnVisit: {
            include:{
              disease: true
            }
          }
        },
        take: totalDataToFetchPostGreSQL,
        skip: i * totalDataToFetchPostGreSQL,
        where: {
          createdAt: {
            gte: time
          },
        },
      });
      // Process each row here...
      if (DebugElasticProvider) console.log("Pushing page to allRows");
      console.log("row of NCD data to be indexed");
      console.log(rows);
      console.log(rows.length);
      const rowFinal: PGPatientVisitInterface[] = rows.map(row => {
        const diseaseRef:PGDiseasesOnVisit[] = row.dieasesOnVisit;
        //unset the diseaseRef from the row
        delete row.dieasesOnVisit;
        return {
          ...row,
          diseaseRef: diseaseRef
        }
      });

      console.log("row of NCD Index data");
      console.log(rowFinal);
      results.push(...rowFinal);
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
        console.log("Flattened Docs are  ", flattenedDocs);
        console.log("Formatted Docs are  ", formattedDocs);
        if (DebugElasticProvider) { indexCount += formattedDocs.length; }
        await esBaseClient.bulk({ index: ncdESIndex, body: flattenedDocs });
        if (DebugElasticProvider) console.log(`Indexed ${formattedDocs.length} documents in current batch`);
      }
    }

    if (DebugElasticProvider) {
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