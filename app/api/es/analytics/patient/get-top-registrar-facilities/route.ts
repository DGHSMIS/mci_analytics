import "server-only";
import {
  fetchTopPatientRegisteringFacilities,
  findAgeRangewiseHighestRegisteringFacilities,
  findGenderwiseTopRegisteringFacilities
} from "@utils/esQueries/patientIndex/aggQueriesForRegistrationStats";
import { ValidateDateAndDivisionResponseInterface } from "@utils/interfaces/FormDataInterfaces";
import { RankItemProps, RankListProps } from "@utils/interfaces/RankListProps";
import { resolveFacilityDetailURLFromNameAndId } from "@utils/lib/apiList";
import { validateFormData } from "@utils/models/Validation";
import { sendErrorMsg, sendSuccess } from "@utils/responseHandler";
import { NextRequest } from "next/server";
import process from "process";
import { getEncountersByFacilities } from "../../encounter/get-encounters-by-facilities/route";

interface TopRegFacilityRespInterface {
  aggregations: {
    top_facilities: {
      buckets: {
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
        doc_count: any;
      }[];
    };
  };
}

/**
 * Get Top 10 Registrar Facilities within a given date range
 * @param req
 * @constructor
 */
export async function GET(req: NextRequest) {
  // Send the error response if the validation fails

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

  // //Collect the validation params for pre-processing
  const serviceOverview: RankListProps[] = [];
  const topXFacilities = await fetchTopPatientRegFacsAndTransformToRankListItem(
    results.dateFrom,
    results.dateTo,
  );
  serviceOverview.push(topXFacilities);

  // Get Encounter Stats
  const getEncountersByFacilitiesResult: RankListProps = await getEncountersByFacilities(results.dateFrom, results.dateTo);
  serviceOverview.push(getEncountersByFacilitiesResult);

  // //Find Males
  const topMaleFacilities = await getGenderwiseTopXFacilitiesAndTransformToRankListItem(
    results.dateFrom,
    results.dateTo,
    "M",
  );
  serviceOverview.push(topMaleFacilities);
  // //Find Female
  const topFemaleFacilities = await getGenderwiseTopXFacilitiesAndTransformToRankListItem(
    results.dateFrom,
    results.dateTo,
    "F",
  );
  serviceOverview.push(topFemaleFacilities);
  // //Find Top Child Registering Facilities
  // const topChildRegisteringFacilities = await findHighestChildrenRegisteringFacilitiesAndTransformToRankListItem(results.dateFrom,
  //   results.dateTo, 'now-16y/y', 'now/y');
  // serviceOverview.push(topChildRegisteringFacilities);
  return sendSuccess(serviceOverview);
}

/**
 * Fetch Top X Registrar Facilities within a given date range
 * @param daysFrom 
 * @param dateTo 
 * @param totalResults 
 * @returns 
 */
async function fetchTopPatientRegFacsAndTransformToRankListItem(
  daysFrom: string,
  dateTo: string,
  totalResults: number = 10,
) {

  const esIndexResponse = await fetchTopPatientRegisteringFacilities(daysFrom, dateTo);
  console.log("esIndexResponseesIndexResponse");
  console.log(esIndexResponse.body);

  const finalResults: RankListProps = {
    listTitle: "Top HID Providers",
    titleIconColor: "#004D3A",
    titleIcon: "arrow-up",
    titleColor: "text-primary-500",
    listHeader: {
      id: "#ID",
      name: "Facility Name",
      total: "Total Reg.",
    },
    listData: await transformResponseToRankList(
      esIndexResponse.body as TopRegFacilityRespInterface,
    ),
  };
  return finalResults;
}

/**
 * Transform the response to Rank List Item
 * @param response 
 * @returns 
 */
