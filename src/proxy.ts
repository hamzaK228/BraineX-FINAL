import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isOnDashboard = pathname.startsWith("/dashboard");
  const isOnAdmin = pathname.startsWith("/admin");
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  // Check for auth session token (set by NextAuth)
  const token =
    request.cookies.get("authjs.session-token") ??
    request.cookies.get("__Secure-authjs.session-token");
  const isLoggedIn = !!token;

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users away from dashboard
  if (!isLoggedIn && isOnDashboard) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect unauthenticated users away from admin
  if (!isLoggedIn && isOnAdmin) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Note: Admin role check happens server-side in API routes and page components
  // since we cannot access Prisma/DB from edge runtime

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/signup"],
};
