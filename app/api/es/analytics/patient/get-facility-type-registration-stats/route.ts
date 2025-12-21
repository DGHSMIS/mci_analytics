import { getRevalidationTime } from "@library/utils";
import { getResponseHeaders } from "@utils/utilityFunctions";
import { RegistrationStatsService } from "@utils/services/RegistrationStatsService";
import { NextResponse } from "next/server";
import "server-only";

// export const dynamic = "force-dynamic";
export const revalidate = process.env.NODE_ENV === "development" ? 0 : getRevalidationTime(true);
export const fetchCache = "auto";
export const dynamicParams = false;


/**
 * Get facility type registration statistics
 * @returns Registration statistics by facility type
 */
export async function GET() {
  try {
    const statsService = new RegistrationStatsService();
    const results = await statsService.getTotalRegistrationStats();

    // Return appropriate status code based on validation
    const statusCode = results.validationPassed ? 200 : 206; // 206 Partial Content if validation failed

    return NextResponse.json(results, {
        status: statusCode,
        headers: getResponseHeaders(600, true, "*", "GET, OPTIONS", "Content-Type")
      },
    );
  } catch (error) {
    console.error('[API] Unexpected error:', error);
    return NextResponse.json({
      totalCount: 0,
      openMRSCount: 0,
      openSRPCount: 0,
      aaloClincCount: 0,
      eMISCount: 0,
      uncategorizedCount: 0,
      validationPassed: false,
      message: 'API error occurred',
      errors: [error instanceof Error ? error.message : 'Unknown API error']
    }, {
      status: 500,
      headers: getResponseHeaders(600, true, "*", "GET, OPTIONS", "Content-Type")
    });
  }
}