const transformResponseToRankList = async (
  response: TopRegFacilityRespInterface,
): Promise<RankItemProps[]> => {
  return await Promise.all(
    response.aggregations.top_facilities.buckets
      .map(
        async (bucket: {
          facility_name: {
            hits: {
              hits: {
                _source: {
                  created_facility_id: any;
                  created_by: {
                    facility: {
                      name: string;
                      id: string | number;
                    };
                  };
                };
              }[];
            };
          };
          doc_count: any;
        }) => {
          console.log("bucket");
          console.log(bucket.facility_name.hits.hits[0]);
          return (
            {
              id: bucket.facility_name.hits.hits[0]._source.created_facility_id ? bucket.facility_name.hits.hits[0]._source.created_facility_id : bucket.facility_name.hits.hits[0]._source.created_by.facility.id,
              name:
                bucket.facility_name.hits.hits[0]._source.created_by.facility.name
                  .length > 0
                  ? bucket.facility_name.hits.hits[0]._source.created_by.facility.name
                  : await getFacilityNameFromId(
                    String(
                      bucket.facility_name.hits.hits[0]._source.created_facility_id ? bucket.facility_name.hits.hits[0]._source.created_facility_id : bucket.facility_name.hits.hits[0]._source.created_by.facility.id,
                    ),
                  ),
              total: bucket.doc_count,
            })
        },
      ),
  );
};

/**
 * Get Genderwise Top X Registering Facilities within a given date range
 * @param daysFrom 
 * @param dateTo 
 * @param gender 
 * @param totalResults 
 * @returns 
 */
async function getGenderwiseTopXFacilitiesAndTransformToRankListItem(
  daysFrom: string,
  dateTo: string,
  gender: string = "F",
  totalResults: number = 10,
) {

  const esIndexResponse = await findGenderwiseTopRegisteringFacilities(daysFrom, dateTo, gender);
  console.log("esIndexResponse");
  console.log(esIndexResponse.body.aggregations.top_facilities);
  // Now you can await the results of topFacilityBuckets
  const results = await topFacilityBuckets(esIndexResponse.body.aggregations.top_facilities.buckets);

  const getListTitle = (gender: string) => {
    if (gender === "F") {
      return "Top Female Registering Facilities";
    } else if (gender === "M") {
      return "Top Male Registering Facilities";
    } else {
      return "N/A";
    }
  };
  const genderwiseFacilityList: RankListProps = {
    listTitle: getListTitle(gender),
    titleIconColor: "#004D3A",
    titleIcon: "arrow-up",
    titleColor: "text-primary-500",
    listHeader: {
      id: "#ID",
      name: "Facility Name",
      total: "Total Reg.",
    },
    listData: results,
  };
  return genderwiseFacilityList;
}

/**
 * Find Hightest Registering Facilities for Children and transform to Rank List Item within a given date range
 * @param daysFrom 
 * @param dateTo 
 * @param ageMax 
 * @param ageMin 
 * @param totalResults 
 * @returns 
 */
async function findHighestChildrenRegisteringFacilitiesAndTransformToRankListItem(daysFrom: string,
  dateTo: string, ageMax: string = 'now-16y/y', ageMin = "now/y", totalResults: number = 10) {
  const facilityRating = await findAgeRangewiseHighestRegisteringFacilities(daysFrom,
    dateTo, ageMax, ageMin, totalResults);
  // return facilityRating.body.aggregations.top_facilities.buckets;
  const results = await topFacilityBuckets(facilityRating.body.aggregations.top_facilities.buckets);
  const finalResults: RankListProps = {
    listTitle: "Top Child Registering Facilities",
    titleIconColor: "#004D3A",
    titleIcon: "arrow-up",
    titleColor: "text-primary-500",
    listHeader: {
      id: "#ID",
      name: "Facility Name",
      total: "Total Reg.",
    },
    listData: results,
  };

  return finalResults;
}

const getFacilityNameFromId = async (facilityId: string) => {
  const getFacilityURL = resolveFacilityDetailURLFromNameAndId(
    "auth-get-facility-by-id",
    facilityId,
  );
  try {
    const response = await fetch(getFacilityURL, {
      method: "GET",
      headers: {
        "X-Auth-Token": String(process.env.NEXT_X_FACILITY_AUTH_TOKEN) || "",
        "client-id": String(process.env.NEXT_X_FACILITY_CLIENT_ID) || "",
      },
    });
    if (response.status === 200) {
      const facilityAllData: any = await response.json();
      return facilityAllData.name;
    }
    return "Unknown";
  } catch (error) {
    console.log(error);
    return "Unknown";
  }
};


// Extract top facility IDs and counts from the aggregation response
const topFacilityBuckets = async (buckets: any = []) => {
  // Use Promise.all to await all the promises and collect results
  const results: RankItemProps[] = await Promise.all(
    buckets.map(async (bucket: any): Promise<RankItemProps> => {
      return {
        id: bucket.key as String,
        name: await getFacilityNameFromId(bucket.key),
        total: bucket.doc_count,
      } as RankItemProps;
    }),
  );

  return results;
};