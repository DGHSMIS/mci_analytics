import { ApiResponse } from "@elastic/elasticsearch";
import { esBaseClient } from "@providers/elasticsearch/ESBase";
import { patientESIndex } from "@providers/elasticsearch/patientIndex/ESPatientIndex";
import { ESDateRangeSingleItemQueryInterface } from "@utils/interfaces/DataModels/ESModelInterfaces";
import { datesRangeGenerator } from "@utils/utilityFunctions";

/**
 * Get Facilities with the highest frequency of patient registrations
 * within a given date range
 */
export async function fetchTopPatientRegisteringFacilities(
  daysFrom: string,
  dateTo: string,
  totalResults: number = 15,
  divisionId?: number,
  districtId?: number,
  upazillaId?: number
) {
  const getRange: ESDateRangeSingleItemQueryInterface[] = datesRangeGenerator(
    daysFrom,
    dateTo,
  );

  const getTopXFacilitiesQuery = {
    size: 0,
    query: {
      range: {
        created_at: {
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
          facility_name: {
            top_hits: {
              _source: {
                includes: [
                  "created_by.facility.name",
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

  const esIndexResponse = await esBaseClient.search({
    index: patientESIndex,
    body: getTopXFacilitiesQuery,
  });
  return esIndexResponse;
}


/**
 * Get Gender-wise top Registering Facilities
 * within a given date range
 * Pass "M" or "F" for gender to get the respective results
 */
export async function findGenderwiseTopRegisteringFacilities(
  daysFrom: string,
  dateTo: string,
  gender: string = "F",
  totalResults: number = 15,
) {
  const getRange: ESDateRangeSingleItemQueryInterface[] = datesRangeGenerator(
    daysFrom,
    dateTo,
  );

  const getTopXFacilitiesQuery = {
    size: 0,
    _source: ["created_by.facility.id"],
    query: {
      bool: {
        filter: [
          {
            term: {
              gender: gender,
            },
          },
          {
            range: {
              created_at: {
                gte: getRange[0].from, // start of the entire range
                lte: getRange[getRange.length - 1].to, // end of the entire range
              },
            },
          },
        ],
      },
    },
    aggs: {
      top_facilities: {
        terms: {
          field: 'created_facility_id',
          size: totalResults,
          order: {
            _count: 'desc',
          },
        },
      },
    },
  };
  const results = await esBaseClient.search({
    index: patientESIndex,
    body: getTopXFacilitiesQuery,
  });

  return results;
}

/**
 * Find Top Facilities registering patients
 * within the given age range
 */
export async function findAgeRangewiseHighestRegisteringFacilities(daysFrom: string,
  dateTo: string, ageMax: string = 'now-16y/y', ageMin = "now/y", totalResults: number = 15) {

  const getRange: ESDateRangeSingleItemQueryInterface[] = datesRangeGenerator(
    daysFrom,
    dateTo,
  );
  const esTopChildRegisterarQuery = {
    size: 0,
    query: {
      bool: {
        must: {
          range: {
            date_of_birth: {
              gte: ageMax,
              lte: ageMin,
            },
          },
        },
        filter: {
          range: {
            created_at: {
              gte: getRange[0].from, // start of the entire range
              lte: getRange[getRange.length - 1].to, // end of the entire range
            },
          },
        },
      },
    },
    aggs: {
      top_facilities: {
        terms: {
          field: 'created_facility_id',
          size: totalResults,
          order: {
            _count: 'desc',
          },
        },
      },
    },
  };
  const results = await esBaseClient.search({
    index: patientESIndex,
    body: esTopChildRegisterarQuery,
  });
  return results;
}


/**
 * Find Divisionwise Registrations Stats for all Genders
 * within a given date range
 * pass divisionId to get Only that division's stats
 */

export async function findDateAndDivisionwiseRegisteringFacilities(
  daysFrom: string,
  dateTo: string,
  divisionId: string | null
) {
  //Helper function to generate the date range for Elasticsearch
  const getRange: ESDateRangeSingleItemQueryInterface[] = datesRangeGenerator(
    daysFrom,
    dateTo
  );
  // Helper function to conditionally apply division filter
  const applyDivisionFilter = (divisionId: string | null) => {
    const baseFilter: any = [];
    if (divisionId) {
      baseFilter.push({ term: { division_id: divisionId } });
    }
    console.log("The division filter applied ", baseFilter);
    return baseFilter;
  };
  const optionalDivisionFilter = applyDivisionFilter(divisionId);

  console.log("The optional division filter is ", optionalDivisionFilter);

  // The elasticsearch query to get
  // Aggregated data for the last {dataFrom} days
  // For Male, Female and Others
  const dateAggregationQuery = {
    size: 0,
    aggs: {
      male: {
        filter: {
          bool: {
            must: [
              ...optionalDivisionFilter,
              {
                term: {
                  gender: "M",
                },
              },
            ],
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
          bool: {
            must: [
              ...optionalDivisionFilter,
              {
                term: {
                  gender: "F",
                },
              },
            ],
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
          bool: {
            must: [
              ...optionalDivisionFilter,
              {
                term: {
                  gender: "0",
                },
              },
            ],
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

  const response: ApiResponse<Request, Response> = await esBaseClient.search({
    index: patientESIndex,
    body: dateAggregationQuery,
  });
  return response;
}