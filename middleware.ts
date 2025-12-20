import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - _next (static files)
     * - favicon.ico, images, etc
     */
    "/((?!_next|.*\\..*).*)",
  ],
};
