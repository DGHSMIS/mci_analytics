import { retrieveMinioImageAsBase64 } from '@providers/minio/MinioBase';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const params: any = req.nextUrl.searchParams;
    console.log("Get Patient Photo using NID");
    console.log(params);
    let nid = "";
    params.forEach((key: any, value: any) => {
      console.log(value);
      if (value == "nid") {
        nid = key;
      }
    });
    console.log("patient nid");
    console.log(nid);
    
    const img = await retrieveMinioImageAsBase64("nid-image-store", String(nid));

    const imgURI = img ? `data:image/png;base64,${img}` : "";
    
    return NextResponse.json(
        {imgURI: imgURI},
        {
          status: 200,
          headers: {
            "content-type": "application/json",
            "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
          },
        });
}