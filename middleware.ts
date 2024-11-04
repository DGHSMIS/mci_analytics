import { getToken } from "next-auth/jwt";
import withAuth from "next-auth/middleware";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export { default } from "next-auth/middleware";


export async function middleware(req: NextRequest, res:NextResponse, event: NextFetchEvent) {
  const token = await getToken({ req } as any);
  const isAuthenticated = !!token;
  //CHeck Authenticated Routes
  if(isAuthenticated){
    //Dont allow to login page if user is authenticated
    if((req.nextUrl.pathname.startsWith('/login'))) {
        return NextResponse.redirect(new URL('/admin/patient', req.url));
    }
  }
  //Check unauthenticated Routes
  else{
    //Dont allow to admin pages if user is not authenticated
    if((req.nextUrl.pathname.startsWith('/admin')) || req.nextUrl.pathname.startsWith("/search-nid")){
      return NextResponse.redirect(new URL('/login', req.url));
    }
    else if (req.nextUrl.pathname == "/" || req.nextUrl.pathname == "/ncd-corner" || req.nextUrl.pathname == "/ncd-corner2" || req.nextUrl.pathname == "/login" || req.nextUrl.pathname.startsWith("/generateImage")){
      return NextResponse.next();
    }
  }
  const authMiddleware = withAuth({
    pages: {
      signIn: `/login`,
    },
  });

  // @ts-expect-error
  return  authMiddleware(req, event);
}

// specify on which routes you want to run the middleware
export const config = {
  matcher: ['/', '/login/:path*', '/admin/:path*', '/((?!api|img|icons|fake-data|_next/static|_next/image|favicon.ico).*)'],
};
