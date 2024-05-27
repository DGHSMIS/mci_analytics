// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CASSANDRA_PAGE_SIZE } from "@api/providers/cassandra/constants";
import { cassandraClient } from "@providers/cassandra/cassandra";
import { EncounterListItem } from "@utils/interfaces/Encounter/Encounter";
import { FacilityInterface } from "@utils/interfaces/FacilityInterfaces";
import fetchAndCacheFacilityInfo from "@utils/providers/fetchAndCacheFacilityInfo";
import { selectDistrictFromCode, selectDivisionFromCode, selectUpazilaFromCode, timeUUIDToDate } from "@utils/utilityFunctions";
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
  // const isNotVerifiedResponse = await checkRequestHeaders(req);
  // console.log(isNotVerifiedResponse);
  // if (isNotVerifiedResponse) {
  //   return isNotVerifiedResponse;
  // }
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
    //Get Encounters Ids from Patient ID
    const query: any = `SELECT * FROM freeshr.enc_by_patient where health_id='${hid}'`;
    // console.log(query);
    const queryOptions = { prepare: true, fetchSize: CASSANDRA_PAGE_SIZE };

    const result: any = await cassandraClient.execute(
      `${query}`,
      [],
      queryOptions
    );
    //
    // console.log("Is there any encounters?");
    // console.log(result.rows.length);
    //Get All Encounters of the patient
    const resultsList: EncounterListItem[] = [];
    if (result.rows.length > 0) {
      // console.log("Yes");
      for (let i = 0; i < result.rows.length; i++) {
        const encounterQuery: any = `SELECT encounter_id, health_id, created_by, updated_at, patient_confidentiality, encounter_confidentiality FROM freeshr.encounter where encounter_id='${result.rows[i].encounter_id}'`;
        console.log(encounterQuery);

        const encounterResult: any = await cassandraClient.execute(
          `${encounterQuery}`,
          [],
          queryOptions
        );
        if (encounterResult.rows.length > 0) {
          const created_by = JSON.parse(encounterResult.rows[0].created_by);
          const created_facility_id = created_by.facilityId;
          const facilityInfo: FacilityInterface =
            await fetchAndCacheFacilityInfo(created_facility_id);
          const divisionName = facilityInfo.divisionCode
            ? selectDivisionFromCode(facilityInfo.divisionCode)
            : "";
          const districtName = facilityInfo.districtCode
            ? selectDistrictFromCode(
                (facilityInfo.divisionCode || "") + facilityInfo.districtCode
              )
            : "";
          const upazilaName = facilityInfo.upazilaCode
            ? selectUpazilaFromCode(
                (facilityInfo.divisionCode || "") +
                  (facilityInfo.districtCode || "") +
                  facilityInfo.upazilaCode
              )
            : "";
          const location: string = upazilaName + (districtName ? ", " + districtName : "") + (divisionName ? ", " + divisionName : "");
          const isEncounterConfidential: boolean = encounterResult.rows[0].encounter_confidentiality!="N";
          resultsList.push({
            id: encounterResult.rows[0].encounter_id,
            encounter_time: timeUUIDToDate(encounterResult.rows[0].updated_at),
            facility_id: String(created_facility_id),
            facility_name: facilityInfo.name ?? facilityInfo.address ?? "",
            facility_type: facilityInfo.orgType ?? "",
            facility_location: location,
            encounter_confidentiality: isEncounterConfidential,
          });
        }
      }
    }
    return NextResponse.json(resultsList, {
      status: 200,
      headers: {
        "content-type": "application/json",
        "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
      },
    });
  } catch (err) {
    // console.log(err);
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
