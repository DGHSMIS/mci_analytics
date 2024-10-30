import { insertOrUpdateNCDDataByCreatedTimeToESIndex } from '@api/providers/elasticsearch/ncdIndex/ESPediatricNCDIndex';
import prisma from '@providers/prisma/prismaClient';
import Error from 'next/error';
import { NextRequest, NextResponse } from "next/server";
import { checkIfAuthenticated } from "utils/lib/auth";

const MAX_PATIENT_LIMIT = 500;
// TODO: Add Facility Verification via API Call to check if the facility exists in the Facility Registry
//Generate Sample Data using the following at https://json-generator.com/#
// [
//     '{{repeat(50, 50)}}',
//     {
//       patientId: '{{integer(1, 999999)}}',
//       patientName: '{{firstName()}} {{surname()}}',
//       dateOfVisit: '{{date(new Date(2024, 10, 30), new Date(), "YYYY-MM-ddThh:mm:ss")}}',
//       dob: '{{date(new Date(integer(2010, 2024), integer(1, 12), integer(1, 28)), new Date(), "YYYY-MM-ddThh:mm:ss")}}',
//       gender: '{{random("Male", "Female", "Other")}}',
//       facilityId: '{{integer(20000, 40000)}}',
//       serviceLocation: '{{random("IPD", "OPD", "Emergency")}}',
//       diseaseId:  '{{integer(1, 6)}}',
//       isReferredToHigherFacility: '{{bool()}}',
//       isFollowUp: '{{bool()}}'
//     }
//   ]
export async function POST(req: NextRequest) {
    // Check Authorization & respond error if not verified
    const isValidUserRequest = await checkIfAuthenticated(req);

    if (isValidUserRequest !== null) {
        return isValidUserRequest;
    }
    console.log('Request is from Validated User');
    const createdAt = new Date().toISOString();
    try {
        const data = await req.json();

        // Check if data is an array and does not exceed the limit
        if (!Array.isArray(data) || data.length === 0) {
            return NextResponse.json({ error: 'Data must be a non-empty array of patient records.' }, { status: 400 });
        }

        if (data.length > MAX_PATIENT_LIMIT) {
            return NextResponse.json({ error: `Cannot create more than ${MAX_PATIENT_LIMIT} patients in a single request.` }, { status: 400 });
        }

        // Filter out duplicates by checking for existing records
        const uniquePatientData = [];
        const skippedRecords = [];

        for (const patient of data) {
            const existingRecord = await prisma.patientVisit.findFirst({
                where: {
                    patientId: patient.patientId,
                    dateOfVisit: new Date(patient.dateOfVisit),
                    facilityId: patient.facilityId
                },
            });

            if (!existingRecord) {
                uniquePatientData.push({
                    patientId: patient.patientId,
                    patientName: patient.patientName,
                    dateOfVisit: new Date(patient.dateOfVisit),
                    dob: new Date(patient.dob),
                    gender: patient.gender,
                    facilityId: patient.facilityId,
                    serviceLocation: patient.serviceLocation,
                    diseaseId: patient.diseaseId,
                    isReferredToHigherFacility: patient.isReferredToHigherFacility,
                    isFollowUp: patient.isFollowUp,
                    createdAt: createdAt
                });
            } else {
                // Add the duplicate record details to skippedRecords
                skippedRecords.push(patient);
            }
        }

        // Insert unique records
        const newVisits = await prisma.patientVisit.createMany({
            data: uniquePatientData,
        });

        /**
         * Fire-and-forget call to async function to sync data to ElasticSearch
         * The async function syncs data to ElasticSearch Pediatric NCD Index without waiting for the response
         * The ES Index adds the data that is gte to the createdAt timestamp on the PatientVisit Table
         */
        Promise.resolve(insertOrUpdateNCDDataByCreatedTimeToESIndex(createdAt)).catch((err) => {
            console.error("Error in syncing data to ElasticSearch:", err);
        });
        // If all records are inserted successfully, then return a success message
        if (newVisits.count == data.length) {
            return NextResponse.json({
                message: `${newVisits.count} patient visits created successfully at ${createdAt}`,
            }, { status: 201 });
        } else {
            // If all records are NOT inserted, then return a success message with skipped records info
            return NextResponse.json({
                message: `${newVisits.count} patient visits created successfully at ${createdAt}`,
                skippedRecords: skippedRecords // Returns the array of skipped records
            }, { status: 201 });
        }
    } catch (error: Error | any) {
        console.error('Error creating PatientVisits:', error);
        return NextResponse.json({ error: `Failed to create PatientVisits: ${error.message}` }, { status: 500 });
    }
}
