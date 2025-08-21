import { formatDateTime } from "@library/utils";
import { encounterIndexName } from "@providers/elasticsearch/constants";
import { indexEncountersInESData } from "@providers/elasticsearch/encounterIndex/ESEncounterIndex";
import { ESEncounterIndexBody } from "@providers/elasticsearch/encounterIndex/ESEncounterMapping";
import { dropAndGenerateIndex } from "@providers/elasticsearch/ESBase";
import { sendErrorMsg, sendSuccess } from "@utils/responseHandlers/responseHandler";
import { NextRequest } from "next/server";
import "server-only";

export const dynamic = "force-dynamic";
export const revalidate = true;
export const fetchCache = "force-no-store";
export const dynamicParams = true;

const knownHostIPs = ['127.0.0.1', '::1'];
/**
 * Add Three APIs to fetch data from RabbitMQ
 * 1. New Patients from patient.new queue
 * 2. Updated Patients from patient.updated queue
 * 3. Patient Encounters from patient.encounter queue
 */

/**
 * Reindex All Data from Cassandra to Elasticsearch
 * @param req
 * @param res
 * @returns
 */
export async function POST(req: NextRequest) {
  console.log(`Cleaning & reindexing ${encounterIndexName} index`);
  //This route is only accessible from the known hosts
  // if (!validateKnowHostToAccessRoute(req)) {
  //   return sendErrorMsg('Forbidden: Request is not from the host serve', 403);
  // }
  // console.log('Request is from the known host');
  const params: any = req.nextUrl.searchParams;
  let clearIndex: boolean = false;
  console.log("params");
  console.log(params);
  params.forEach((key: any, value: any) => {
    console.log(value);
    if (key == "clearIndex") {
      if (typeof value === "boolean") {
        clearIndex = value;
      }
    }
  });
  //This route is only accessible from the known hosts
  // if(!validateKnowHostToAccessRoute(req)){
  //   return sendErrorMsg('Forbidden: Request is not from the host serve', 403);
  // }
  console.log("Request is from the known host");

  try {

    let startEncounterIndexGeneration = false;
    //Reindexing the encounter index
    if (clearIndex) {
      console.log(`Cleaning & reindexing ${encounterIndexName} index`);
      startEncounterIndexGeneration = await dropAndGenerateIndex(encounterIndexName, ESEncounterIndexBody);
      if (startEncounterIndexGeneration) {
        const isIndexAllEncounterRecords = await indexEncountersInESData();
        if (isIndexAllEncounterRecords) {
          return sendSuccess({ message: `${encounterIndexName} index has been reindexed successfully at ${formatDateTime(new Date().toISOString())}` }, 200);
        }
      }
    }
    //Indexing the encounter for last 24 hours
    else {
      console.log(`Reindexing ${encounterIndexName} index without a fresh clean`);
      const partialIndexEncounterRecords = await indexEncountersInESData(false);
      if (partialIndexEncounterRecords) {
        return sendSuccess({ message: `${encounterIndexName} index has been partially indexed successfully at ${formatDateTime(new Date().toISOString())}` }, 200);
      }
    }
    return sendErrorMsg(`Reindexing of ${encounterIndexName} index failed at ${formatDateTime(new Date().toISOString())}`);
  } catch (error) {
    console.log(error);
    return sendErrorMsg(`Reindexing of ${encounterIndexName} index failed at ${formatDateTime(new Date().toISOString())}, ${(error as any).message}`);
  }
}


