import { encounterIndexName } from "@api/providers/elasticsearch/constants";
import { esBaseClient } from "@api/providers/elasticsearch/ESBase";
import { ESDateRangeSingleItemQueryInterface } from "@utils/interfaces/ESModelInterfaces";
import { FacilityInterface } from "@utils/interfaces/FacilityInterfaces";
import { RankItemProps, RankListProps } from "@utils/interfaces/RankListProps";
import fetchAndCacheFacilityInfo from "@utils/providers/fetchAndCacheFacilityInfo";
import { datesRangeGenerator } from "@utils/utilityFunctions";


export interface TopEncounterFacilityRespBucketInterface {
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


export  interface TopEncounterFacilityRespInterface {
  aggregations: {
      top_facilities: {
          buckets: TopEncounterFacilityRespBucketInterface[];
      };
  };
}

/**
 * Get Facilities with the highest frequency of patient registrations
 * within a given date range
 */
export async function fetchEncountersByFacility(
    daysFrom: string,
    dateTo: string,
    totalResults: number = 15,
) {
    const getRange: ESDateRangeSingleItemQueryInterface[] = datesRangeGenerator(
        daysFrom,
        dateTo,
    );
    
    const getTopXFacilitiesQuery = {
        size: 0,
        query: {
          range: {
            received_at: {
              gte: getRange[0].from, // start of the entire range
              lte: getRange[getRange.length - 1].to, // end of the entire range
            },
          },
        },
        aggs: {
          top_facilities: {
            terms: {
              field: "created_facility_id",
              size: totalResults,
              order: {
                _count: "desc",
              },
            },
            aggs: {
              facility_id: {
                top_hits: {
                  _source: {
                    includes: [
                      "created_facility_id",
                    ],
                  },
                  size: 1,
                },
              },
            },
          },
        },
      };
      console.log("The query is: ", getTopXFacilitiesQuery);
      
      const esIndexResponse = await esBaseClient.search({
        index: encounterIndexName,
        body: getTopXFacilitiesQuery,
      });
      console.log("The response is: ", esIndexResponse);
      return esIndexResponse;
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
