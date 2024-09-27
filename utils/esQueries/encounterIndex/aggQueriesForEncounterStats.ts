import { encounterIndexName } from "@api/providers/elasticsearch/constants";
import { esBaseClient } from "@api/providers/elasticsearch/ESBase";
import { ESDateRangeSingleItemQueryInterface } from "@utils/interfaces/ESModelInterfaces";
import { datesRangeGenerator } from "@utils/utilityFunctions";

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