// app/products/[id]/page.tsx  (adjust your route path)
import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProductClient from "@/components/products/ProductClient";

const API = "https://api.redseam.redberryinternship.ge/api";

type Product = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  cover_image: string;
  images?: string[];
  available_colors?: string[];
  color?: string | null;
  available_sizes?: string[];
  brand?: { id: number; name: string; image?: string | null };
};

async function getProduct(id: string): Promise<Product | null> {
  const res = await fetch(`${API}/products/${id}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const raw = await res.json();
  return (raw?.data ?? raw) as Product;
}

export default async function ProductPage({
  params,
}: {
   params: Promise<{ id: string }>;

}) {
  const product = await getProduct((await params).id);
  console.log(product);
  if (!product) notFound();

  return (
    <div className="px-[100px]">
      <ProductClient product={product} />

      {product.brand ? (
        <div className="mt-10">
          {product.brand.image ? (
            <div className="flex w-full items-center justify-between">
              <p className="font-medium text-xl">Details</p>
              <div className="relative w-[109px] h-[61px]">
                <Image
                  src={product.brand.image}
                  alt={product.brand.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ) : null}

          <div className="mt-4">
            <div className="flex text-[16px] text-[#3E424A]">
              <p>
                <span>Brand: </span>
                {product.brand.name}
              </p>
            </div>
            {product.description ? (
              <p className="text-slate-700 leading-relaxed mt-5">
                {product.description}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
