import { formatDateTime } from "@library/utils";
import { encounterIndexName } from "@providers/elasticsearch/constants";
import { indexAllEncountersInESData } from "@providers/elasticsearch/encounterIndex/ESEncounterIndex";
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

  try {
    const encounterIndexRegenerated = await dropAndGenerateIndex(encounterIndexName, ESEncounterIndexBody);

    if (encounterIndexRegenerated) {
      const isIndexAllEncounterRecords = await indexAllEncountersInESData();
      if (isIndexAllEncounterRecords) {
        return sendSuccess({ message: `${encounterIndexName} index has been reindexed successfully at ${formatDateTime(new Date().toISOString())}` }, 200);
      }
    }
    return sendErrorMsg(`Reindexing of ${encounterIndexName} index failed at ${formatDateTime(new Date().toISOString())}`);
  } catch (error) {
    console.log(error);
    return sendErrorMsg(`Reindexing of ${encounterIndexName} index failed at ${formatDateTime(new Date().toISOString())}, ${(error as any).message}`);
  }
}


