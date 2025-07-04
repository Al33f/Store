'use server';

import { signInFormSchema, signUpFormSchema } from "../validators";
import {signIn, signOut} from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import {prisma} from "@/db/prisma";
import { formatError } from "../utils";

// Sign in the user with credentials
export async function signInWithCredentials(prevState: unknown,formData: FormData) {
    try {
        // Zod is doing the validation. Configured in lib/validators
        const user = signInFormSchema.parse({
            email: formData.get("email"),
            password: formData.get("password"),
        });

        await signIn("credentials", user);
        return { success: true, message: "Sign in successful!" };
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }
        return { success: false, message: "Invalid credentials!" };
    }
}

// Sign out the user
export async function signOutUser() {
    await signOut();
}

// Sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
    try {
        // Zod is doing the validation. Configured in lib/validators
        const user = signUpFormSchema.parse({
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
            confirmPassword: formData.get("confirmPassword"),
        });

        // Hash the password before saving to the database
        const hashedPassword = hashSync(user.password, 10);

        // Create user in the database
        await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: hashedPassword,
            },
        });

        await signIn("credentials", { email: user.email, password: user.password });
        
        return { success: true, message: "Sign up successful!" };
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }
        return { success: false, message: formatError(error) || "An unexpected error occurred during sign up." };
    }
} 