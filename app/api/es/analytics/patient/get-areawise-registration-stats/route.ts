import { getRevalidationTime } from "@library/utils";
import { esBaseClient } from "@providers/elasticsearch/ESBase";
import { patientESIndex } from "@providers/elasticsearch/patientIndex/ESPatientIndex";
import { districtCodes, divisionCodes } from "@utils/constantsInMemory";
import { ValidateDateAndDivisionResponseInterface } from "@utils/interfaces/DataModels/ApiRequestQueryParamInterfaces";
import { AreaWiseRegistrationStatsProps } from "@utils/interfaces/DataModels/LocalityInterfaces";
import { validateFormData } from "@utils/models/Validation";
import { cacheHeaderes, noCacheHeaderes, sendErrorMsg } from "@utils/responseHandlers/responseHandler";
import { NextRequest, NextResponse } from "next/server";
import "server-only";


// In-memory cache for storing results with timestamps (cache expires after 5 minutes)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = getRevalidationTime(true) * 1000; // Cache expiry time in milliseconds (get long query time)

/**
 * Get the count of documents matching the given division and district ids
 * @param req
 * @param res
 * @returns
 */
export async function GET(req: NextRequest) {
  const { valid, errors, results }: ValidateDateAndDivisionResponseInterface =
    await validateFormData(req, false, false, "Get Area Wise Stats");
  if (!valid || !results) {
    return sendErrorMsg(String(errors));
  }

  // Format to YYYY-MM-DD
  // Extract only the date (YYYY-MM-DD) from dateFrom and dateTo
  const dateFrom = new Date(results.dateFrom);
  const dateTo = new Date(results.dateTo);

  // Format to YYYY-MM-DD
  const dateFromStr = dateFrom.toISOString().split('T')[0];
  const dateToStr = dateTo.toISOString().split('T')[0];
  const dateNow = Date.now();
  // Generate a cache key based on the date range
  const cacheKey = `${dateFromStr}_${dateToStr}`;

  console.log("The cache key is ", cacheKey);


  // Check if the response is cached and not expired
  const cached = cache.get(cacheKey);
  if (cached && dateNow - cached.timestamp < CACHE_TTL) {
    console.log("Cache hit for", cacheKey);  // Log the cache hit for debugging
    return NextResponse.json(cached.data, {
      status: 200,
      headers:
        process.env.NODE_ENV === "development" ? noCacheHeaderes : cacheHeaderes,
    });
  }

  // If not cached or expired, fetch the data from Elasticsearch
  const response: AreaWiseRegistrationStatsProps =
    await getDivDistrictRegistrationStats(results.dateFrom, results.dateTo);

  // Store the response in the cache with a timestamp
  cache.set(cacheKey, { data: response, timestamp: dateNow });
  console.log("Cache MISS for", cacheKey);
  return NextResponse.json(response, {
    status: 200,
    headers:
      process.env.NODE_ENV === "development" ? noCacheHeaderes : cacheHeaderes,
  });
}

/**
 * Constructs the response Object Structure for the API
 * Returns the count of documents matching the given division and district ids
 * @returns
 */
async function getDivDistrictRegistrationStats(
  minDate: string,
  maxDate: string
) {
  // Loop through divisionMapping and districtMapping
  const tempData: { [key: string]: any } = {};
  for (const divisionId in divisionCodes) {
    const division = divisionCodes[divisionId];
    const districtPrefix = divisionId.slice(0, 2);

    tempData[division] = {
      count: await fetchDivisionwiseAndOptionalDistrictWiseCount(
        divisionId,
        "",
        minDate,
        maxDate
      ),
    };

    // Loop through districtMapping
    for (const districtId in districtCodes) {
      const district = districtCodes[districtId];

      // Check if the first two digits of the districtId match the division's prefix
      if (districtId.startsWith(districtPrefix)) {
        const districtName = getDistrictNameFromId(districtId);
        // console.log(districtName);
        if (!tempData[division].districts) {
          tempData[division].districts = {};
        }
        if (!(districtName in tempData[division].districts)) {
          tempData[division].districts[districtName] =
            await fetchDivisionwiseAndOptionalDistrictWiseCount(
              divisionId,
              districtId.substring(2),
              minDate,
              maxDate
            );
        }
        // console.log(
        //   `Elasticsearch response for ${division} - ${district}:`,
        //   tempData[division].districts[districtName]
        // );
      }
    }
  }
  const results: AreaWiseRegistrationStatsProps = tempData;
  return results;
}

/**
 * Fetch the count of documents matching the given division and district ids
 * @param divisionId
 * @param districtId
 * @returns
 */
async function fetchDivisionwiseAndOptionalDistrictWiseCount(
  divisionId: string,
  districtId: string = "",
  minDate: string,
  maxDate: string
) {
  try {
    const mustQuery: Array<any> = [
      { term: { division_id: Number(divisionId) } },
    ];
    // Add district query if districtId is provided
    if (districtId) {
      mustQuery.push({ term: { district_id: Number(districtId) } });
    }

    const filters: any = [];
    filters.push({
      range: {
        created_at: {
          gte: minDate,
          lte: maxDate,
        },
      },
    });

    const response: any = await esBaseClient.search({
      index: patientESIndex,
      body: {
        query: {
          bool: {
            must: mustQuery,
            filter: filters,
          },
        },
        size: 0, // Set size to 0 to exclude hits from the response
        aggs: {
          document_count: {
            cardinality: {
              field: "health_id.keyword",
            },
          },
        },
      },
    });
    // console.log("Response ES");
    // console.log(response);
    return response.body.aggregations.document_count.value;
  } catch (error) {
    console.error("Error fetching Elasticsearch data:", error);
    throw error;
  }
}

/**
 * Helper function to get district name from id
 * @param districtId
 * @returns
 */
function getDistrictNameFromId(districtId: string) {
  // Implement the logic to get the district name from the district id
  // Replace with your actual implementation
  const filteredDistricts = Object.keys(districtCodes).filter((district) => {
    //check if row.district_id is the key of district
    return district === districtId;
  });
  // console.log(
  //   "<<filteredDistricts>> " +
  //     districtMapping[Object.values(filteredDistricts)[0]]
  // );
  return districtCodes[Object.values(filteredDistricts)[0]];
}
