// proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export default async function proxy(req: NextRequest) {
  // Use NextAuth v5's auth() instead of getToken — works correctly on edge/Vercel
  const session = await auth();
  const token = session?.user ?? null;
  const { pathname } = req.nextUrl;

  // 2. ONBOARDING ENFORCEMENT
  // Block unauthenticated users from accessing /onboarding
  if (!token && pathname === "/onboarding") {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  if (token && !token.role && pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  if (token?.role && pathname === "/onboarding") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 3. GLOBAL ROUTE PROTECTION
  const protectedRoutes = ["/post-job", "/dashboard", "/saved"];
  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  // 4. EMPLOYER-ONLY ROUTES
  const employerRoutes = ["/post-job", "/dashboard"];
  const isEmployerRoute = employerRoutes.some((r) => pathname.startsWith(r));

  if (
    isEmployerRoute &&
    token?.role !== "EMPLOYER" &&
    token?.role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 5. CANDIDATE-ONLY ROUTES
  if (
    pathname.startsWith("/saved") &&
    token?.role !== "CANDIDATE" &&
    token?.role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 6. ALLOW
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
