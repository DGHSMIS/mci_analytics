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

    const rawCardServiceBaseUrl = process.env.CARD_PRINTER_SERVICE_BASEURL || "";
    const cardServiceBaseUrl = rawCardServiceBaseUrl.replace(/\/$/, "");

    try {
      const getHealthCardFromCardServer = await fetch(
        cardServiceBaseUrl + "/api/es/patient/get-patient-health-card?hid=" + hid,
      );

      if (!getHealthCardFromCardServer.ok) {
        console.error("Card server returned status:", getHealthCardFromCardServer.status);
        return NextResponse.json(
          { imageURI: "", error: "Failed to fetch health card from card server" },
          { status: getHealthCardFromCardServer.status }
        );
      }

      const results = await getHealthCardFromCardServer.json();
      
      return NextResponse.json(
        { ...results },
        {
          status: 200,
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