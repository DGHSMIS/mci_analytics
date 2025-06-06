import { getAuthBaseUrl, getUrlFromName } from "@utils/lib/apiList";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const params: any = req.nextUrl.searchParams;
  console.log("MCI Patient Verification");
  console.log(params);
  let url = "";

  params.forEach((key: any, value: any) => {
    console.log(value);
    if (value == "url") {
      url = key;
    }
  });
  console.log("MCI Patient Verification, The URL is -- ");
  console.log(url);
  if (url.length == 0) {
    return NextResponse.json({
      status: 400,
      headers: {
        "content-type": "application/json",
        "Cache-Control": "max-age=0, s-maxage=0, stale-while-revalidate=0",
      },
    });
  }

  const formData = new FormData();
  formData.append("email", String(process.env.FREESHR_API_USERNAME));
  formData.append("password", String(process.env.FREESHR_API_PASSWORD));
  console.log("The form data is" + process.env.FREESHR_API_USERNAME);
  console.log(
    "The form data is" + String(process.env.FREESHR_AUTH_X_TOKEN_FOR_LOGIN)
  );
  console.log("The form data is" + String(process.env.FREESHR_CLIENT_ID));

  const authHeader = {
    method: "POST",
    headers: new Headers({
      "X-Auth-Token": String(process.env.FREESHR_AUTH_X_TOKEN_FOR_LOGIN),
      "client-id": String(process.env.FREESHR_CLIENT_ID),
    }),
    body: formData,
    next: { revalidate: 300 },
  };

  console.log("Getting auth token before making the call to the MCI server");
  console.log(getAuthBaseUrl() + getUrlFromName("auth-url"));
  console.log(authHeader);

  const verifyCreds = await fetch(
    getAuthBaseUrl() + getUrlFromName("auth-url"),
    authHeader
  );
  let authToken = "";
  if (verifyCreds.status == 200) {
    const data = await verifyCreds.json();
    console.log("The access token is---");
    console.log(data);
    console.log(authToken);
    console.log(authToken);
    authToken = data.access_token;
  } else {
    console.log("Error authenticating");
    return NextResponse.json({
      status: 400,
      message: "Authentication Failed!",
      headers: {
        "content-type": "application/json",
        "Cache-Control": "max-age=0, s-maxage=0, stale-while-revalidate=0",
      },
    });
  }

  const apiHeader = {
    method: "GET",
    headers: new Headers({
      "X-Auth-Token": authToken,
      "client-id": String(process.env.FREESHR_CLIENT_ID),
      From: String(process.env.FREESHR_API_USERNAME),
    }),
    body: null,
  };

  console.log("Making the call to the server");
  console.log(url);
  console.log(apiHeader.headers.get("X-Auth-Token"));
  console.log(apiHeader.headers.get("client-id"));
  console.log(apiHeader.headers.get("From"));

  const results = await fetch(url, apiHeader);
  console.log("results");
  console.log(results);
  if (results.status == 200) {
    const patientdata = await results.json();

    console.log("Provider Info on the server");
    console.log(patientdata);

    return NextResponse.json({
      status: 200,
      headers: {
        "content-type": "application/json",
        "Cache-Control": "max-age=0, s-maxage=0, stale-while-revalidate=0",
      },
      body: patientdata,
    });
  } else {
    return NextResponse.json({
      status: 400,
      message: "Failed to get patient data from MCI server",
      headers: {
        "content-type": "application/json",
        "Cache-Control": "max-age=0, s-maxage=0, stale-while-revalidate=0",
      },
    });
  }
}
