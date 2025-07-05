'use server';

import { CartItem } from "@/types";
import { cookies } from "next/headers";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";

// Calculate cart prices
const calcPrice = (items: CartItem[]) => {
    const itemsPrice = round2(
        items.reduce((acc, item) => acc + (Number(item.price) * item.qty), 0)
    );
    const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
    const taxPrice = round2(itemsPrice * 0.15);
    const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

    return {
        itemsPrice: itemsPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        taxPrice: taxPrice.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
    };
}

export async function addItemToCart(data: CartItem) {
    try {
        // Check for cart cookie
        const sessionCartId = (await cookies()).get("sessionCartId")?.value;
        if (!sessionCartId) throw new Error("Cart session not found");

        // Get the session and user ID
        const session = await auth();
        const userId = session?.user?.id ? (session.user.id as string) : undefined;

        const cart = await getMyCart();

        // Parse and validate item data
        const item = cartItemSchema.parse(data);

        // Find product in the db
        const product = await prisma.product.findFirst({
            where: {
                id: item.productId,
            },
        });
        if (!product) throw new Error("Product not found");
        if (!cart) {
            // Create a new cart if it doesn't exist (nothing in the cart)
            const newCart = insertCartSchema.parse({
                userId: userId,
                items: [item],
                sessionCartId: sessionCartId,
                ...calcPrice([item]),
            });

            // Add to database
            await prisma.cart.create({
                data: newCart,
            });

            // Revalidate product page
            revalidatePath(`/product/${product.slug}`);

            return {
                success: true,
                message: `${product.name} added to cart`,
            };
        } else {
            // Check if item already exists in the cart
            const existItem = (cart.items as CartItem[]).find(
                (x) => x.productId === item.productId
            );

            if (existItem) {
                // Check stock availability
                if (product.stock < existItem.qty + 1) {
                    throw new Error("Not enough stock");
                }
                // Update existing item quantity (ToDo: function to modify qty before adding to cart)                
                existItem.qty++;
            } else {
                // Check stock availability
                if (product.stock < 1) {
                    throw new Error("Not enough stock");
                }
                // Add new item to the cart
                cart.items.push(item);
            }

           // Update the cart in the database
            await prisma.cart.update({
                where: { id: cart.id },
                data: {
                    items: cart.items as CartItem[],
                    ...calcPrice(cart.items as CartItem[]),
                },
            });

            // Revalidate product page
            revalidatePath(`/product/${product.slug}`);

            return {
                success: true,
                message: `${product.name} ${existItem ? "updated successfully" : "added to cart"}`,
            };
        }

    } catch (error) {
        return{
            success: false,
            message: formatError(error),
        }
    }
}

export async function getMyCart(){
    // Check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    // Get the session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get cart from database
    const cart = await prisma.cart.findFirst({
        where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
    });

    if (!cart) return undefined;
    
    // Convert decimals and return
    return convertToPlainObject({
        ...cart,
        items: cart.items as CartItem[],
        itemsPrice: cart.itemsPrice.toString(),
        totalPrice: cart.totalPrice.toString(),
        shippingPrice: cart.shippingPrice.toString(),
        taxPrice: cart.taxPrice.toString(),
    });
}

export async function removeItemFromCart(productId: string) {
    try {
        // Check for cart cookie
        const sessionCartId = (await cookies()).get("sessionCartId")?.value;
        if (!sessionCartId) throw new Error("Cart session not found");

        // Find product in the db
        const product = await prisma.product.findFirst({
            where: {
                id: productId,
            },
        });

        const cart = await getMyCart();
        if (!cart) throw new Error("Cart not found");

        // Find the item to remove
        const existItem = (cart.items as CartItem[]).find(
            (x) => x.productId === productId
        );
        if (!existItem) throw new Error("Item not found in cart!");

        // Check if the qty is 1
        if(existItem.qty === 1) {
            // Remove the item from the cart
            cart.items = (cart.items as CartItem[]).filter(
                (x) => x.productId !== existItem.productId
            );
        } else {
            // Decrease the quantity
            existItem.qty--;
        }

        // Update the cart in the database
        await prisma.cart.update({
            where: { id: cart.id },
            data: {
                items: cart.items as CartItem[],
                ...calcPrice(cart.items as CartItem[]),
            },
        });

        // Revalidate product page
        revalidatePath(`/product/${product?.slug}`);

        return {
            success: true,
            message: `${product?.name} removed from cart`,
        };
    } catch (error) {
        return {
            success: false,
            message: formatError(error),
        };
    }
}
  