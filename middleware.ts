import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/terms",
  "/help",
  "/ai-security",
  "/forgot-password",
  "/privacy",
  "/refund",
  "/api/webhooks(.*)",
]);

const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware((auth, req) => {
  const { userId } = auth();

  const dashboardUrl = new URL("/dashboard", req.url);

  // 1️⃣ Logged-in users should never see sign-in / sign-up again
  if (userId && isAuthRoute(req)) {
    const redirectUrl =
      req.nextUrl.searchParams.get("redirect_url") || "/dashboard";

    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  // 2️⃣ User NOT logged in → protect private routes
  if (!isPublicRoute(req)) {
    const redirectAfterAuth = req.nextUrl.pathname + req.nextUrl.search;

    const signUpUrl = new URL("/sign-up", req.url);
    signUpUrl.searchParams.set("redirect_url", redirectAfterAuth);

    auth().protect({
      unauthenticatedUrl: signUpUrl.toString(), // ✅ WITH redirect_url
    });
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js|png|jpg|jpeg|svg|ico|woff2?|ttf)).*)",
  ],
};
