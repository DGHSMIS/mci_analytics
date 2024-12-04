// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getRevalidationTime } from "@library/utils";
import { esBaseClient } from "@providers/elasticsearch/ESBase";
import { patientESIndex } from "@providers/elasticsearch/patientIndex/ESPatientIndex";
import { checkIfMCIAdminOrApprover } from "@utils/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const revalidate = getRevalidationTime() ?? 600;
export const fetchCache = "auto";
export const dynamicParams = true;
// export const revalidate = true;
// export const fetchCache = "force-no-store";

/**
 * Get Patient by Health ID from Elasticsearch
 * @param req
 * @param res
 * @returns
 */
export async function GET(req: NextRequest) {
  //get Request from NextRequest
  console.log("Get Latest Data");
  //Check Authorization & respond error if not verified
  const isNotVerifiedResponse = await checkIfMCIAdminOrApprover(req);
  console.log(isNotVerifiedResponse);
  if (isNotVerifiedResponse) {
    return isNotVerifiedResponse;
  }
  const params: any = req.nextUrl.searchParams;
  console.log("New request to get patient by id");
  console.log(params);
  let hid = "";
  let dob ="";
  params.forEach((key: any, value: any) => {
    console.log(value);
    if (value == "hid") {
      hid = key;
    }
    else if(value == "dob") {
      dob = key;
    }
  });
  console.log(hid);
  try {
    if (!hid) {
      //NextResponse with status 400
      return NextResponse.json(
        { error: "Invalid National id" },
        {
          status: 400,
          headers: {
            "content-type": "application/json",
            "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
          },
        }
      );
    }
    const query: any = {
      size: 1,
      query: {
        bool: {
          must: [
            { term: { health_id: hid } },
            {
              range: {
                date_of_birth: {
                  gte: dob + "T00:00:00.000Z",
                  lte: dob + "T23:59:59.999Z"
                }
              }
            }
          ],
        },
      },
      _source: ["health_id"],  // Replace "health_id" with the actual field name if it's different
    };

    const { body } = await esBaseClient.search({
      index: patientESIndex,
      body: query,
    });
    console.log(body.hits?.hits[0]);
    if (body.hits?.hits[0]) {
      if (body.hits?.hits[0]._source) {
        return NextResponse.json(body.hits?.hits[0]._source, {
          status: 200,
          headers: {
            "content-type": "application/json",
            "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
          },
        });
      }
    }
    return NextResponse.json([]);
  } catch (err) {
    return NextResponse.json(
      { error: `Query failed. Error: ${err}` },
      {
        status: 500,
        headers: {
          "content-type": "application/json",
          "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
        },
      }
    );
  }
}
