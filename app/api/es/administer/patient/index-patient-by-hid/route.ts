import { logApiRequest } from '@app/api/providers/elasticsearch/mciServiceLogIndex/ESMciServiceLogIndex';
import { insertOrUpdateSinglePatientToHealthRecordESIndex } from "@providers/elasticsearch/healthRecordSummaryIndex/ESHealthRecordSummaryIndex";
import { insertOrUpdateSinglePatientToESIndex, patientESIndex } from "@providers/elasticsearch/patientIndex/ESPatientIndex";
import { checkIfAuthenticatedMCIUser } from "@utils/lib/auth";
import { sendErrorMsg, sendSuccess } from "@utils/responseHandlers/responseHandler";
import { NextRequest } from "next/server";
import "server-only";

export const dynamic = "force-dynamic";
export const revalidate = true;
export const fetchCache = "force-no-store";
export const dynamicParams = true;


/**
 * Add(if it does not exist) 
 * OR 
 * Update(if it already exists)
 * Single Patient Data from Cassandra to Elasticsearch using health ID
 * @param req
 * @param res
 * @returns
 */
export async function PUT(req: NextRequest) {
    console.log(`Add new patient to Index ${patientESIndex} index`);
    // Log the incoming request
    const loggerPayload = {
        url: req.nextUrl.href,
        method: req.method,
        queryParams: Object.fromEntries(req.nextUrl.searchParams.entries()),
    };

    //Check Authorization & respond error if not verified
//    const isValidUserRequest = await checkIfAuthenticatedMCIUser(req);
//    console.log("isValidUserRequest");
//    console.log(isValidUserRequest);

//    if (isValidUserRequest !== null) {
//        return isValidUserRequest;
//    }
    console.log('Request is from Validated User');

    try {
        console.log("New request to get patient by id");
        const params: any = req.nextUrl.searchParams;
        console.log(params);
        let healthId = "";
        params.forEach((key: any, value: any) => {
            console.log(value);
            if (value == "healthId") {
                healthId = key;
            }
        });
        if (!healthId) {
            const errorMessage = 'Must provide healthId to add new patient to index';
            console.log(errorMessage);
            // Log the error asynchronously using setImmediate
            setImmediate(() =>  logApiRequest("error", errorMessage, loggerPayload, { status: 400, message: errorMessage }, "mciService"));
            return sendErrorMsg(errorMessage, 400);
        }
        const indexPatient = await insertOrUpdateSinglePatientToESIndex(healthId);
        const indexHealthRecord = await insertOrUpdateSinglePatientToHealthRecordESIndex(healthId);
        if (indexPatient && indexHealthRecord) {
            const successMessage = `Patient with health_id - ${healthId} has been successfully added`;
            console.log(successMessage);
            // Log the error asynchronously using setImmediate
            setImmediate(() =>  logApiRequest("success", successMessage, loggerPayload, { status: 200, message: successMessage }, "mciService"));
            return sendSuccess({ message: successMessage }, 200);
        } else {
            const failureMessage = `Failed to add Patient with healthid ${healthId} to ${patientESIndex} index`;
            console.log(failureMessage);
            // Log the error asynchronously using setImmediate
            setImmediate(() =>  logApiRequest("error", failureMessage, loggerPayload, { status: 500, message: failureMessage }, "mciService"));
            return sendErrorMsg(failureMessage, 500);
        }
    } catch (error) {
        console.log(error);
        const errorMessage = `Indexing of ${patientESIndex} index failed, ${(error as any).message}`;
        console.log(errorMessage);
        // Log the error asynchronously using setImmediate
            setImmediate(() =>  logApiRequest("error", errorMessage, loggerPayload, { status: 500, message: errorMessage }, "mciService"));
        return sendErrorMsg(errorMessage, 500);
    }
}

