import { checkIfMCIAdminOrApprover } from '@utils/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    
    const isNotVerifiedResponse = await checkIfMCIAdminOrApprover(req);
    if (isNotVerifiedResponse !== null) {
      return isNotVerifiedResponse;
    }
  
    const params: any = req.nextUrl.searchParams;
    console.log("Get Patient health card");
    console.log(params);
    let hid = "";
    params.forEach((key: any, value: any) => {
      console.log(value);
      if (value == "hid") {
        hid = key;
      }
    });
    console.log("patient hid");
    console.log(hid);
    const cardServiceBaseUrl = process.env.CARD_PRINTER_SERVICE_BASEURL ? process.env.CARD_PRINTER_SERVICE_BASEURL : "";
    const getHealthCardFromCardServer = await fetch(
      cardServiceBaseUrl + "/api/es/patient/get-patient-health-card?hid=" + hid,
    );

    const results = await getHealthCardFromCardServer.json();
    
    return NextResponse.json(
        {...results},
        {
          status: 200,
          headers: {
            "content-type": "application/json",
            "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
          },
        });
}