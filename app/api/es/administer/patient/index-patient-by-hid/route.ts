import { insertOrUpdateSinglePatientToHealthRecordESIndex } from "@api/providers/elasticsearch/healthRecordSummaryIndex/ESHealthRecordSummaryIndex";
import { insertOrUpdateSinglePatientToESIndex, patientESIndex } from "@providers/elasticsearch/patientIndex/ESPatientIndex";
import { checkIfAuthenticated } from "@utils/lib/auth";
import { sendErrorMsg, sendSuccess } from "@utils/responseHandler";
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
 * Add/Update Single Patient Data from Cassandra to Elasticsearch using health ID
 * @param req
 * @param res
 * @returns
 */
export async function GET(req: NextRequest) {
    console.log(`Add new patient to Index ${patientESIndex} index`);
    //This route is only accessible from the known hosts
    console.log("Get Latest Data");
    //Check Authorization & respond error if not verified
    const isValidUserRequest = await checkIfAuthenticated(req);
  
    console.log("isValidUserRequest");
    console.log(isValidUserRequest);
    if (isValidUserRequest !== null) {
      return isValidUserRequest;
    }
    console.log('Request is from Validated User');

    try {
        const params: any = req.nextUrl.searchParams;
        console.log("New request to get patient by id");
        console.log(params);
        let healthId = "";
        params.forEach((key: any, value: any) => {
            console.log(value);
            if (value == "healthId") {
                healthId = key;
            }
        });
        if (!healthId) {
            return sendErrorMsg('Must provide healthId to add new patient to index', 400);
        } else {
            const indexPatient = await insertOrUpdateSinglePatientToESIndex(healthId);
            const indexHealthRecord = await insertOrUpdateSinglePatientToHealthRecordESIndex(healthId);
            if (indexPatient && indexHealthRecord) {
                console.log(`Patient with health_id - ${healthId} has been has been successfully added`);
                return sendSuccess({ message: `Patient with health_id - ${healthId} has been has been successfully added` }, 200);
            } else {
                console.log(`Failed to add Patient with healthid ${healthId} to ${patientESIndex} index`);
                return sendErrorMsg(`Failed to add Patient with healthid ${healthId} to ${patientESIndex} index`);
            }
        }
    } catch (error) {
        console.log(error);
        return sendErrorMsg(`Reindexing of ${patientESIndex} index failed, ${(error as any).message}`);
    }
}

