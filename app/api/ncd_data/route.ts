import { PGDiseaseInterface } from '@api/providers/prisma/models/PGDiseaseInterface';
import { PGDiseasesOnVisit } from '@api/providers/prisma/models/PGDiseasesOnVisit';
import { PGNCDPayloadLoggerInterface } from '@api/providers/prisma/models/PGNCDPayloadLoggerInterface';
import { PGPatientVisitInterface } from '@api/providers/prisma/models/PGPatientVisitInterface';
import AuthResponseInterface from '@utils/interfaces/Authentication/AuthResponseInterface';
import { FacilityInterface } from '@utils/interfaces/DataModels/FacilityInterfaces';
import { checkIfAuthenticatedProvider } from '@utils/lib/auth';
import { findOrCreateFacility } from '@utils/providers/fetchAndCacheFacilityInfo';
import { insertOrUpdateNCDDataByCreatedTimeToESIndex } from 'app/api/providers/elasticsearch/ncdIndex/ESPediatricNCDIndex';
import prisma from 'app/api/providers/prisma/prismaClient';
import Error from 'next/error';
import { NextRequest, NextResponse } from "next/server";
import process from "process";


const MAX_PATIENT_LIMIT = parseInt(process.env.NEXT_PUBLIC_API_NCD_QUEUE_SIZE ?? "") ?? 1000;

// TODO: Add Facility Verification via API Call to check if the facility exists in the Facility Registry
//Generate Sample Data using the following at https://json-generator.com/#
// [
//     '{{repeat(500, 500)}}',
//     {
//       patientId: '{{integer(1, 999999)}}',
//       patientName: '{{firstName()}} {{surname()}}',
//       dateOfVisit: '{{date(new Date(2024, 10, 30), new Date(), "YYYY-MM-ddThh:mm:ss")}}',
//       dob: '{{date(new Date(integer(2010, 2024), integer(1, 12), integer(1, 28)), new Date(), "YYYY-MM-ddThh:mm:ss")}}',
//       gender: '{{random("Male", "Female", "Other")}}',
//       facilityId: '{{random(10000001 , 10000051, 10000053 , 10000098, 10000104 )}}',
//       serviceLocation: '{{random("IPD", "OPD", "Emergency")}}',
//       diseaseId:  '{{integer(1, 6)}}',
//       isReferredToHigherFacility: '{{bool()}}',
//       isFollowUp: '{{bool()}}'
//     }
//   ]
export async function POST(req: NextRequest) {
    /**
     * Disabled Authentication on Request
     */
    // Check Authorization & respond error if not verified
    const providerUser: AuthResponseInterface = await checkIfAuthenticatedProvider(req);

    if (providerUser.status == "unauthorized") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // console.log('Request is from Validated User');
    const createdAt = new Date().toISOString();
    try {
        const data: PGPatientVisitInterface[] = await req.json();

        // Check if data is an array and does not exceed the limit
        if (!Array.isArray(data) || data.length === 0) {
            return NextResponse.json({ error: 'Data must be a non-empty array of patient records.' }, { status: 400 });
        }

        if (data.length > MAX_PATIENT_LIMIT) {
            return NextResponse.json({ error: `Cannot create more than ${MAX_PATIENT_LIMIT} patients in a single request.` }, { status: 400 });
        }
        const savedPreprocessedData: PGNCDPayloadLoggerInterface = await payloadLogger(data, providerUser);
        /**
        * Fire-and-forget call to async function to sync data to ElasticSearch
        * The async function validates the data and inserts it into the database and then syncs it to ElasticSearch
        */
        Promise.resolve(processSubmittedData(savedPreprocessedData, createdAt)).catch((err) => {
            console.error("Error in syncing data to ElasticSearch:", err);
        });
        return NextResponse.json({
            message: `Success! Payload received for processing`,
        }, { status: 200 });

    } catch (error: Error | any) {
        console.error('Error creating PatientVisits:', error);
        return NextResponse.json({ error: `Failed to create PatientVisits: ${error.message}` }, { status: 500 });
    }
}


