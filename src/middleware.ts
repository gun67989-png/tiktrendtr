import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { checkRateLimit, getRateLimitType } from "@/lib/rate-limit";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret-change-me"
);

interface SessionPayload {
  userId: string;
  username: string;
  email: string;
  role: "admin" | "user";
  onboardingCompleted?: boolean;
}

async function getSessionFromRequest(
  request: NextRequest
): Promise<SessionPayload | null> {
  const token = request.cookies.get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// Simple request ID generator (no crypto needed)
function generateRequestId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestId = generateRequestId();

  // Public routes — skip auth but still apply rate limiting on API routes
  const isPublicRoute =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/pricing" ||
    pathname === "/viral-tiktok-videos-turkey" ||
    pathname === "/trending-hashtags-turkey" ||
    pathname === "/tiktok-trend-report" ||
    pathname === "/contact" ||
    pathname === "/about" ||
    pathname === "/privacy-policy" ||
    pathname === "/terms-of-service" ||
    pathname === "/mesafeli-satis-sozlesmesi" ||
    pathname === "/iptal-ve-iade" ||
    pathname === "/cookie-policy" ||
    pathname === "/onboarding" ||
    pathname === "/payment" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/images");

  const isPublicApi =
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/cron") ||
    pathname.startsWith("/api/thumbnail") ||
    pathname.startsWith("/api/contact") ||
    pathname.startsWith("/api/public") ||
    pathname.startsWith("/api/payment/callback") ||
    pathname.startsWith("/api/payment/subscription/callback") ||
    pathname.startsWith("/api/payment/webhook") ||
    pathname.startsWith("/api/health");

  // Rate limiting for API routes
  if (pathname.startsWith("/api/")) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const type = getRateLimitType(pathname);
    const result = await checkRateLimit(ip, type);

    if (!result.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((result.reset - Date.now()) / 1000)),
            "X-RateLimit-Limit": String(result.limit),
            "X-RateLimit-Remaining": "0",
            "x-request-id": requestId,
          },
        }
      );
    }
  }

  // Public pages — just pass through with request ID
  if (isPublicRoute) {
    const response = NextResponse.next();
    response.headers.set("x-request-id", requestId);
    return response;
  }

  // Public API routes — pass through with request ID
  if (isPublicApi) {
    const response = NextResponse.next();
    response.headers.set("x-request-id", requestId);
    return response;
  }

  // Check auth for dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Redirect to onboarding if not completed (skip for admins)
    if (session.role !== "admin" && session.onboardingCompleted === false) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    // Admin-only route protection
    if (pathname.startsWith("/dashboard/admin") && session.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Pass user info via headers for server components
    const response = NextResponse.next();
    response.headers.set("x-request-id", requestId);
    response.headers.set("x-user-id", session.userId);
    response.headers.set("x-user-role", session.role);
    response.headers.set("x-user-name", session.username);
    response.headers.set(
      "x-subscription-type",
      (session as unknown as Record<string, string>).subscriptionType || "free"
    );
    return response;
  }

  // Admin API routes - check auth + admin role
  if (pathname.startsWith("/api/admin")) {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const response = NextResponse.next();
    response.headers.set("x-request-id", requestId);
    return response;
  }

  // API routes - check auth
  if (pathname.startsWith("/api/")) {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const response = NextResponse.next();
    response.headers.set("x-request-id", requestId);
    return response;
  }

  const response = NextResponse.next();
  response.headers.set("x-request-id", requestId);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
