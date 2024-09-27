import { fetchEncountersByFacility } from "@utils/esQueries/encounterIndex/aggQueriesForEncounterStats";
import { ValidateDateAndDivisionResponseInterface } from "@utils/interfaces/FormDataInterfaces";
import { RankItemProps, RankListProps } from "@utils/interfaces/RankListProps";
import { validateFormData } from "@utils/models/Validation";
import fetchAndCacheFacilityInfo from "@utils/providers/fetchAndCacheFacilityInfo";
import { sendErrorMsg, sendSuccess } from "@utils/responseHandler";
import { NextRequest } from "next/server";
import "server-only";
import { FacilityInterface } from '../../../../../../utils/interfaces/FacilityInterfaces';

// export const dynamic = "force-dynamic";
export const revalidate = process.env.NODE_ENV === "development" ? 0 : 7200;
export const fetchCache = "auto";
export const dynamicParams = false;

interface TopEncounterFacilityRespBucketInterface {
    key: number;
    doc_count: number;
    facility_name: {
        hits: {
            hits: {
                _source: {
                    created_facility_id: Number;
                    created_by: {
                        facility: {
                            name: string;
                            id: string | number; // <--- Add this line for the id
                        };
                    };
                };
            }[];
        };
    };
}


interface TopEncounterFacilityRespInterface {
    aggregations: {
        top_facilities: {
            buckets: TopEncounterFacilityRespBucketInterface[];
        };
    };
}

/**
 * Reindex All Data from Cassandra to Elasticsearch
 * @param req
 * @param res
 * @returns
 */
export async function GET(req: NextRequest) {

    const { valid, errors, results }: ValidateDateAndDivisionResponseInterface =
        await validateFormData(req, false, false);
    console.log("The results are ");
    console.table(results);
    console.table(valid);
    if (!valid || !results) {
        console.log("The errors are ");
        console.log(errors);
        return sendErrorMsg(String(errors));
    }

    // Get Stats
    const getEncountersByFacilitiesResult:RankListProps = await getEncountersByFacilities(results.dateFrom, results.dateTo);

    return sendSuccess(getEncountersByFacilitiesResult);
}


export async function getEncountersByFacilities(dateFrom:string="2023-08-25T03:30:28.468Z", dateTo:string= String(new Date().toISOString())) {
    const totalResults = 1000;
    const esIndexResponse = await fetchEncountersByFacility(dateFrom, dateTo, totalResults);

    const resultBucket: TopEncounterFacilityRespInterface = esIndexResponse.body as TopEncounterFacilityRespInterface;

    const finalResults: RankListProps = {
        listTitle: "Top Clinical Record Provider",
        titleIconColor: "#004D3A",
        titleIcon: "arrow-up",
        titleColor: "text-primary-500",
        listHeader: {
            id: "#ID",
            name: "Facility Name",
            total: "Total Reg.",
        },
        listData: await transformResponseToRankList(resultBucket)
    };

    return finalResults;
}

/**
 * Transform the response to Rank List Item
 * @param response 
 * @returns 
 */
const transformResponseToRankList = async (
    data: TopEncounterFacilityRespInterface,
): Promise<RankItemProps[]> => {
    return await Promise.all(
        data.aggregations.top_facilities.buckets
            .map(
                async (bucket: TopEncounterFacilityRespBucketInterface) => {
                    console.log("bucket");
                    console.log(bucket.key);

                    const facilityInfo: FacilityInterface = await fetchAndCacheFacilityInfo(bucket.key as number);

                    return (
                        {
                            id: bucket.key,
                            name: facilityInfo.name ? facilityInfo.name : "Unknown",
                            total: bucket.doc_count,
                        })
                },
            ),
    );
};
