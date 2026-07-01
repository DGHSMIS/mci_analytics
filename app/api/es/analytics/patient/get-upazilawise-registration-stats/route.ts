import { getRevalidationTime } from "@library/utils";
import { esBaseClient } from "@providers/elasticsearch/ESBase";
import { patientESIndex } from "@providers/elasticsearch/patientIndex/ESPatientIndex";
import { divisionCodes, districtCodes, upazilaCodes } from "@utils/constantsInMemory";
import { cacheHeaderes, noCacheHeaderes, sendErrorMsg } from "@utils/responseHandlers/responseHandler";
import { NextRequest, NextResponse } from "next/server";
import "server-only";

// In-memory cache for storing results with timestamps (cache expires after 5 minutes)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = getRevalidationTime(true) * 1000; // Cache expiry time in milliseconds

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const filterType = params.get("filterType") || "all_time";
    const selectedMonth = params.get("month");
    const selectedYear = params.get("year");

    const rangeResult = getRangeFromFilter(filterType, selectedMonth, selectedYear);
    if (!rangeResult.isValid) {
      return sendErrorMsg(rangeResult.error || "Invalid request filter");
    }

    const { minDate, maxDate } = rangeResult;
    const dateNow = Date.now();
    const cacheKey = `${filterType}_${minDate || "all"}_${maxDate || "all"}`;

    // Check cache
    const cached = cache.get(cacheKey);
    if (cached && dateNow - cached.timestamp < CACHE_TTL) {
      console.log("Cache hit for Upazila & Union stats:", cacheKey);
      return NextResponse.json(cached.data, {
        status: 200,
        headers: process.env.NODE_ENV === "development" ? noCacheHeaderes : cacheHeaderes,
      });
    }

    const stats = await getUpazilaRegistrationStats(minDate, maxDate);
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

function getRangeFromFilter(
  filterType: string,
  selectedMonth?: string | null,
  selectedYear?: string | null
): { minDate?: string; maxDate?: string; isValid: boolean; error?: string } {
  let minDate: Date;
  let maxDate: Date;

  const now = new Date();

  switch (filterType) {
    case "last_7_days": {
      minDate = new Date();
      minDate.setDate(now.getDate() - 6);
      minDate.setHours(0, 0, 0, 0);

      maxDate = new Date();
      maxDate.setHours(23, 59, 59, 999);
      break;
    }
    case "last_month": {
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      minDate = new Date(currentYear, currentMonth - 1, 1, 0, 0, 0, 0);
      maxDate = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);
      break;
    }
    case "by_month": {
      if (!selectedMonth || !selectedYear) {
        return { isValid: false, error: "Both 'month' and 'year' are required for monthly filter." };
      }
      const m = parseInt(selectedMonth, 10);
      const y = parseInt(selectedYear, 10);
      if (isNaN(m) || m < 1 || m > 12 || isNaN(y)) {
        return { isValid: false, error: "Invalid 'month' or 'year' values." };
      }
      minDate = new Date(y, m - 1, 1, 0, 0, 0, 0);
      maxDate = new Date(y, m, 0, 23, 59, 59, 999);
      break;
    }
    case "by_year": {
      if (!selectedYear) {
        return { isValid: false, error: "'year' is required for yearly filter." };
      }
      const y = parseInt(selectedYear, 10);
      if (isNaN(y)) {
        return { isValid: false, error: "Invalid 'year' value." };
      }
      minDate = new Date(y, 0, 1, 0, 0, 0, 0);
      maxDate = new Date(y, 11, 31, 23, 59, 59, 999);
      break;
    }
    case "all_time":
      return { isValid: true };
    default:
      return { isValid: false, error: `Invalid filterType: ${filterType}` };
  }

  return {
    isValid: true,
    minDate: minDate.toISOString(),
    maxDate: maxDate.toISOString(),
  };
}

