import { formatDateTime } from "@library/utils";
import { dropAndGenerateIndex } from "@providers/elasticsearch/ESBase";
import { indexAllPatientESData, patientESIndex } from "@providers/elasticsearch/patientIndex/ESPatientIndex";
import { ESPatientIndexBody } from "@providers/elasticsearch/patientIndex/ESPatientMapping";
import { sendErrorMsg, sendSuccess } from "@utils/responseHandlers/responseHandler";
import { NextRequest } from "next/server";
import "server-only";

export const dynamic = "force-dynamic";
export const revalidate = true;
export const fetchCache = "force-no-store";
export const dynamicParams = true;


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

  const params: any = req.nextUrl.searchParams;
  let clearIndex: boolean = false;
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
  //This route is only accessible from the known hosts
  // if(!validateKnowHostToAccessRoute(req)){
  //   return sendErrorMsg('Forbidden: Request is not from the host serve', 403);
  // }
  console.log("Request is from the known host");

  try {
    let dropAndRegeneratePatientIndex = false;
    if (clearIndex) {
      console.log(`Cleaning & reindexing ${patientESIndex} index`);
      dropAndRegeneratePatientIndex = await dropAndGenerateIndex(patientESIndex, ESPatientIndexBody);
    } else {
      console.log(`Reindexing ${patientESIndex} index without a fresh clean`);
      dropAndRegeneratePatientIndex = true;
    }

    if (dropAndRegeneratePatientIndex) {
      const isIndexAllPatients = await indexAllPatientESData();
      if (isIndexAllPatients) {
        return sendSuccess({ message: `${patientESIndex} index has been reindexed successfully at ${formatDateTime(new Date().toISOString())}` }, 200);
      }
    }
    return sendErrorMsg(`Reindexing of ${patientESIndex} index failed at ${formatDateTime(new Date().toISOString())}`);
  } catch (error) {
    console.log(error);
    return sendErrorMsg(`Reindexing of ${patientESIndex} index failed at ${formatDateTime(new Date().toISOString())}, ${(error as any).message}`);
  }
}

