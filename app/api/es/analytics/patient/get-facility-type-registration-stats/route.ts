import { healthRecordESIndexName } from "@api/providers/elasticsearch/constants";
import { esBaseClient } from "@providers/elasticsearch/ESBase";
import { getFacilitySolutionTypeFromName, isAaloClinic } from "@utils/constants";
import fetchAndCacheFacilityInfo from "@utils/providers/fetchAndCacheFacilityInfo";
import { getResponseHeaders } from "@utils/utilityFunctions";
import { NextResponse } from "next/server";
import "server-only";

// export const dynamic = "force-dynamic";
export const revalidate = process.env.NODE_ENV === "development" ? 0 : 7200;
export const fetchCache = "auto";
export const dynamicParams = false;

export interface RegistrationStatsProps {
  totalRegistration: number;
  openMRSFacilityCount: number;
  openSRPFacilityCount: number;
  aaloClincFacilityCount: number;
  eMISFacilityCount: number;
  message?: string;
}
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

  let openMRSFacilityCount = 0;
  let openSRPFacilityCount = 0;
  let aaloClinicFacilityCount = 0;
  let eMISFacilityCount = 0;

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
          openSRPFacilityCount += item.doc_count ?? 0;
          break;
        case "openMRS+":
          openMRSFacilityCount += item.doc_count ?? 0;
          break;
        default:
          console.log("Facility Type not found");
          console.log(item);
          eMISFacilityCount += item.doc_count ?? 0;
      }
    }
  }));

  return {
    totalRegistration: await totalRegistrationCount(),
    openMRSFacilityCount: openMRSFacilityCount,
    openSRPFacilityCount: openSRPFacilityCount,
    aaloClincFacilityCount:aaloClinicFacilityCount,
    eMISFacilityCount: eMISFacilityCount,
  };
}
