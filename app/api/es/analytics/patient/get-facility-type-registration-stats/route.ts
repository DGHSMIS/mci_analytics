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
  const statsService = new RegistrationStatsService();
  const results = await statsService.getTotalRegistrationStats();

  // Return appropriate status code based on validation
  const statusCode = results.validationPassed ? 200 : 206; // 206 Partial Content if validation failed

  return NextResponse.json(results, {
      status: statusCode,
      headers: getResponseHeaders(600, true, "*", "GET, OPTIONS", "Content-Type")
    },
  );
}
