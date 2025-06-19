import { PrismaClient } from "@/lib/generated/prisma";

// This file extends the Prisma Client to add custom computed fields for product price and rating.
export const prisma = new PrismaClient().$extends ({
  result: {
    product: {
      price: {
        compute(product) {
            return product.price.toString();
        },
      },
      rating: {
        compute(product) {
            return product.rating.toString();
        },
      },
    },
  },
});