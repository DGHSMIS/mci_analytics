// app/api/es/administer/nid_proxy/client/[clientId]/verification-trends/route.ts
import { NextRequest, NextResponse } from "next/server";
import { esBaseClient } from "@providers/elasticsearch/ESBase";
import { nidProxyIndexName } from "@api/providers/elasticsearch/constants";
import { sendErrorMsg } from "@utils/responseHandlers/responseHandler";
import type { Serie } from "@nivo/line";

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(
  req: NextRequest,
  { params }: { params: { clientId: string } }
) {
  const { clientId } = params;
  if (!clientId) {
    return sendErrorMsg("clientId is required in the path.");
  }

  const url = req.nextUrl;
  const hasStart = url.searchParams.has("startdate");
  const hasEnd   = url.searchParams.has("enddate");

  // 1) both or neither
  if (hasStart !== hasEnd) {
    return sendErrorMsg(
      "Both startdate and enddate must be provided together, or omitted to default to last 7 days."
    );
  }

  // 2) determine range
  let startDate: string;
  let endDate:   string;
  if (!hasStart) {
    const today = new Date();
    endDate = today.toISOString().split("T")[0];
    startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
  } else {
    const s = url.searchParams.get("startdate")!;
    const e = url.searchParams.get("enddate")!;

    // validate format
    if (!ISO_DATE_REGEX.test(s) || !ISO_DATE_REGEX.test(e)) {
      return sendErrorMsg("Invalid date format: expected YYYY-MM-DD.");
    }
    // validate values
    const sd = new Date(s);
    const ed = new Date(e);
    if (isNaN(sd.getTime()) || isNaN(ed.getTime())) {
      return sendErrorMsg("Invalid date values provided.");
    }

    startDate = s;
    endDate   = e;
  }

  // 3) Elasticsearch query: daily histogram w/ NID & BRN filters
  const body = {
    size: 0,
    query: {
      bool: {
        filter: [
          { term:  { client_id: clientId } },
          { range: { generated_at: { gte: startDate, lte: endDate } } }
        ]
      }
    },
    aggs: {
      per_day: {
        date_histogram: {
          field:             "generated_at",
          calendar_interval: "day",
          format:            "yyyy-MM-dd",
          min_doc_count:     0,
          extended_bounds:   { min: startDate, max: endDate }
        },
        aggs: {
          nid: { filter: { term: { request_doc_type: "NID" } } },
          brn: { filter: { term: { request_doc_type: "BRN" } } }
        }
      }
    }
  };

  try {
    const resp = await esBaseClient.search({
      index: nidProxyIndexName,
      body
    });

    const buckets = resp.body.aggregations.per_day.buckets as any[];

    // 4) shape into two Nivo series
    const nidSeries: Serie = {
      id: "NID",
      data: buckets.map(b => ({ x: b.key_as_string, y: b.nid.doc_count }))
    };
    const brnSeries: Serie = {
      id: "BRN",
      data: buckets.map(b => ({ x: b.key_as_string, y: b.brn.doc_count }))
    };

    return NextResponse.json([nidSeries, brnSeries]);
  } catch (err: any) {
    console.error("ES query failed:", err.meta?.body?.error || err);
    return NextResponse.json(
      { error: "Failed to fetch client verification trends" },
      { status: 500 }
    );
  }
}
