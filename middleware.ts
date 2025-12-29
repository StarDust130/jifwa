import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 🌐 Public routes: Add '/api(.*)' so Postman can use it!
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  '/terms',
  '/help',
  '/privacy',
  '/refund',
  '/api/webhooks(.*)', // Keep webhooks public if you use them later
  "/api(.*)", // 👈 ADD THIS LINE
]);

const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware((auth, req) => {
  const { userId } = auth();

  // 🔄 If logged in, kick them out of sign-in/up pages to dashboard
  if (userId && isAuthRoute(req)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 🛡️ If not logged in and trying to access private pages, force login
  if (!isPublicRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
