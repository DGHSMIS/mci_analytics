import { formatDateTime } from "@library/utils";
import { ncdIndexName } from "@providers/elasticsearch/constants";
import { dropAndGenerateIndex } from "@providers/elasticsearch/ESBase";
import { indexAllPediatricNCDDataInESData } from "@providers/elasticsearch/ncdIndex/ESPediatricNCDIndex";
import { ESPediatricNCDIndexBody } from "@providers/elasticsearch/ncdIndex/ESPediatricNCDMapping";
import { checkIfAuthenticatedMCIUser } from "@utils/lib/auth";
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
  console.log(`Cleaning & reindexing ${ncdIndexName} index`);
    // Check Authorization & respond error if not verified
    const isValidUserRequest = await checkIfAuthenticatedMCIUser(req);

    if (isValidUserRequest !== null) {
        return isValidUserRequest;
    }

  try {
    const pediatricNCDIndexRegenerated = await dropAndGenerateIndex(ncdIndexName, ESPediatricNCDIndexBody);
    if (pediatricNCDIndexRegenerated) {
        const isIndexAllNCDDataRecords = await indexAllPediatricNCDDataInESData();
        if (isIndexAllNCDDataRecords) {
          return sendSuccess({ message: `${ncdIndexName} index has been reindexed successfully at ${formatDateTime(new Date().toISOString())}` }, 200);
        }
      return sendSuccess({ message: `${ncdIndexName} index has been index created successfull at ${formatDateTime(new Date().toISOString())}` }, 200);
    }
    return sendErrorMsg(`Reindexing of ${ncdIndexName} index failed at ${formatDateTime(new Date().toISOString())}`);
  } catch (error) {
    console.log(error);
    return sendErrorMsg(`Reindexing of ${ncdIndexName} index failed at ${formatDateTime(new Date().toISOString())}, ${(error as any).message}`);
  }
}