//POST Processing Data to Validate and Insert into the Database & then Sync to ElasticSearch
async function processSubmittedData(preprocessedData: PGNCDPayloadLoggerInterface, createdAt: string) {
    try {
        const patientVisits: PGPatientVisitInterface[] = JSON.parse(preprocessedData.payload);
        console.log("Processing Submitted Data 1");
        // Filter out duplicates by checking for existing records
        const skippedRecords = [];
        let totalNewVisits = 0;
        for (const patientVisit of patientVisits) {
            console.log("The Patient Visit data is ", patientVisit);
            if (patientVisit.visitId) {
                console.log("The preprocessedData is");
                console.log(preprocessedData);

                console.log("--------------")
                console.log("The Patient Visit is")
                console.log(patientVisit);
                //Validate if the facility code matches the patient visit facility code, otherwise this is invalid data
                if (preprocessedData.facilityCode === patientVisit.facilityCode) {
                    //Check if the record already exists in the database (combination of visitId & facilityCode is unique)
                    const existingRecord = await prisma.patientVisit.findFirst({
                        where: {
                            visitId: patientVisit.visitId,
                            facilityCode: preprocessedData.facilityCode
                        },
                    });

                    //No existing record found, so add it to the uniquePatientData array
                    if (!existingRecord && patientVisit.diseaseRef) {

                        const diseasesOnVisit: PGDiseasesOnVisit[] = [];
                        // Fetch facility data and add it to the record
                        // Now fetch the facility data from the Facility Registry
                        const facilityData: FacilityInterface = await findOrCreateFacility(patientVisit.facilityCode);
                        console.log("The Facility Data is ")
                        console.log(facilityData);
                        if (facilityData === null) {
                            skippedRecords.push(patientVisit);
                        }
                        console.log("The Facility Name is ")
                        console.log(facilityData.name);
                        console.log(patientVisit.facilityCode);
                        console.log(patientVisit.facilityCode);
                        //Provider can only add records for their own facility
                        let patientVisitInfo: PGPatientVisitInterface = {
                            patientId: patientVisit.patientId,
                            patientName: patientVisit.patientName,
                            healthId: patientVisit.healthId ?? "",
                            visitId: patientVisit.visitId,
                            dateOfVisit: new Date(patientVisit.dateOfVisit),
                            dob: new Date(patientVisit.dob),
                            gender: convertToFormattedGender(patientVisit.gender),
                            facilityCode: patientVisit.facilityCode,
                            serviceLocation: patientVisit.serviceLocation,
                            isReferredToHigherFacility: patientVisit.isReferredToHigherFacility,
                            isFollowUp: patientVisit.isFollowUp,
                            createdAt: new Date(createdAt),
                        }
                        //Add the patientVisitInfo to the database
                        let newVisitInDB = await prisma.patientVisit.create({
                            data: patientVisitInfo,
                        });
                        //Now add the diseases that were detected on the patient visit
                        for (const diseaseRef of patientVisit.diseaseRef) {
                            //Check if the disease exists in the database, otherwise create it
                            const diseaseData = await findOrCreateDisease(diseaseRef.conceptUuId, diseaseRef.conceptName ?? "");
                            diseasesOnVisit.push({
                                patientVisitId: newVisitInDB.id,
                                conceptUuId: diseaseData.conceptUuId,
                                patientSymptoms: diseaseRef.patientSymptoms,
                                createdAt: new Date(createdAt),
                            })
                        }
                        if (newVisitInDB.id != undefined) {
                            let newDiseaseInDB = await prisma.diseasesOnVisit.createMany({
                                data: diseasesOnVisit
                            });
                        }
                        totalNewVisits++;

                    } else {
                        // Add the duplicate record details to skippedRecords
                        skippedRecords.push(patientVisit);
                    }
                } else {
                    // Add the record to skippedRecords if the facility code does not match
                    skippedRecords.push(patientVisit);
                }
            } else {
                // Add the record to skippedRecords if the facility code does not match
                skippedRecords.push(patientVisit);
            }
        }

        // // Insert unique records
        // const newVisits = await prisma.patientVisit.createMany({
        //     data: uniquePatientData,
        // });

        // Insert Skipped Records to SkippedPayloadLogger table
        if (skippedRecords.length > 0) {
            const skippedPayload = await prisma.skippedPayloadLogger.create({
                data: {
                    skippedItems: JSON.stringify(skippedRecords),
                    message: `Skipped ${skippedRecords.length} records due to duplicates or invalid facility data`,
                    providerId: preprocessedData.providerId,
                    payloadId: preprocessedData.id ?? 0,
                    createdAt: new Date(),
                    facilityCode: preprocessedData.facilityCode,
                }
            });
            console.log('Skipped Records:', skippedPayload);
        }
        if (totalNewVisits > 0) {
            console.log('New Records:', totalNewVisits);

            const indexNewData = await insertOrUpdateNCDDataByCreatedTimeToESIndex(createdAt);
            console.log('Indexed New Data:', indexNewData);
        }
        return true;
    } catch (error: any) {

        console.error('Error in processing submitted data:', error);
        await prisma.skippedPayloadLogger.create({
            data: {
                skippedItems: "",
                message: `Error Processing Preprocessed id: ${preprocessedData.providerId}. Exception thrown: ${error.message}`,
                providerId: preprocessedData.providerId,
                payloadId: preprocessedData.id ?? 0,
                createdAt: new Date(),
                facilityCode: preprocessedData.facilityCode,
            }
        });
        throw error;
    }

}



