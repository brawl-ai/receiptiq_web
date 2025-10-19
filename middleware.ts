import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/projects/:path*", "/home/:path*"],
};

const isAuthenticated = (request: NextRequest) => {
  return request.cookies.get("access_token") ? true : false;
};

export function middleware(request: NextRequest) {
  if (!isAuthenticated(request)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  } else {
    return NextResponse.next();
  }
}
