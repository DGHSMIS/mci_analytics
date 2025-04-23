// app/api/es/administer/nid_proxy/top_nid_verifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { esBaseClient } from "@providers/elasticsearch/ESBase";
import { nidProxyIndexName } from "@api/providers/elasticsearch/constants";
import { sendErrorMsg } from "@utils/responseHandlers/responseHandler";

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 1000;
const ALLOWED_DOC_TYPES = ["NID", "BRN"] as const;
type DocType = typeof ALLOWED_DOC_TYPES[number];

export async function GET(req: NextRequest) {
  const url = req.nextUrl;

  // ——— 1) Date range validation ———
  const hasStart = url.searchParams.has("startdate");
  const hasEnd = url.searchParams.has("enddate");
  if (hasStart !== hasEnd) {
    return sendErrorMsg(
      "Invalid date range: both startdate and enddate must be provided together."
    );
  }

  // ——— 2) Parse & validate dates (or default last 7 days) ———
  let startDate: string, endDate: string;
  if (hasStart && hasEnd) {
    const s = url.searchParams.get("startdate")!;
    const e = url.searchParams.get("enddate")!;
    if (!ISO_DATE_REGEX.test(s) || !ISO_DATE_REGEX.test(e)) {
      return sendErrorMsg(
        "Invalid date format: expected YYYY-MM-DD for both startdate and enddate."
      );
    }
    startDate = s;
    endDate = e;
  } else {
    const today = new Date();
    endDate = today.toISOString().split("T")[0];
    startDate = new Date(
      today.getTime() - 7 * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0];
  }

  // ——— 3) Parse & validate limit ———
  const rawLimit = url.searchParams.get("limit");
  let limit = DEFAULT_LIMIT;
  if (rawLimit !== null) {
    const parsed = Number(rawLimit);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > MAX_LIMIT) {
      return sendErrorMsg(
        `Invalid limit: must be an integer between 1 and ${MAX_LIMIT}.`
      );
    }
    limit = parsed;
  }

  // ——— 4) Parse & validate doc_type ———
  const rawDocType = url.searchParams.get("doc_type") ?? "NID";
  const docType = rawDocType.toUpperCase();
  if (!ALLOWED_DOC_TYPES.includes(docType as DocType)) {
    return sendErrorMsg(
      `Invalid doc_type: must be one of ${ALLOWED_DOC_TYPES.join(", ")}.`
    );
  }

  // ——— 5) Build ES query with dynamic doc_type + top_hits for client_name ———
  const body = {
    size: 0,
    query: {
      bool: {
        filter: [
          { term: { request_doc_type: docType } },
          { range: { generated_at: { gte: startDate, lte: endDate } } }
        ]
      }
    },
    aggs: {
      top_clients: {
        terms: {
          field: "client_id",
          size: limit,
          order: { _count: "desc" }
        },
        aggs: {
          client_meta: {
            top_hits: {
              size: 1,
              _source: ["client_name"]
            }
          }
        }
      }
    }
  };

  // ——— 6) Execute & return enriched response ———
  try {
    const resp = await esBaseClient.search({
      index: nidProxyIndexName,
      body
    });

    const buckets = resp.body.aggregations.top_clients.buckets;

    const result = buckets.map((b: any) => {
      const rawId = b.key as string;
      const client_id = /^\d+$/.test(rawId) ? Number(rawId) : rawId;
      const hit = b.client_meta.hits.hits[0];
      const client_name = hit && hit._source?.client_name
        ? hit._source.client_name
        : String(client_id);
      return { client_id, count: b.doc_count, client_name };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("ES query failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch top verification counts" },
      { status: 500 }
    );
  }
}
