import React from "react";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  cover_image: string;
  price: number;
}

function Card({ product }: { product: Product }) {
  return (
    <div className="rounded-[10px] ">
      <div className=" pb-3">
        <Image
          src={product.cover_image}
          alt={product.name}
          width={412}
          height={549}
          className=" object-cover "
        />
      </div>
      <h2 className="mt-2 font-medium text-lg">{product.name}</h2>
      <p className="text-gray-700 font-medium text-[16px]"> ${product.price}</p>
    </div>
  );
}

export default Card;
