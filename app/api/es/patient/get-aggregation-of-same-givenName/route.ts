// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { esBaseClient } from "@providers/elasticsearch/ESBase";
import { patientESIndex } from "@providers/elasticsearch/patientIndex/ESPatientIndex";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
const { REVALIDATE_VAR } = process.env;
export const revalidate = REVALIDATE_VAR ?? 600;
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
  console.log("Get Aggregated Name");
  //Check Authorization & respond error if not verified
  // const isNotVerifiedResponse = await checkIfMCIAdminOrApprover(req);
  // console.log(isNotVerifiedResponse);
  // if (isNotVerifiedResponse) {
  //   return isNotVerifiedResponse;
  // }
  const params: any = req.nextUrl.searchParams;
  console.log("New request to get patient by id");
  console.log(params);
  let givenName = "";
  params.forEach((value: any, key: any) => {
    console.log(value);
    if (key == "givenName") {
      givenName = value;
    }
  });
  console.log(givenName);
  try {
    if (!givenName) {
      //NextResponse with status 400
      return NextResponse.json(
        { error: "Invalid Input. Please provide givenName" },
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
      query: {
        bool: {
          must: [
            { term: { "given_name.keyword": givenName } }
          ]
        }
      },
      aggs: {
        total_count: {
          value_count: {
            field: "given_name.keyword"
          }
        }
      }
    };

    const { body } = await esBaseClient.search({
      index: patientESIndex,
      size: 0,
      body: query,
    });

    return NextResponse.json(body.aggregations);
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
