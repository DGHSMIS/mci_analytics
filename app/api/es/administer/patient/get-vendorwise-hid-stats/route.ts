import { encounterIndexName } from "@providers/elasticsearch/constants";
import { esBaseClient } from "@providers/elasticsearch/ESBase";
import { patientESIndex } from "@providers/elasticsearch/patientIndex/ESPatientIndex";
import { sendErrorMsg, sendSuccess } from "@utils/responseHandlers/responseHandler";
import { xMonthsAgo } from "@utils/utilityFunctions";
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
export async function POST(req: NextRequest) {
    const facility_list: number[] = await req.json();
    const params = req.nextUrl.searchParams;
    let dateFrom = params.get("dateFrom") || xMonthsAgo(3);
    let dateTo = params.get("dateTo") || xMonthsAgo(0);
    try {

        const responsePatientIndex = await esBaseClient.search({
            index: patientESIndex,
            body: {
                size: 0, // No documents in response, only aggregation
                query: {
                    terms: {
                        created_facility_id: facility_list,
                    },
                },
                aggs: {
                    facility_counts: {
                        terms: {
                            field: 'created_facility_id',
                            size: facility_list.length, // Limit to the number of facilities in your list
                            min_doc_count: 0
                        },
                    },
                },
            },
        });
        console.log("Response responsePatientIndex");
        // console.log(responsePatientIndex.body);
        // console.log(responsePatientIndex.body.aggregations);
        console.log(responsePatientIndex.body.aggregations.facility_counts.buckets);
        interface BucketData {
            key: number;
            doc_count: number;
        }
        const patientAggResults: BucketData[] = responsePatientIndex.body.aggregations.facility_counts.buckets;

        //Loop through the patientAggResults and aggregate the doc_count
        let totalPatients = 0;
        patientAggResults.forEach((patientAggResult) => {
            totalPatients += patientAggResult.doc_count;
        });


        const responsePatientIndexForLast3Months = await esBaseClient.search({
            index: patientESIndex,
            body: {
                size: 0, // No documents in response, only aggregation
                query: {
                    bool: {
                        must: [
                            {
                                terms: {
                                    created_facility_id: facility_list,
                                },
                            },
                            {
                                range: {
                                    created_at: {
                                        gte: dateFrom,
                                        lte: dateTo
                                    }
                                }
                            }

                        ]
                    }
                },
                aggs: {
                    facility_counts: {
                        terms: {
                            field: 'created_facility_id',
                            size: facility_list.length, // Limit to the number of facilities in your list
                            min_doc_count: 0
                        },
                    },

                },
            },
        });

        console.log("Response responsePatientIndexForLast3Months for last 3 months");
        // console.log(responsePatientIndexForLast3Months.body);
        // console.log(responsePatientIndexForLast3Months.body.aggregations);
        console.log(responsePatientIndexForLast3Months.body.aggregations.facility_counts.buckets);
        interface BucketData {
            key: number;
            doc_count: number;
        }
        const patientAggResultsLast3Months: BucketData[] = responsePatientIndexForLast3Months.body.aggregations.facility_counts.buckets;

        //Loop through the patientAggResults and aggregate the doc_count
        let totalPatientsForLast3Months = 0;
        patientAggResultsLast3Months.forEach((patientAggResultsLast3Month) => {
            totalPatientsForLast3Months += patientAggResultsLast3Month.doc_count;
        });

        const responseEncounterIndex = await esBaseClient.search({
            index: encounterIndexName,
            body: {
                size: 0, // No documents in response, only aggregation
                query: {
                    terms: {
                        created_facility_id: facility_list,
                    },

                },
                aggs: {
                    facility_counts: {
                        terms: {
                            field: 'created_facility_id',
                            size: facility_list.length, // Limit to the number of facilities in your list
                            min_doc_count: 0
                        },
                    },
                },
            },
        });
        console.log("Response responseEncounterIndex");
        // console.log(responsePatientIndex.body);
        // console.log(responsePatientIndex.body.aggregations);
        console.log(responseEncounterIndex.body.aggregations.facility_counts.buckets);
        interface BucketData {
            key: number;
            doc_count: number;
        }
        const encounterAggResults: BucketData[] = responseEncounterIndex.body.aggregations.facility_counts.buckets;

        //Loop through the encounterAggResults and aggregate the doc_count
        let totalEncounters = 0;
        encounterAggResults.forEach((encounterAggResult) => {
            totalEncounters += encounterAggResult.doc_count;
        });

        return sendSuccess({
            "hidCreated": `${totalPatients}`,
            "hidCreatedLast3Months": `${totalPatientsForLast3Months}`,
            "encountersCreated": `${totalEncounters}`
        }, 200);

    } catch (error) {
        console.error('Error fetching aggregation:', error);
        return sendErrorMsg("Error", 500);
    }
}