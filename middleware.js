import { NextResponse } from "next/server";

export async function middleware(request) {
  const token = request.cookies.get("next-auth.session-token")?.value;

  // const path = await request.nextUrl().pathname;
  const path = request.nextUrl.pathname;

  const isPublicPath = path === "/login" || path === "/signup";

  // console.log("path", path);

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/", "/login", "/signup"],
};
