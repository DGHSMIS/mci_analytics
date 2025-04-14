// app/api/es/administer/nid_proxy/aggregated-count/route.ts
import { NextRequest, NextResponse } from "next/server";
import { esBaseClient } from "@providers/elasticsearch/ESBase";
import { nidProxyIndexName } from "@api/providers/elasticsearch/constants";
import { sendErrorMsg } from "@utils/responseHandlers/responseHandler";

const indexName = nidProxyIndexName;

// ISO date pattern: 4‑digit year, 2‑digit month, 2‑digit day
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const hasStart = url.searchParams.has("startdate");
  const hasEnd   = url.searchParams.has("enddate");

  // 1) If exactly one of startdate/enddate is provided → invalid
  if (hasStart !== hasEnd) {
    return sendErrorMsg(
      "Invalid date range: both startdate and enddate must be provided together."
    );
  }

  // 2) If both are provided, enforce strict YYYY-MM-DD format
  let startDate: string;
  let endDate: string;
  if (hasStart && hasEnd) {
    const s = url.searchParams.get("startdate")!;
    const e = url.searchParams.get("enddate")!;

    if (!ISO_DATE_REGEX.test(s) || !ISO_DATE_REGEX.test(e)) {
      return sendErrorMsg(
        "Invalid date format: expected YYYY-MM-DD for both startdate and enddate."
      );
    }

    startDate = s;
    endDate   = e;
  } else {
    // Neither provided → default to last 7 days
    const today = new Date();
    endDate = today.toISOString().split("T")[0];
    startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
  }

  // Build ES query
  const body = {
    size: 0,
    query: {
      bool: {
        filter: [
          {
            range: {
              generated_at: { gte: startDate, lte: endDate }
            }
          }
        ]
      }
    },
    aggs: {
      by_doc_type: {
        filters: {
          filters: {
            nid: { term: { request_doc_type: "NID" } },
            brn: { term: { request_doc_type: "BRN" } }
          }
        }
      }
    }
  };

  try {
    const resp = await esBaseClient.search({
      index: indexName,
      body
    });

    const buckets = resp.body.aggregations.by_doc_type.buckets;
    const result = {
      nid: buckets.nid.doc_count,
      brn: buckets.brn.doc_count
    };

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("ES query failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch aggregated counts" },
      { status: 500 }
    );
  }
}
