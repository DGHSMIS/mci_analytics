import { esBaseClient } from "@providers/elasticsearch/ESBase";
import { patientESIndex } from "@providers/elasticsearch/patientIndex/ESPatientIndex";
import { ESDateRangeSingleItemQueryInterface } from "@utils/interfaces/ESModelInterfaces";
import { LatestGenderWiseStatsInterface } from "@utils/interfaces/PublicDashboardInterfaces";
import { datesRangeGenerator } from "@utils/utilityFunctions";

/**
 * Contructs the response Object Structure for the API
 * Fetch the count of documents matching the given division and district ids
 * in accordance to daysFromToday which defaults to last 30 days
 * @returns
 * @param daysFromToday
 * @param dateTo
 */
// async function fetchDatewiseAggregatedData(daysFromToday: number = 30) {
export async function fetchDatewiseAggregatedData(
  daysFromToday: string,
  dateTo: string
) {
  try {
    const getRange: ESDateRangeSingleItemQueryInterface[] = datesRangeGenerator(
      daysFromToday,
      dateTo
    );
    // The elasticsearch query to get
    // Agregated data for the last 30 days
    // For Male, Female and Others
    const dateAggregationQuery = {
      size: 0,
      aggs: {
        all: {
          date_range: {
            field: "created_at",
            ranges: getRange,
          },
        },
        male: {
          filter: {
            term: {
              gender: "M",
            },
          },
          aggs: {
            date_items: {
              date_range: {
                field: "created_at",
                ranges: getRange,
              },
            },
          },
        },
        female: {
          filter: {
            term: {
              gender: "F",
            },
          },
          aggs: {
            date_items: {
              date_range: {
                field: "created_at",
                ranges: getRange,
              },
            },
          },
        },
        others: {
          filter: {
            term: {
              gender: "0",
            },
          },
          aggs: {
            date_items: {
              date_range: {
                field: "created_at",
                ranges: getRange,
              },
            },
          },
        },
      },
    };

    const response = await esBaseClient.search({
      index: patientESIndex,
      body: dateAggregationQuery,
    });

    const aggregatorReponse: LatestGenderWiseStatsInterface = {};
    // Construct the response object
    Object.entries(response.body.aggregations).forEach(([key, value]: any) => {
      //   console.log("Key Value Pair>>>>");
      //   console.log(`Key: ${key}`);
      if (key == "all") {
        // console.table(value.buckets);
        aggregatorReponse[key] = value.buckets;
      } else {
        // console.table(value.date_items.buckets);
        aggregatorReponse[key] = value.date_items.buckets;
        // console.log(aggregatorReponse);
      }
      Object.entries(aggregatorReponse[key]).forEach(([_, element], index) => {
        delete element.from_as_string;
        delete element.to_as_string;
        delete element.from;
        delete element.to;
      });
      //   console.log("New Format --");
      //   console.log(aggregatorReponse);
    });

    const nivoData: any = {};
    const categories = Object.keys(response.body.aggregations);
    const barGraphDataGet: any = {};
    // Process 'all' data
    categories.forEach((category, index) => {
      console.log("response.body.aggregations[category].buckets");
      if (index == 0) {
        // console.table(value.buckets);
        barGraphDataGet[response.body.aggregations[category]] =
          response.body.aggregations[category].buckets;
      } else {
        // console.table(value.date_items.buckets);
        barGraphDataGet[response.body.aggregations[category]] =
          response.body.aggregations[category].date_items.buckets;
        // console.log(barGraphDataGet);
      }
      console.log(barGraphDataGet);
      // Process each bucket in the category
      //   barGraphDataGet.forEach((entry: any) => {
      //     const dateKey = entry.key;
      //     if (!nivoData[dateKey]) {
      //       nivoData[dateKey] = { id: dateKey };
      //     }
      //     nivoData[dateKey][category] = entry.doc_count;
      //   });
    });
    console.log("nivoData");
    console.log(nivoData);
    // console.log(Object.keys(response.body.aggregations));
    return aggregatorReponse;
  } catch (error) {
    console.error("Error fetching Elasticsearch data:", error);
    throw error;
  }
}
