import bwipjs from 'bwip-js';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const params: any = req.nextUrl.searchParams;
    console.log("New request to get patient by id");
    console.log(params);
    let hid = "";
    params.forEach((key: any, value: any) => {
      console.log(value);
      if (value == "hid") {
        hid = key;
      }
    });
    console.log("hid");
    console.log(hid);
    
    const barCodeBuffer = await bwipjs.toBuffer({
        bcid: 'code128',       // Barcode type
        text: hid,       // Text to encode
        scale: 2,              // 3x scaling factor
        height: 8,            // Bar height, in millimeters
        includetext: false,    // Show human-readable text
        textcolor: "#475569",
        
      });
      const barCodeURI = `data:image/png;base64,${barCodeBuffer.toString('base64')}`;

    return NextResponse.json(
        {barCodeURI: barCodeURI},
        {
          status: 200,
          headers: {
            "content-type": "application/json",
            "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
          },
        });
}