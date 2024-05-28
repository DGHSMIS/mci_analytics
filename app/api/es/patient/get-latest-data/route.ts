import { patientESIndex } from "@providers/elasticsearch/patientIndex/ESPatientIndex";
import { checkIfMCIAdminOrApprover } from "@utils/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { esBaseClient } from "../../../providers/elasticsearch/ESBase";

export const dynamic = "force-dynamic";
// export const revalidate = process.env.REVALIDATE_VAR;
// export const fetchCache = "auto";
export const dynamicParams = true;
export const revalidate = true;
export const fetchCache = "force-no-store";

/**
 * Reindex All Data from Cassandra to Elasticsearch
 * @param req
 * @param res
 * @returns
 */

export async function GET(req: NextRequest) {
  //get Request from NextRequest
  console.log("Get Latest Data");
  //Check Authorization & respond error if not verified
  const isValidUserRequest = await checkIfMCIAdminOrApprover(req);

  console.log("isValidUserRequest");
  console.log(isValidUserRequest);
  if (isValidUserRequest !== null) {
    return isValidUserRequest;
  }

  // console.log(req.nextUrl.searchParams);
  const searchParams: URLSearchParams = req.nextUrl.searchParams;
  const healthId = searchParams.get("healthId");
  const nationalId = searchParams.get("nationalId");
  const brnId = searchParams.get("brnId");
  const divisionId = searchParams.get("divisionId");
  const districtId = searchParams.get("districtId");
  const phoneNo = searchParams.get("phoneNo");
  const createdFacilityId = searchParams.get("createdFacilityId");
  const createdClientId = searchParams.get("createdClientId");

  if (
    !healthId &&
    !nationalId &&
    !brnId &&
    !divisionId &&
    !districtId &&
    !phoneNo &&
    !createdFacilityId &&
    !createdClientId
  ) {
    // console.log("HEre");
    const data = await getLatestDocuments();
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "content-type": "application/json",
        "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
      },
    });
  }
  // console.log(healthId, nationalId, brnId, divisionId, districtId, phoneNo);
  // if (nationalId) {
  //   return NextResponse.json([], {
  //     status: 200,
  //     headers: {
  //       "content-type": "application/json",
  //       "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
  //     },
  //   });
  // }
  if (divisionId) {
    if (isNaN(Number(divisionId))) {
      return NextResponse.json([], {
        status: 200,
        headers: {
          "content-type": "application/json",
          "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
        },
      });
    }
  }
  if (districtId) {
    if (isNaN(Number(districtId))) {
      return NextResponse.json([], {
        status: 200,
        headers: {
          "content-type": "application/json",
          "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
        },
      });
    }
  }
  console.log("Get Filtered Data");
  const data = await getFilteredData(
    healthId,
    nationalId,
    brnId,
    divisionId,
    districtId,
    phoneNo,
    createdFacilityId,
    createdClientId
  );
  console.log("data", data);
  return NextResponse.json(data, {
    status: 200,
    headers: {
      "content-type": "application/json",
      "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
    },
  });
}

async function getLatestDocuments() {
  const { body } = await esBaseClient.search({
    index: "cassandra_patients",
    body: {
      size: 200,
      sort: [{ updated_at: { order: "asc" } }],
    },
  });

  // Check if hits and _source object exists
  if (body.hits && body.hits.hits) {
    return body.hits.hits;
  } else {
    return [];
  }
}

async function getFilteredData(
  healthId?: any,
  nationalId?: any,
  brnId?: any,
  divisionId?: any,
  districtId?: any,
  phoneNo?: any,
  createdFacilityId?: any,
  createdClientId?: any,
) {
  const query: any = {
    size: 500,
    // sort: [{ created_at: { order: "desc" } }],
    query: {
      bool: {
        must: [],
      },
    },
  };

  console.log("Getting Filtered data");
  console.log(healthId);
  console.log(nationalId);
  console.log(brnId);
  console.log(divisionId);
  console.log(districtId);
  if (healthId) {
    query.query.bool.must.push({
      match_phrase_prefix: { health_id: String(healthId) },
    });
  }

  if (nationalId) {
    // console.log("second");
    query.query.bool.must.push({
      match_phrase_prefix: { national_id: String(nationalId) },
    });
  }

  if (brnId) {
    query.query.bool.must.push({
      match_phrase_prefix: { bin_brn: String(brnId) },
    });
  }

  if (divisionId) {
    query.query.bool.must.push({ term: { division_id: Number(divisionId) } });
  }

  if (districtId) {
    query.query.bool.must.push({ term: { district_id: Number(districtId) } });
  }
  if (phoneNo) {
    query.query.bool.must.push({ term: { phone_no: String(phoneNo) } });
  }

  if (createdFacilityId) {
    query.query.bool.must.push({ term: { created_facility_id: String(createdFacilityId) } });   
  }

  if (createdClientId) {
    query.query.bool.must.push({ term: { created_client_id: String(createdClientId) } });   
  }

  console.log("Latest Data query");
  console.log(query);
  // console.log(query);
  const { body } = await esBaseClient.search({
    index: patientESIndex,
    body: query,
  });

  // Filter out results where health_id and national_id don't match
  const filteredResults = body.hits?.hits || [];
  // console.log(filteredResults);
  return filteredResults || [];
}
