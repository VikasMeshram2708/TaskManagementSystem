import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const path = request.nextUrl.pathname;

    // Define paths that are publicly accessible
    const isPublicPath = ["/login", "/signup"].includes(path);

    if (!token && !isPublicPath) {
      // Redirect to login if the user is not authenticated and trying to access a protected path
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (token && isPublicPath) {
      // Redirect authenticated users away from public pages like login/signup
      return NextResponse.redirect(new URL("/", request.url)); // Redirect to home or dashboard
    }

    return NextResponse.next(); // Proceed if no redirects are required
  } catch (error) {
    console.error("Error in middleware:", error);
    // Optionally handle errors here (e.g., redirect to a custom error page)
    return NextResponse.redirect(new URL("/error", request.url));
  }
}

export const config = {
  matcher: ["/", "/login", "/signup", "/profile"], // Secure paths that trigger the middleware
};
