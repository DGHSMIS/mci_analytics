import { cassandraClient } from "@providers/cassandra/cassandra";
import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { checkIfMCIAdminOrApprover } from "utils/lib/auth";
import { dateToUuidv1, xMinutesAgo } from "utils/utilityFunctions";

export const dynamic = "force-dynamic";
export const revalidate = true;
export const fetchCache = "force-no-store";
export const dynamicParams = true;

const uuid = require("uuid");
const uuidv1 = require("uuid").v1;
/**
 * Check Cassandra Audit Log Tracker to find out new changes
 * @param req
 * @returns
 */
export async function GET(req: NextRequest) {
  //Check Authorization & respond error if not verified
  const isNotVerifiedResponse = await checkIfMCIAdminOrApprover(req);
  if (isNotVerifiedResponse) {
    return isNotVerifiedResponse;
  }

  console.log(dateToUuidv1(xMinutesAgo(60)));
  const query = `SELECT * FROM mci.patient_audit_log WHERE event_id > ${dateToUuidv1(
    xMinutesAgo(180)
  )} ALLOW FILTERING;`;

  console.log(query);
  const results = await cassandraClient.execute(query, [], { prepare: true });
  console.log(results.rows.length);
  const data: any = results.rows.map((row: any) => {
    return row.health_id;
  });
  // console.log(data)

  return NextResponse.json(
    { data: data },
    {
      status: 200,
      headers: {
        "content-type": "application/json",
        "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
      },
    }
  );
}
