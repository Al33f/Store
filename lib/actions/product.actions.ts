'use server';

import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
import { prisma } from "@/db/prisma";

// This function fetches the latest products from the database as a Prisma object.
// Created a function in lib/utils.ts to convert Prisma objects to regular JS objects.
export async function getLatestProducts() {
    try {
        const products = await prisma.product.findMany({
            take: LATEST_PRODUCTS_LIMIT,
            orderBy: {
                createdAt: 'desc',
            }
        });
        return convertToPlainObject(products);
    } catch (error) {
        console.error("Error fetching latest products:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Get single product by its slug
export async function getProductBySlug(slug: string) {
    try {
        const product = await prisma.product.findUnique({
            where: { slug },
        });
        return convertToPlainObject(product);
    } catch (error) {
        console.error("Error fetching product by slug:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}