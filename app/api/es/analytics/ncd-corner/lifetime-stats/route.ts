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
        const output = {
            totalPatients: result.hits.total.value,
            totalReferrals: result.aggregations.Referrals.doc_count,
            totalFollowUps: result.aggregations.FollowUps.doc_count,
            emergencyCounts: result.aggregations.serviceLocation.buckets[0].doc_count
        }


        return output;
    } catch (error) {
        console.error(error);
        return [];
    }
};

