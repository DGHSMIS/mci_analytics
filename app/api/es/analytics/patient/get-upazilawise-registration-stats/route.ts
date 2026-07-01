import { getRevalidationTime } from "@library/utils";
import { esBaseClient } from "@providers/elasticsearch/ESBase";
import { patientESIndex } from "@providers/elasticsearch/patientIndex/ESPatientIndex";
import { divisionCodes, districtCodes, upazilaCodes } from "@utils/constantsInMemory";
import { ValidateDateAndDivisionResponseInterface } from "@utils/interfaces/DataModels/ApiRequestQueryParamInterfaces";
import { validateFormData } from "@utils/models/Validation";
import { cacheHeaderes, noCacheHeaderes, sendErrorMsg } from "@utils/responseHandlers/responseHandler";
import { NextRequest, NextResponse } from "next/server";
import "server-only";

// In-memory cache for storing results with timestamps (cache expires after 5 minutes)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = getRevalidationTime(true) * 1000; // Cache expiry time in milliseconds

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { valid, errors, results }: ValidateDateAndDivisionResponseInterface =
    await validateFormData(req, false, false, "Get Upazila Wise Stats");
  if (!valid || !results) {
    return sendErrorMsg(String(errors));
  }

  // Format to YYYY-MM-DD
  const dateFrom = new Date(results.dateFrom);
  const dateTo = new Date(results.dateTo);
  const dateFromStr = dateFrom.toISOString().split('T')[0];
  const dateToStr = dateTo.toISOString().split('T')[0];
  const dateNow = Date.now();
  
  const cacheKey = `${dateFromStr}_${dateToStr}`;

  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && dateNow - cached.timestamp < CACHE_TTL) {
    console.log("Cache hit for Upazila registration stats:", cacheKey);
    return NextResponse.json(cached.data, {
      status: 200,
      headers: process.env.NODE_ENV === "development" ? noCacheHeaderes : cacheHeaderes,
    });
  }

  try {
    const stats = await getUpazilaRegistrationStats(results.dateFrom, results.dateTo);
    cache.set(cacheKey, { data: stats, timestamp: dateNow });
    return NextResponse.json(stats, {
      status: 200,
      headers: process.env.NODE_ENV === "development" ? noCacheHeaderes : cacheHeaderes,
    });
  } catch (error) {
    console.error("Error in get-upazilawise-registration-stats:", error);
    return NextResponse.json({ error: "Failed to fetch upazilawise stats" }, { status: 500 });
  }
}

async function getUpazilaRegistrationStats(minDate: string, maxDate: string) {
  // Single composite aggregation to group by division, district, and upazila
  const queryBody = {
    size: 0,
    query: {
      bool: {
        filter: [
          {
            range: {
              created_at: {
                gte: minDate,
                lte: maxDate,
              },
            },
          },
        ],
      },
    },
    aggs: {
      by_location: {
        composite: {
          size: 5000,
          sources: [
            { division: { terms: { field: "division_id" } } },
            { district: { terms: { field: "district_id" } } },
            { upazila: { terms: { field: "upazila_id" } } }
          ]
        }
      }
    }
  };

  const response: any = await esBaseClient.search({
    index: patientESIndex,
    body: queryBody,
  });

  const buckets = response.body?.aggregations?.by_location?.buckets || [];
  
  // Group results by district
  const districtMap: { [districtName: string]: any } = {};

  for (const bucket of buckets) {
    const { division, district, upazila } = bucket.key;
    const count = bucket.doc_count;

    if (!division || !district || !upazila) continue;

    // Build the keys
    const divisionStr = String(division).padStart(2, '0');
    const districtStr = divisionStr + String(district).padStart(2, '0');
    const upazilaStr = districtStr + String(upazila).padStart(2, '0');

    // Retrieve names from maps
    const divisionName = divisionCodes[divisionStr] || `Division ${division}`;
    const districtName = districtCodes[districtStr] || `District ${district}`;
    const upazilaName = upazilaCodes[upazilaStr] || `Upazila ${upazila}`;

    if (!districtMap[districtName]) {
      districtMap[districtName] = {
        districtName,
        districtCode: districtStr,
        divisionName,
        totalCount: 0,
        upazilas: []
      };
    }

    districtMap[districtName].totalCount += count;
    districtMap[districtName].upazilas.push({
      upazilaCode: upazilaStr,
      upazilaName,
      count
    });
  }

  // Convert map to array and sort by districtName
  const districtList = Object.values(districtMap).sort((a: any, b: any) =>
    a.districtName.localeCompare(b.districtName)
  );

  // Also sort upazilas within each district by count descending
  for (const dist of districtList) {
    dist.upazilas.sort((a: any, b: any) => b.count - a.count);
  }

  return districtList;
}
