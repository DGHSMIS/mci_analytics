import { nidProxyIndexName } from "@api/providers/elasticsearch/constants";
import { dropAndGenerateIndex } from "@api/providers/elasticsearch/ESBase";
import { ESNidProxyIndexBody } from "@api/providers/elasticsearch/nidProxyIndex/ESNidProxyMapping";
import prismaMySQLClient from "@api/providers/prisma/mysql/prismaMySQLClient";
import { sendErrorMsg, sendSuccess } from "@utils/responseHandlers/responseHandler";
import { NextRequest, NextResponse } from "next/server";

import "server-only";
import { formatDateTime } from '@library/utils';
import { indexAllNIDProxyDataInESData } from "@api/providers/elasticsearch/nidProxyIndex/ESNidProxyIndex";

export const dynamic = "force-dynamic";
export const revalidate = true;
export const fetchCache = "force-no-store";
export const dynamicParams = true;


/**
 * Reindex All Data from NID Proxy Database in MYSQL to Elasticsearch
 * @param req
 * @param res
 * @returns
 */
export async function POST(req: NextRequest) {
  console.log(`Cleaning & reindexing ${nidProxyIndexName} index`);
    // Check Authorization & respond error if not verified
    // const isValidUserRequest = await checkIfAuthenticatedMCIUser(req);

    // if (isValidUserRequest !== null) {
    //     return isValidUserRequest;
    // }

  try {
    const nidProxyIndexRegenerated = await dropAndGenerateIndex(nidProxyIndexName, ESNidProxyIndexBody);
    if (nidProxyIndexRegenerated) {
        const isIndexAllNidProxyRecords = await indexAllNIDProxyDataInESData();
        if (isIndexAllNidProxyRecords) {
          return sendSuccess({ message: `${nidProxyIndexName} index has been reindexed successfully at ${formatDateTime(new Date().toISOString())}` }, 200);
        }
      return sendSuccess({ message: `${nidProxyIndexName} index has been index created successfull at ${formatDateTime(new Date().toISOString())}` }, 200);
    }
    return sendErrorMsg(`Reindexing of ${nidProxyIndexName} index failed at ${formatDateTime(new Date().toISOString())}`);
  } catch (error) {
    console.log(error);
    return sendErrorMsg(`Reindexing of ${nidProxyIndexName} index failed at ${formatDateTime(new Date().toISOString())}, ${(error as any).message}`);
  }
}




// export async function GET(req: NextRequest) {
//     try {
//       // Fetch the first 30 rows from the verification_info table
//       const rows = await prismaMySQLClient.verification_info.findMany({
//         take: 30, // Limit to 30 rows
//         where: {
//           id: {
//             gt: 0, // Fetch rows where id > 0 (optional, can be removed if not needed)
//           },
//         },
//       });
  
//     // Convert BigInt values to strings
//     const serializedRows = rows.map((row) => ({
//         ...row,
//         id: row.id.toString(), // Convert BigInt to string
//       }));
  
//       // Return the fetched rows as a successful response
//       return sendSuccess({
//         data: serializedRows,
//         message: "Fetched 30 rows from verification_info",
//       });
//     } catch (error) {
//       console.error("Error fetching data from verification_info:", error);
//       return NextResponse.json(
//         { error: "Failed to fetch data from verification_info" },
//         { status: 500 }
//       );
//     }
//   }