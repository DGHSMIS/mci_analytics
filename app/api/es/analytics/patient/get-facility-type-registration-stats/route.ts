import { getRevalidationTime } from "@library/utils";
import { healthRecordESIndexName } from "@providers/elasticsearch/constants";
import { esBaseClient } from "@providers/elasticsearch/ESBase";
import { FacilityTypeWiseStatsInterface } from "@utils/interfaces/Analytics/PublicDashboard/FacilityTypeWiseStatsInterface";
import fetchAndCacheFacilityInfo from "@utils/providers/fetchAndCacheFacilityInfo";
import { getFacilitySolutionTypeFromName, getResponseHeaders, isAaloClinic } from "@utils/utilityFunctions";
import { NextResponse } from "next/server";
import "server-only";

// export const dynamic = "force-dynamic";
export const revalidate = process.env.NODE_ENV === "development" ? 0 : getRevalidationTime(true);
export const fetchCache = "auto";
export const dynamicParams = false;


/**
 * Reindex All Data from Cassandra to Elasticsearch
 * @param req
 * @param res
 * @returns
 */
export async function GET(req: Request) {
  // console.log(isNotVerifiedResponse);
  const results = await getTotalRegistrationStats();

  return NextResponse.json(results, {
      status: 200,
      headers: getResponseHeaders(600, true, "*", "GET, OPTIONS", "Content-Type")
    },
  );
}

// Get the total number of documents in the index
// Assuming esBaseClient and other necessary imports and functions are defined
async function getTotalRegistrationStats() {
  const totalRegistrationCount = async() => await esBaseClient.count({
    index: healthRecordESIndexName,
  }).then(res => res.body.count).catch(err => 0);

  
  
  // Use a more reasonable size, or consider using a composite aggregation for very large sets
  const facilityCountQuery = {
    aggs: {
      created_facility_id_counts: {
        terms: {
          field: "created_facility_id",
          size: 10000, // Adjust based on expected unique facility count
        },
      },
    },
  };

  const facilityCount = await esBaseClient.search({
    index: healthRecordESIndexName,
    body: facilityCountQuery,
  });

  let openMRSCount = 0;
  let openSRPCount = 0;
  let aaloClinicFacilityCount = 0;
  let eMISCount = 0;

  const buckets = facilityCount.body.aggregations.created_facility_id_counts.buckets;

  // Process each bucket asynchronously and wait for all to complete
  await Promise.all(buckets.map(async (item:any) => {
    const res = await fetchAndCacheFacilityInfo(item.key);
    const facilityType = getFacilitySolutionTypeFromName(res.name ?? String(item.key));
    if (isAaloClinic(item.key)) {
      console.log("Alo Clinic!");
      console.log(item.key);
      aaloClinicFacilityCount += item.doc_count ?? 0;
      console.log(item);
      console.log(aaloClinicFacilityCount);
    } else {
      switch (facilityType) {
        case "openSRP":
          openSRPCount += item.doc_count ?? 0;
          break;
        case "openMRS+":
          openMRSCount += item.doc_count ?? 0;
          break;
        case "vaxEPI":
          // For vaxEPI, we are adding the count to eMISCount as per the original logic
          eMISCount += item.doc_count ?? 0;
          break;
        default:
          console.log("Facility Type not found");
          console.log(item);
          eMISCount += item.doc_count ?? 0;
      }
    }
  }));

  const results: FacilityTypeWiseStatsInterface = {
    totalCount: await totalRegistrationCount(),
    openMRSCount: openMRSCount,
    openSRPCount: openSRPCount,
    aaloClincCount:aaloClinicFacilityCount,
    eMISCount: eMISCount,
  };
  return results;
}
