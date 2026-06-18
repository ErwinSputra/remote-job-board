// proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// -----------------------------------------------------------------------------
// NEXT.JS 16+ PROXY (EDGE RUNTIME)
// -----------------------------------------------------------------------------
// Acts as a global network boundary and gatekeeper for the application.
// It intercepts every request before it reaches the routing layer, ensuring users
// have the correct authentication and role-based permissions to access specific routes.
export default async function proxy(req: NextRequest) {
  // 1. EXTRACT JWT TOKEN
  // Securely retrieve the decoded JSON Web Token from the user's cookies.
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const { pathname } = req.nextUrl;

  // 2. ONBOARDING ENFORCEMENT
  // If a user has logged in but hasn't selected a role yet, strictly lock them
  // into the /onboarding page until they make a choice.
  if (token && !token.role && pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  // Prevent users who already have a role from accessing the onboarding page again.
  if (token?.role && pathname === "/onboarding") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 3. GLOBAL ROUTE PROTECTION
  // Define all routes that strictly require a user to be logged in.
  const protectedRoutes = ["/post-job", "/dashboard", "/saved"];
  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));

  // Redirect unauthenticated users trying to access protected routes to the sign-in page.
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  // 4. EMPLOYER-ONLY ROUTES
  // Restrict access to job posting and dashboard routes. Only Employers or Admins are allowed.
  const employerRoutes = ["/post-job", "/dashboard"];
  const isEmployerRoute = employerRoutes.some((r) => pathname.startsWith(r));

  if (
    isEmployerRoute &&
    token?.role !== "EMPLOYER" &&
    token?.role !== "ADMIN"
  ) {
    // Boot unauthorized users (like Candidates) back to the homepage
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 5. CANDIDATE-ONLY ROUTES
  // Restrict access to saved jobs (bookmarks). Only Candidates or Admins are allowed.
  if (
    pathname.startsWith("/saved") &&
    token?.role !== "CANDIDATE" &&
    token?.role !== "ADMIN"
  ) {
    // Boot unauthorized users (like Employers) back to the homepage
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 6. ALLOW REQUEST
  // If all security checks pass, allow the request to proceed to the intended page.
  return NextResponse.next();
}

// -----------------------------------------------------------------------------
// PROXY CONFIGURATION
// -----------------------------------------------------------------------------
// Defines which paths the proxy should run on.
// The Regex below ignores API routes, static files, and images to optimize performance
// and prevent the proxy from running unnecessarily on background assets.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
