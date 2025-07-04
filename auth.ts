import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import { authConfig } from "./auth.config";

export const config = {
    pages: {
        signIn: "/sign-in",
        error: "/sign-in"
    },
    session: {
        strategy: "jwt" as const,
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            credentials: {
                email: { type: "email" },
                password: { type: "password" },
            },
            async authorize(credentials) {
                if (credentials == null) return null;
                
                // Find user in the database
                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials.email as string,
                    }
                });

                // Check if user exists and password matches
                if (user && user.password) {
                    const isMatch = compareSync(credentials.password as string, user.password);

                    // If password matches, return user object
                    if (isMatch) {
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role
                        };
                    }
                }

                // If no user found or password does not match, return null
                return null;
            }
        }),
    ],
    callbacks: {
        async session({ session, user, trigger, token }: any) {
            // Set the user ID from the token to the session
            if (token?.sub) {
                session.user.id = token.sub;
                session.user.role = token.role;
                session.user.name = token.name;
            }

            // If there's an update set the user name
            if (trigger === "update" && user) {
                session.user.name = user.name;
            }

            return session
        },
        async jwt({ token, user, trigger, session }: any){
            // Assign user fields to the token
            if (user) {
                token.role = user.role;

                // If the user has no name use the first part of the email
                if (user.name === "NO_NAME") {
                    token.name = user.email!.split("@")[0];

                    // Update database to reflect the token name
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { name: token.name }
                    })
                }
            }

            return token;
        },

        ...authConfig.callbacks,
    },
};

export const {handlers, auth, signIn, signOut} = NextAuth(config);