"use client";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const ProductImages = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);

  return (
    <div className="space-y-4">
      <Image
        src={images[current]}
        alt={`Product Image ${current + 1}`}
        width={1000}
        height={1000}
        className="min-h-[300px] object-cover object-center"
      />
      <div className="flex">
        {images.map((image, index) => (
          <div key={image}>
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              width={100}
              height={100}
              className={cn(
                "cursor-pointer border mr-2 hover:border-orange-600",
                current === index ? "border-2 border-orange-500" : "border"
              )}
              onClick={() => setCurrent(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
