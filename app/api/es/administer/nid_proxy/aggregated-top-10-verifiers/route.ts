// app/api/es/administer/nid_proxy/top_clients_by_time_segments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { esBaseClient } from "@providers/elasticsearch/ESBase";
import { nidProxyIndexName } from "@api/providers/elasticsearch/constants";
import { sendErrorMsg } from "@utils/responseHandlers/responseHandler";
import type { Serie } from "@nivo/line";

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const SEGMENT_COUNT = 5;
const TOP_CLIENTS_LIMIT = 10;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MIN_RANGE_MS = SEGMENT_COUNT * MS_PER_DAY;
const ALLOWED_DOC_TYPES = ["NID", "BRN"] as const;
type DocType = typeof ALLOWED_DOC_TYPES[number];

function getDefaultRange() {
  const today = new Date();
  const end = today.toISOString().split("T")[0];
  const start = new Date(today.getTime() - MIN_RANGE_MS)
    .toISOString()
    .split("T")[0];
  return { start, end };
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl;

  // —— 1) Parse & validate doc_type
  const rawDocType = (url.searchParams.get("doc_type") ?? "NID").toUpperCase();
  if (!ALLOWED_DOC_TYPES.includes(rawDocType as DocType)) {
    return sendErrorMsg(`Invalid doc_type: must be one of ${ALLOWED_DOC_TYPES.join(", ")}.`);
  }
  const docType = rawDocType as DocType;

  const hasStart = url.searchParams.has("startdate");
  const hasEnd   = url.searchParams.has("enddate");

  // —— 2) require both dates or neither
  if (hasStart !== hasEnd) {
    return sendErrorMsg(
      "Both startdate and enddate must be provided together, or omitted for default."
    );
  }

  // —— 3) compute actual range
  let startStr: string, endStr: string;
  if (!hasStart) {
    // default last 5 days
    ({ start: startStr, end: endStr } = getDefaultRange());
  } else {
    const s = url.searchParams.get("startdate")!;
    const e = url.searchParams.get("enddate")!;
    if (!ISO_DATE_REGEX.test(s) || !ISO_DATE_REGEX.test(e)) {
      return sendErrorMsg("Invalid date format: expected YYYY‑MM‑DD.");
    }
    const startDate = new Date(s);
    const endDate   = new Date(e);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return sendErrorMsg("Invalid date values provided.");
    }
    const span = endDate.getTime() - startDate.getTime();
    if (span < MIN_RANGE_MS) {
      // too short → default
      ({ start: startStr, end: endStr } = getDefaultRange());
    } else {
      startStr = s;
      endStr   = e;
    }
  }

  // —— 4) build 5 equal segments
  const startMs     = new Date(startStr).getTime();
  const endMs       = new Date(endStr).getTime();
  const segmentMs   = (endMs - startMs) / SEGMENT_COUNT;
  const ranges = Array.from({ length: SEGMENT_COUNT }, (_, i) => ({
    key: `segment_${i + 1}`,
    from: new Date(startMs + i * segmentMs).toISOString(),
    to:   new Date(startMs + (i + 1) * segmentMs).toISOString(),
  }));

  // —— 5) Elasticsearch query with doc_type filter
  const body = {
    size: 0,
    query: {
      bool: {
        filter: [
          { term: { request_doc_type: docType } },
          { range: { generated_at: { gte: startStr, lte: endStr } } }
        ]
      }
    },
    aggs: {
      segments: {
        date_range: {
          field:  "generated_at",
          ranges: ranges
        },
        aggs: {
          top_clients: {
            terms: {
              field: "client_id",
              size:  TOP_CLIENTS_LIMIT,
              order: { _count: "desc" }
            }
          }
        }
      }
    }
  };

  try {
    const resp = await esBaseClient.search({
      index: nidProxyIndexName,
      body
    });
    const buckets = resp.body.aggregations.segments.buckets as any[];

    // —— 6) reshape into Nivo series
    const clientSet = new Set<string>();
    const segmentData = ranges.map((r, idx) => {
      const bucket = buckets[idx];
      const top = bucket.top_clients.buckets.map((c: any) => {
        const idStr = String(c.key);
        clientSet.add(idStr);
        return { client_id: idStr, count: c.doc_count };
      });
      return { fromDate: r.from.split("T")[0], top };
    });

    const series: Serie[] = Array.from(clientSet).map(client_id => ({
      id: client_id,
      data: segmentData.map(seg => {
        const hit = seg.top.find((t:any) => t.client_id === client_id);
        return { x: seg.fromDate, y: hit ? hit.count : 0 };
      })
    }));

    return NextResponse.json(series);
  } catch (err: any) {
    console.error("ES query failed:", err.meta?.body?.error || err);
    return NextResponse.json(
      { error: "Failed to fetch top clients by time segment" },
      { status: 500 }
    );
  }
}
