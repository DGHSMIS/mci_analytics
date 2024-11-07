// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { cassandraClient } from "@providers/cassandra/cassandra";
import { CASSANDRA_PAGE_SIZE } from "@providers/cassandra/constants";
import { NextRequest, NextResponse } from "next/server";


/**
 * Get Encounter List By Patient Id
 * @param req
 * @param res
 * @returns
 */
export async function GET(req: NextRequest) {
  //get Request from NextRequest
  console.log("Get Latest Data");
  // //Check Authorization & respond error if not verified
  // const isNotVerifiedResponse = await checkIfMCIAdminOrApprover(req);
  // console.log(isNotVerifiedResponse);
  // if (isNotVerifiedResponse) {
  //   return isNotVerifiedResponse;
  // }
  const params: any = req.nextUrl.searchParams;
  console.log("New request to get patient by id");
  console.log(params);
  let hid = "";
  let encounter_id = "";
  params.forEach((key: any, value: any) => {
    console.log(value);
    if (value == "hid") {
      hid = key;
    } else if (value == "encounterId") {
      encounter_id = key;
    }
  });
  console.log(hid);
  try {
    if (!hid || !encounter_id) {
      //NextResponse with status 400
      return NextResponse.json(
        { error: "Invalid Parameters sent" },
        {
          status: 400,
          headers: {
            "content-type": "application/json",
            "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
          },
        }
      );
    }
    //Get Encounters Ids from Patient ID
    const encounterDetailQuery: any = `SELECT * FROM freeshr.encounter where encounter_id='${encounter_id}'`;
    const queryOptions = { prepare: true, fetchSize: CASSANDRA_PAGE_SIZE };
    // console.log(encounterDetailQuery);

    const encounterResult: any = await cassandraClient.execute(
      `${encounterDetailQuery}`,
      [],
      queryOptions
    );
    //
    // console.log("Is there any encounters?");
    // console.log(result.rows.length);
    //Get All Encounters of the patient
    let bundle = "";
    if (encounterResult.rows.length > 0) {
      // console.log("Yes");
      // console.log("Encounter Result");
      // console.log(encounterResult.rows[0]);
      // console.log(encounterResult.rows[0].health_id);

      if (hid !== encounterResult.rows[0].health_id) {
        return NextResponse.json(
          { error: "Encounter was not found" },
          {
            status: 400,
            headers: {
              "content-type": "application/json",
              "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
            },
          }
        );
      }
      bundle = encounterResult.rows[0].content_v3;
    }
    return NextResponse.json(
      { results: bundle },
      {
        status: 200,
        headers: {
          "content-type": "application/json",
          "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
        },
      }
    );
  } catch (err) {
    console.log(err);
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
