import { PlatformStatsSyncService } from "@utils/services/PlatformStatsSyncService";
import { getResponseHeaders } from "@utils/utilityFunctions";
import { NextRequest, NextResponse } from "next/server";
import "server-only";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const dynamicParams = true;

/**
 * Sync platform statistics (Government Outdoor Dispensary, eAppointment, etc.)
 * Fetches latest numbers from remote endpoints and stores them into Elasticsearch.
 * Can be called manually or scheduled via cron (e.g. daily).
 */
export async function GET(req: NextRequest) {
  try {
    const stats = await PlatformStatsSyncService.syncStats();
    return NextResponse.json(
      {
        success: true,
        message: "Platform stats synchronized successfully and saved to Elasticsearch",
        data: stats,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: getResponseHeaders(0, true, "*", "GET, POST, OPTIONS", "Content-Type"),
      }
    );
  } catch (error) {
    console.error("[SyncPlatformStats API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to sync platform stats",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: getResponseHeaders(0, true, "*", "GET, POST, OPTIONS", "Content-Type"),
      }
    );
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
