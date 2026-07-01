import { esBaseClient } from "@providers/elasticsearch/ESBase";
import { patientESIndex } from "@providers/elasticsearch/patientIndex/ESPatientIndex";
import { sendErrorMsg, sendSuccess } from "@utils/responseHandlers/responseHandler";
import { NextRequest } from "next/server";
import "server-only";

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const dateFrom = params.get("dateFrom");
    const dateTo = params.get("dateTo");

    const filterClauses: any[] = [];
    if (dateFrom && dateTo) {
      filterClauses.push({
        range: {
          created_at: { gte: dateFrom, lte: dateTo },
        },
      });
    }

    const body: any = {
      size: 0,
      aggs: {
        total_patients: {
          value_count: { field: "health_id" },
        },
        hid_card_status: {
          terms: {
            field: "hid_card_status",
            size: 100,
            min_doc_count: 0,
          },
        },
      },
    };

    if (filterClauses.length > 0) {
      body.query = { bool: { filter: filterClauses } };
    }

    const { body: result } = await esBaseClient.search({
      index: patientESIndex,
      body,
    });

    const statusBuckets = result.aggregations.hid_card_status.buckets.map(
      (bucket: any) => ({
        status: bucket.key,
        count: bucket.doc_count,
      })
    );

    const totalPatients = result.aggregations.total_patients.value;
    const totalCardHolders = statusBuckets
      .filter((b: any) => b.status && b.status !== "")
      .reduce((sum: number, b: any) => sum + b.count, 0);

    return sendSuccess({
      totalPatients,
      totalCardHolders,
      hidCardStatusBreakdown: statusBuckets,
    });
  } catch (error) {
    console.error("Error fetching HID card stats:", error);
    return sendErrorMsg("Failed to fetch HID card stats", 500);
  }
}
