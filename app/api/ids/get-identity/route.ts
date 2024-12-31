import { loginAuthenticationHeaders } from "@utils/constantsInMemory";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  const params: any = req.nextUrl.searchParams;
  console.log("Provider Info to verify");
  console.log(params);
  let url = "";

  params.forEach((key: any, value: any) => {
    console.log(value);
    if (value == "url") {
      url = key;
    }
  });
  console.log("The URL to ids -- ");
  console.log(url);
  if(url.length == 0) {
    return NextResponse.json({
      status: 400,
      message: "Invalid URL Provided",
      headers: {
        "content-type": "application/json",
        "Cache-Control": "max-age=0, s-maxage=0, stale-while-revalidate=0",
      },
    });
  }

  // if(!url.includes(String(process.env.NEXT_PUBLIC_AUTH_BASE_URL))) {
  //   return NextResponse.json({
  //     status: 400,
  //     message: "Invalid Base URL",
  //     headers: {
  //       "content-type": "application/json",
  //       "Cache-Control": "max-age=0, s-maxage=0, stale-while-revalidate=0",
  //     },
  //   });
  // }
  const apiHeader = {
    method: "GET",
    headers: loginAuthenticationHeaders,
    body: null,
  };

  console.log("Making the call to the server");
  const results =  await fetch(
    url,
    apiHeader
  );

  if(results.status == 200){
    console.log("Provider Info on the server");
    const res = await results.json();
    console.log(res);
  
    return NextResponse.json({
      status: 200,
      headers: {
        "content-type": "application/json",
        "Cache-Control": "max-age=0, s-maxage=0, stale-while-revalidate=0",
      },
      body: res
    });
  }
  return NextResponse.json({
    status: results.status,
    message: "Error fetching provider information",
    headers: {
      "content-type": "application/json",
      "Cache-Control": "max-age=0, s-maxage=0, stale-while-revalidate=0",
    },
  });
}