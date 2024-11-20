import { formatDateTime } from "@library/utils";
import { healthRecordESIndexName } from "@providers/elasticsearch/constants";
import { indexAllHealthRecordsESData } from "@providers/elasticsearch/healthRecordSummaryIndex/ESHealthRecordSummaryIndex";
import { sendErrorMsg, sendSuccess } from "@utils/responseHandlers/responseHandler";
import { NextRequest } from "next/server";
import "server-only";
import { dropAndGenerateIndex } from "@providers/elasticsearch/ESBase";
import { ESHealthRecordSummaryIndexBody } from "@providers/elasticsearch/healthRecordSummaryIndex/ESHealthRecordSummaryMapping";

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
  console.log(`Cleaning & reindexing ${healthRecordESIndexName} index`);
    //This route is only accessible from the known hosts
  // if (!validateKnowHostToAccessRoute(req)) {
  //   return sendErrorMsg('Forbidden: Request is not from the host serve', 403);
  // }

  const params: any = req.nextUrl.searchParams;
  let clearIndex:boolean = false;
  console.log("params");
  console.log(params);
  params.forEach((key: any, value: any) => {
    console.log(value);
    if (key=="clearIndex") {
      if (typeof value==="boolean") {
        clearIndex = value;
      }
    }
  });
  try {
    let healthRecordIndexRegenerated = false;
    if(clearIndex){
      console.log("Dropping & Regenerating Index");
      healthRecordIndexRegenerated = await dropAndGenerateIndex(healthRecordESIndexName, ESHealthRecordSummaryIndexBody);
    } else {
      console.log("Regenerating Index without DROP");
      healthRecordIndexRegenerated =  true;
    }

    if (healthRecordIndexRegenerated) {
      const isIndexAllHealthRecord = await indexAllHealthRecordsESData();
      if (isIndexAllHealthRecord) {
        return sendSuccess({ message: `${healthRecordESIndexName} index has been reindexed successfully at ${formatDateTime(new Date().toISOString())}` }, 200);
      }
    }
    return sendErrorMsg(`Reindexing of ${healthRecordESIndexName} index failed at ${formatDateTime(new Date().toISOString())}`);
  } catch (error) {
    console.log(error);
    return sendErrorMsg(`Reindexing of ${healthRecordESIndexName} index failed at ${formatDateTime(new Date().toISOString())}, ${(error as any).message}`);
  }
}


