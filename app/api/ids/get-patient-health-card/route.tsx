import { checkIfMCIAdminOrApprover } from '@utils/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    
    const isNotVerifiedResponse = await checkIfMCIAdminOrApprover(req);
    if (isNotVerifiedResponse !== null) {
      return isNotVerifiedResponse;
    }
  
    const hid = req.nextUrl.searchParams.get("hid") || "";
    console.log("Get Patient health card for HID:", hid);
    
    if (!hid) {
      return NextResponse.json(
        { error: "HID parameter is required" },
        { status: 400 }
      );
    }

    const rawCardServiceBaseUrl = process.env.CARD_PRINTER_SERVICE_BASEURL || "https://card.mcishr.dghs.gov.bd";
    const cardServiceBaseUrl = rawCardServiceBaseUrl.replace(/\/$/, "");

    try {
      const headers: Record<string, string> = {};
      const authHeader = req.headers.get("authorization");
      if (authHeader) {
        headers["Authorization"] = authHeader;
      }

      console.log("Fetching health card from:", cardServiceBaseUrl + "/api/es/patient/get-patient-health-card?hid=" + hid);
      const getHealthCardFromCardServer = await fetch(
        cardServiceBaseUrl + "/api/es/patient/get-patient-health-card?hid=" + hid,
        { headers }
      );

      const results = await getHealthCardFromCardServer.json();
      console.log("Card server response:", getHealthCardFromCardServer.status, results);

      return NextResponse.json(
        { ...results },
        {
          status: getHealthCardFromCardServer.status || 200,
          headers: {
            "content-type": "application/json",
            "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
          },
        }
      );
    } catch (error: any) {
      console.error("Error fetching health card:", error);
      return NextResponse.json(
        { imageURI: "", error: error?.message || "Failed to fetch health card" },
        { status: 500 }
      );
    }
}