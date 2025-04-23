// app/api/es/administer/nid_proxy/client/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { esBaseClient } from "@providers/elasticsearch/ESBase";
import { nidProxyIndexName } from "@api/providers/elasticsearch/constants";
import { sendErrorMsg } from "@utils/responseHandlers/responseHandler";
import fetchAndCacheClientInfo from "@utils/providers/fetchAndCacheClientInfo";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 1000;

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const clientId = params.id;
  const url = req.nextUrl;

  // Parse & validate limit
  const rawLimit = url.searchParams.get("limit");
  let limit = DEFAULT_LIMIT;
  if (rawLimit !== null) {
    const parsed = Number(rawLimit);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > MAX_LIMIT) {
      return sendErrorMsg(`Invalid limit: must be 1–${MAX_LIMIT}.`);
    }
    limit = parsed;
  }

  // Parse & validate start (offset)
  const rawStart = url.searchParams.get("start");
  let from = 0;
  if (rawStart !== null) {
    const parsed = Number(rawStart);
    if (!Number.isInteger(parsed) || parsed < 0) {
      return sendErrorMsg(`Invalid start: must be a non‑negative integer.`);
    }
    from = parsed;
  }

  // Build ES query with both size and from
  const body = {
    query: {
      bool: {
        filter: [{ term: { client_id: clientId } }]
      }
    },
    sort: [{ generated_at: { order: "desc" } }],
    size: limit,
    from,   // <-- this makes pagination work
  };

  try {
    const resp = await esBaseClient.search({
      index: nidProxyIndexName,
      body
    });

    const hits = resp.body.hits.hits;
    const docs = hits.map((h: any) => h._source);
    return NextResponse.json(docs, { status: 200 });
  } catch (err) {
    console.error("ES query failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch client documents" },
      { status: 500 }
    );
  }
}