async function getUpazilaRegistrationStats(minDate?: string, maxDate?: string) {
  // Build range filter if dates are specified
  const filters: any[] = [];
  if (minDate && maxDate) {
    filters.push({
      range: {
        created_at: {
          gte: minDate,
          lte: maxDate,
        },
      },
    });
  }

  // Composite aggregation to group by division, district, upazila, and union (with missing_bucket: true)
  const queryBody = {
    size: 0,
    query: filters.length > 0 ? {
      bool: {
        filter: filters,
      },
    } : {
      match_all: {},
    },
    aggs: {
      by_location: {
        composite: {
          size: 5000,
          sources: [
            { division: { terms: { field: "division_id", missing_bucket: true } } },
            { district: { terms: { field: "district_id", missing_bucket: true } } },
            { upazila: { terms: { field: "upazila_id", missing_bucket: true } } },
            { union: { terms: { field: "union_or_urban_ward_id", missing_bucket: true } } }
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
    const { division, district, upazila, union } = bucket.key;
    const count = bucket.doc_count;

    const divisionStr = division !== null && division !== undefined ? String(division).padStart(2, '0') : "00";
    const districtPart = district !== null && district !== undefined ? String(district).padStart(2, '0') : "00";
    const upazilaPart = upazila !== null && upazila !== undefined ? String(upazila).padStart(2, '0') : "00";
    const unionPart = union !== null && union !== undefined ? String(union).padStart(2, '0') : "00";

    const districtStr = divisionStr + districtPart;
    const upazilaStr = districtStr + upazilaPart;
    const unionStr = upazilaStr + unionPart;

    const divisionName = divisionCodes[divisionStr] || (division !== null && division !== undefined ? `Division ${division}` : "Unspecified Division");
    const districtName = districtCodes[districtStr] || (district !== null && district !== undefined ? `District ${district}` : "Unspecified District");
    const upazilaName = upazilaCodes[upazilaStr] || (upazila !== null && upazila !== undefined ? `Upazila ${upazila}` : "Unspecified Upazila");
    const unionName = union !== null && union !== undefined ? `Union ${unionPart}` : "Unspecified Union";

    // Initialize District
    if (!districtMap[districtName]) {
      districtMap[districtName] = {
        districtName,
        districtCode: districtStr,
        divisionName,
        totalCount: 0,
        upazilasMap: {}
      };
    }

    districtMap[districtName].totalCount += count;

    // Initialize Upazila within District
    if (!districtMap[districtName].upazilasMap[upazilaName]) {
      districtMap[districtName].upazilasMap[upazilaName] = {
        upazilaName,
        upazilaCode: upazilaStr,
        count: 0,
        unionsMap: {}
      };
    }

    districtMap[districtName].upazilasMap[upazilaName].count += count;

    // Add Union details
    if (!districtMap[districtName].upazilasMap[upazilaName].unionsMap[unionName]) {
      districtMap[districtName].upazilasMap[upazilaName].unionsMap[unionName] = {
        unionCode: unionStr,
        unionName,
        count: 0
      };
    }

    districtMap[districtName].upazilasMap[upazilaName].unionsMap[unionName].count += count;
  }

  // Convert maps to arrays and sort
  const districtList = Object.values(districtMap).map((dist: any) => {
    const upazilas = Object.values(dist.upazilasMap).map((upaz: any) => {
      const unions = Object.values(upaz.unionsMap).sort((a: any, b: any) => b.count - a.count);
      return {
        upazilaName: upaz.upazilaName,
        upazilaCode: upaz.upazilaCode,
        count: upaz.count,
        unions
      };
    }).sort((a: any, b: any) => b.count - a.count);

    return {
      districtName: dist.districtName,
      districtCode: dist.districtCode,
      divisionName: dist.divisionName,
      totalCount: dist.totalCount,
      upazilas
    };
  }).sort((a: any, b: any) => a.districtName.localeCompare(b.districtName));

  return districtList;
}
