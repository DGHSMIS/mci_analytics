import { getResponseHeaders } from "@utils/utilityFunctions";
import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { patientESIndex } from "@providers/elasticsearch/patientIndex/ESPatientIndex";
import { esBaseClient } from "@providers/elasticsearch/ESBase";


export interface ClientWisePatientCreatedReportProps {
    patientsCreated: number;
  }

/**
 * Clientwise Patient Created Report
 * @param req
 * @param res
 * @returns
 */
export async function GET(req: NextRequest) {
    const params: any = req.nextUrl.searchParams;
    let clientId = '';
    let dateFrom = '';
    let dateTo = '';
    console.log("params");
    console.log(params);
    params.forEach((key: any, value: any) => {
      console.log(value);
      if (value == "clientId") {
        clientId = key;
      } else if (value == "dateFrom") {
        dateFrom = key;
      } else if (value == "dateTo") {
        dateTo = key;
      }
    });

    if (!clientId || !dateFrom || !dateTo) {
        // Handle missing parameters
        return NextResponse.json({ error: 'clientId, dateFrom, and dateTo are required' }, {
            status: 400, // Bad request
        });
    }


    // console.log(isNotVerifiedResponse);
    const results = await getTotalRegistrationsByClient(clientId,dateFrom, dateTo);
    return NextResponse.json(results, {
        status: 200,
        headers: getResponseHeaders(600, true, "*", "GET, OPTIONS", "Content-Type")
    },
    );
}


async function getTotalRegistrationsByClient(clientId:string, dateFrom:string, dateTo:string) {
    try {
        const response = await esBaseClient.count({
            index: patientESIndex,
            body: {
                query: {
                    bool: {
                        must: [
                            { term: { created_client_id: clientId } }, // Use the function parameter
                            { range: { created_at: { gte: dateFrom, lte: dateTo } } } // Use the date range
                        ]
                    }
                }
            }
        });
      console.log("response");
      console.log(response);
      
      return {
        patientsCreated: response.body.count,
      };
    } catch (error) {
      console.error("Error fetching registration count", error);
      return 0; // Optionally handle the error differently
    }
  }
  