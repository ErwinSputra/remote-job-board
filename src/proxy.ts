import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Authenticated but no role yet → force onboarding
  if (token && !token.role && pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  // Already has a role → don't allow going back to onboarding
  if (token?.role && pathname === "/onboarding") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Routes that require authentication
  const protectedRoutes = ["/post-job", "/dashboard", "/saved"];
  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  // Employer-only routes
  const employerRoutes = ["/post-job", "/dashboard"];
  const isEmployerRoute = employerRoutes.some((r) => pathname.startsWith(r));

  if (
    isEmployerRoute &&
    token?.role !== "EMPLOYER" &&
    token?.role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Candidate-only routes
  if (
    pathname.startsWith("/saved") &&
    token?.role !== "CANDIDATE" &&
    token?.role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
