import {z} from 'zod';
import { formatNumberWithDecimal } from './utils';

const currency = z
        .string()
        .refine(
            value => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
            "The price must have exactly two decimal places"
        );

//Schema for inserting products
export const insertProductSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    slug: z.string().min(3, "Slug must be at least 3 characters long"),
    category: z.string().min(3, "Category must be at least 3 characters long"),
    brand: z.string().min(3, "Brand must be at least 3 characters long"),
    description: z.string().min(3, "Description must be at least 3 characters long"),
    stock: z.coerce.number(),
    images: z.array(z.string()).min(1, "At least one image is required"),
    isFeatured: z.boolean(),
    banner: z.string().nullable(),
    price: currency,
});

//Schema for signing users in
export const signInFormSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

//Schema for signing up users
export const signUpFormSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

// Cart schemas
export const cartItemSchema = z.object({
    productId: z.string().min(1, "Product ID is required"),
    name: z.string().min(1, "Product name is required"),
    slug: z.string().min(1, "Product slug is required"),
    qty: z.number().int().nonnegative("Quantity must be a positive number"),
    image: z.string().min(1, "Product image is required"),
    price: currency,
});

export const insertCartSchema = z.object({
    items: z.array(cartItemSchema),
    itemsPrice: currency,
    totalPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    sessionCartId: z.string().min(1, "Session Cart ID is required"),
    userId: z.string().optional().nullable(),
});