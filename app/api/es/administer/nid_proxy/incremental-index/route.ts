import { nidProxyIndexName } from "@api/providers/elasticsearch/constants";
import { sendErrorMsg, sendSuccess } from "@utils/responseHandlers/responseHandler";
import { NextRequest } from "next/server";
import "server-only";
import { formatDateTime } from "@library/utils";
import { indexNewNIDProxyDataInESData } from "@api/providers/elasticsearch/nidProxyIndex/ESNidProxyIndex";

export const dynamic = "force-dynamic";
export const revalidate = true;
export const fetchCache = "force-no-store";
export const dynamicParams = true;

/**
 * Incrementally update the Elasticsearch index with new data from MySQL.
 * Only indexes rows that have an 'id' greater than the current maximum in Elasticsearch.
 * 
 * @param req NextRequest
 * @returns NextResponse with success or error message.
 */
export async function POST(req: NextRequest) {
  console.log(`Performing incremental update for ${nidProxyIndexName} index...`);

  try {
    const isIndexNewRecords = await indexNewNIDProxyDataInESData();
    if (isIndexNewRecords) {
      return sendSuccess(
        {
          message: `${nidProxyIndexName} index has been updated incrementally successfully at ${formatDateTime(
            new Date().toISOString()
          )}`,
        },
        200
      );
    }
    return sendErrorMsg(
      `Incremental update of ${nidProxyIndexName} index did not return success at ${formatDateTime(
        new Date().toISOString()
      )}`
    );
  } catch (error) {
    console.error(error);
    return sendErrorMsg(
      `Incremental update of ${nidProxyIndexName} index failed at ${formatDateTime(
        new Date().toISOString()
      )}, ${(error as any).message}`
    );
  }
}
