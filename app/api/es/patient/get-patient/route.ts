// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { esBaseClient } from "@providers/elasticsearch/ESBase";
import { patientESIndex } from "@providers/elasticsearch/patientIndex/ESPatientIndex";
import { retrieveMinioImageAsBase64 } from "@providers/minio/MinioBase";
import { checkIfMCIAdminOrApprover } from "@utils/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { ESPatientInterface } from '../../../providers/elasticsearch/patientIndex/interfaces/ESPatientInterface';

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
  console.log("Get Latest Data for the patient is ");
  console.log(req.headers);
  //Check Authorization & respond error if not verified
  const isNotVerifiedResponse = await checkIfMCIAdminOrApprover(req);
  console.log(isNotVerifiedResponse);
  if (isNotVerifiedResponse !== null) {
    return isNotVerifiedResponse;
  }
  const params: any = req.nextUrl.searchParams;
  console.log("New request to get patient by id");
  console.log(params);
  let hid = "";
  params.forEach((key: any, value: any) => {
    console.log(value);
    if (value == "hid") {
      hid = key;
    }
  });
  console.log(hid);
  try {
    if (!hid) {
      //NextResponse with status 400
      return NextResponse.json(
        { error: "Invalid health id" },
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
      // sort: [{ created_at: { order: "desc" } }],
      query: {
        bool: {
          must: [{ term: { health_id: hid } }],
        },
      },
    };

    const { body } = await esBaseClient.search({
      index: patientESIndex,
      body: query,
    });
    console.log(body.hits?.hits[0]);
    if (body.hits?.hits[0]) {
      if (body.hits?.hits[0]._source) {
        const results: ESPatientInterface = body.hits?.hits[0]._source;
        
        
        const img = results.national_id ? await retrieveMinioImageAsBase64("nid-image-store", String(results.national_id)) : null;
        results.user_photo =  img ? `data:image/png;base64,${img}` : null;
        console.log("The ES Results are --");
        console.log(results);
        return NextResponse.json(results, {
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
