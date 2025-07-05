"use client";

import { Cart, CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Loader } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { useTransition } from "react";

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      // Handle success
      toast(res.message, {
        duration: 4000,
        //   action: {
        //     label: "View Cart",
        //     onClick: () => router.push("/cart"),
        //   },
        action: (
          <Button
            className="bg-primary text-secondary hover:bg-gray-700 dark:hover:bg-gray-400"
            onClick={() => router.push("/cart")}
          >
            View Cart
          </Button>
        ),
      });
    });
  };

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      // Handle success
      toast(res.message, {
        duration: 4000,
        action: (
          <Button
            className="bg-primary text-secondary hover:bg-gray-700 dark:hover:bg-gray-400"
            onClick={() => router.push("/cart")}
          >
            View Cart
          </Button>
        ),
      });

      return;
    });
  };

  // Check if the item already exists in the cart
  const existItem = cart?.items?.find((x) => x.productId === item.productId);

  return existItem ? (
    <div>
      <Button variant="outline" type="button" onClick={handleRemoveFromCart}>
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Minus className="w-4 h-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button variant="outline" type="button" onClick={handleAddToCart}>
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
      Add To Cart
    </Button>
  );
};

export default AddToCart;
