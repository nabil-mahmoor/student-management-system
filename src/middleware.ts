import { auth } from "@/src/services/auth/auth.config";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always let Better Auth's own API routes through —
  // they handle their own auth internally
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({ headers: req.headers });

  // ── Logged-in user hits /login → send to /students ──────────────────────
  if (pathname.startsWith("/login") && session) {
    return NextResponse.redirect(new URL("/students", req.url));
  }

  // ── Unauthenticated user hits a protected route ──────────────────────────
  if (!session) {
    // API routes return 401 — don't redirect, the client handles it
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // All other protected pages redirect to login
    if (!pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static  (Next.js static assets)
     * - _next/image   (Next.js image optimization)
     * - favicon.ico
     * - public folder assets (logos, images)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png).*)",
  ],
};