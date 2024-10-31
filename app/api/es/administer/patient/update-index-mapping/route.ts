import { ESEncounterMapping } from "@api/providers/elasticsearch/encounterIndex/ESEncounterMapping";
import { updateESIndexMapping } from "@api/providers/elasticsearch/ESBase";
import { ESHealthRecordSummaryMapping } from "@api/providers/elasticsearch/healthRecordSummaryIndex/ESHealthRecordSummaryMapping";
import { encounterIndexName, healthRecordESIndexName, patientESIndexName } from '@providers/elasticsearch/constants';
import { patientESIndex } from "@providers/elasticsearch/patientIndex/ESPatientIndex";
import { ESPatientMapping } from "@providers/elasticsearch/patientIndex/ESPatientMapping";
import { checkIfAuthenticatedMCIUser } from "@utils/lib/auth";
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
export async function PUT(req: NextRequest) {
    console.log(`Update the mapping of ${patientESIndex} index`);
    //This route is only accessible from the known hosts
    console.log("Get Latest Data");
    //Check Authorization & respond error if not verified
    const isValidUserRequest = await checkIfAuthenticatedMCIUser(req);

    console.log("isValidUserRequest");
    console.log(isValidUserRequest);
    if (isValidUserRequest !== null) {
        return isValidUserRequest;
    }
    console.log('Request is from Validated User');
    try {

        
        const requestBody = await req.json();
        
        // Process the request body as needed
        console.log('Request Body:', requestBody.indexName);
        
        if (!requestBody.indexName) {
            return sendErrorMsg('Must provide indexName could not be found', 400);
        } else {
            let indexName = requestBody.indexName;

            const indexMappingBody = (indexName: String) => {
                if (indexName == patientESIndexName) {
                    return ESPatientMapping;
                } else if (indexName == healthRecordESIndexName) {
                    return ESHealthRecordSummaryMapping;
                } 
                else if (indexName == encounterIndexName) {
                    return ESEncounterMapping;
                }
                else {
                    throw new Error(`Index ${indexName} not found`);
                }
            }

            const esMapping = indexMappingBody(indexName);

            const updatePatientIndexMapping = await updateESIndexMapping(indexName, esMapping);
            if (updatePatientIndexMapping) {
                console.log(`Index - ${indexName} has been has been updated successfully`);
                return sendSuccess({ message: `Index - ${indexName} has been has been updated successfully` }, 200);
            } else {
                console.log(`Failed to update Index ${indexName} mapping`);
                return sendErrorMsg(`Failed to update Index ${indexName} mapping`);
            }
        }
    } catch (error) {
        console.log(error);
        return sendErrorMsg(`Failed to handle this request`);
    }
}

