import { esBaseClient } from "@providers/elasticsearch/ESBase";
import { ncdESIndex } from "@providers/elasticsearch/ncdIndex/ESPediatricNCDIndex";
import { NextRequest, NextResponse } from "next/server";
import "server-only";

export const dynamic = "force-dynamic";
export const revalidate = true;
export const fetchCache = "force-no-store";
export const dynamicParams = true;

export async function GET(req: NextRequest) {

    const lifeTimeStatsFilterClause = [{
        range: {
            dob: {
                gte: "1971-01-01",
                lte: "now",
            },
        },
    }];

    const lifeTimeNCDStats = await getLifeTimeNCDStats(lifeTimeStatsFilterClause);
    return NextResponse.json(lifeTimeNCDStats, {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
        },
    });
}

const getLifeTimeNCDStats = async (filterClauses: any[]) => {
    // Build the Elasticsearch query
    const body = {
        size: 0,
        query: {
            bool: {
                filter: filterClauses,
            },
        },
        aggs: {
            doc_count: {
                value_count: {
                    field: "patient_id.keyword",
                },
            },
            serviceLocation: {
                terms: {
                    field: "service_location",
                    min_doc_count: 0,
                    include: "Emergency",
                },
            },
            Referrals: {
                filter: {
                    term: {
                        is_referred_to_higher_facility: true,
                    },
                },
            },
            FollowUps: {
                filter: {
                    term: {
                        is_follow_up: true,
                    },
                },
            },
        }
    };

    try {
        const { body: result } = await esBaseClient.search({
            index: ncdESIndex,
            body,
        });

        console.log("Lifetime Stats data is ");
        console.log(result)
        console.log("facility aggregations are ");
        console.log(result.aggregations);
        console.log(result.aggregations.serviceLocation.buckets);
        console.log(result.hits.total.value);
	console.log("Aggregations");
	console.log(result.aggregations);
	console.log(result.aggregations.Referrals ? result.aggregations.Referrals.doc_count : 0)
	console.log("Aggregations 1");
	console.log(result.aggregations.FollowUps ? result.aggregations.FollowUps.doc_count : 0)
	console.log(result.aggregations.serviceLocation ? result.aggregations.serviceLocation.buckets.length > 0 ?  result.aggregations.serviceLocation.buckets[0].doc_count : 0 : 0);
	const output = {
            totalPatients: result.hits.total.value ?? 0,
            totalReferrals: result.aggregations.Referrals ? result.aggregations.Referrals.doc_count : 0,
            totalFollowUps: result.aggregations.FollowUps ? result.aggregations.FollowUps.doc_count : 0,
            emergencyCounts: result.aggregations.serviceLocation ? result.aggregations.serviceLocation.buckets.length > 0 ?  result.aggregations.serviceLocation.buckets[0].doc_count : 0 : 0
        }


        return output;
    } catch (error) {
        console.error(error);
        return {
            totalPatients: 0,
            totalReferrals: 0,
            totalFollowUps: 0,
            emergencyCounts: 0
        }
    }
};

