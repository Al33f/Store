import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export const authConfig = {
    providers: [],
    callbacks:{
        authorized({ request, auth }: any) {
            // Array of regex patterns of paths we want to protect
            const protectedPaths = [
                /\/shipping-address/,
                /\/payment-method/,
                /\/place-order/,
                /\/profile/,
                /\/user\/(.*)/,
                /\/order\/(.*)/,
                /\/admin/,
            ];

            // Get pathname from the req URL object
            const { pathname } = request.nextUrl;

            // Check if user is not authenticated and accessing a protected path
            if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;

            // Check for session cart cookie
            if(!request.cookies.get("sessionCartId")){
                // Generate a new session cart ID
                const sessionCartId = crypto.randomUUID();

                // Clone the request headers to set a new cookie
                const newRequestHeaders = new Headers(request.headers);

                // Create a new response and add the new headers
                const response = NextResponse.next({
                    request: {
                        headers: newRequestHeaders,
                    },
                });

                // Set newly generated session cart ID in the response cookies
                response.cookies.set("sessionCartId", sessionCartId);
                return response;
            } else {
                // If the session cart cookie exists, return true
                return true;
            }

        }
    },
} satisfies NextAuthConfig;