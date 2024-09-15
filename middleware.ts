import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const path = request.nextUrl.pathname;

  // Set of public paths
  const publicPaths = new Set(["/login", "/signup"]);

  // Check if the path is public
  const isPublicPath = publicPaths.has(path);

  // If the user is not authenticated and is trying to access a protected path, redirect to login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If the user is authenticated and is trying to access a public path, redirect to home page
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/signup"],
};