const convertToFormattedGender = (gender:string):'Male' | 'Female' | 'Other' => {
    if(gender.toLowerCase() == 'male'){
        return "Male";
    }
    else if(gender.toLowerCase() == 'female'){
        return "Male";
    }
    else if(gender.toLowerCase() == 'female'){
        return "Male";
    }
    else if(gender.toLowerCase() == 'm'){
        return "Male";
    }
    else if(gender.toLowerCase() == 'f'){
        return "Female"
    }
    else {
        return "Other";
    }
}


/**
 * Save the payload to the database for logging & post-processing
 * @param data 
 * @param providerUser 
 * @returns 
 */
async function payloadLogger(data: PGPatientVisitInterface[], providerUser: AuthResponseInterface): Promise<PGNCDPayloadLoggerInterface> {
    console.log('Payload Received:');
    console.log(data);
    let facilityCode = "";

    providerUser.profiles?.forEach((profile) => {
        if (profile.name === 'facility') {
            facilityCode = String(profile.id);
            console.log('Profile:', profile.name);
            console.log('facilityCode:', profile.id);
            console.log('facilityCode:', facilityCode);
        }
    });

    const loggableData: PGNCDPayloadLoggerInterface = {
        providerId: Number(providerUser.id),
        payload: JSON.stringify(data),
        createdAt: new Date(),
        facilityCode: facilityCode,
        accessToken: String(providerUser.access_token),
    }
    const newPayload = await prisma.nCDPayloadLogger.create({
        data: loggableData
    });

    return newPayload;
}





/**
 * Find Or Create Disease in the Database using the conceptUuId and conceptName
 * 
 * @param conceptUuId 
 * @param conceptName 
 * @returns 
 */
async function findOrCreateDisease(conceptUuId: string, conceptName: string): Promise<PGDiseaseInterface> {

    const diseaseFromDB = await prisma.disease.findFirst({
        where: { conceptName: conceptName.trim() },
    });
    console.log("The Disease from DB is ")
    console.log(diseaseFromDB);
    console.log(conceptName);
    console.log(conceptUuId);
    if (diseaseFromDB !== null) {
        return diseaseFromDB;
    }

    const newDisease: PGDiseaseInterface = await prisma.disease.create({
        data: {
            conceptUuId: conceptUuId.trim(),
            conceptName: conceptName.trim(),
        },
    });

    console.log('New Disease:', newDisease);
    return newDisease;
}