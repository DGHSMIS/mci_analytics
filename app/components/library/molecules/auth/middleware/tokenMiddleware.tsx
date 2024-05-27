import { NextRequest, NextResponse } from "next/server";

function tokenMiddlewareFn(
  request: NextRequest,
  baseUrl: string,
  basePath = "dashboard"
) {
  const verify = request.cookies.get("token");
  const url = request.url;

  if (!verify && url.includes("/" + basePath)) {
    return NextResponse.redirect(baseUrl + "/");
  }

  if (verify && url === baseUrl + "/") {
    return NextResponse.redirect(baseUrl + "/" + basePath);
  }
}

export default tokenMiddlewareFn;
