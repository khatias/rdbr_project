import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import Gallery from "@/components/Gallery";

import PurchaseBox from "@/components/products/PurchaseBox";
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
  brand?: {
    id: number;
    name: string;
    image?: string | null;
  };
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
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const gallery = [product.cover_image, ...(product.images ?? [])].filter(
    Boolean
  );

  return (
    <div className="px-[100px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Gallery images={gallery} alt={product.name} />

        <div className="flex flex-col gap-14">
          <div className="text-3xl font-semibold text-[#10151F] flex flex-col gap-5">
            <h1>{product.name}</h1>
            <p>${product.price}</p>
          </div>

          <PurchaseBox
            productId={product.id}
            colors={product.available_colors ?? []}
            sizes={product.available_sizes ?? []}
            initialColor={product.color ?? undefined}
          />

          <div className="border-b border-b-[#E1DFE1]" />

          {product.brand ? (
            <div className="">
              {product.brand.image ? (
                <div className="">
                  <div className="flex w-full items-center justify-between ">
                    <p className="font-medium text-xl eading-none tracking-normal">
                      Details
                    </p>
                    <div className="relative w-[109px] h-[61px]">
                      <Image
                        src={product.brand.image!}
                        alt={product.brand.name}
                        fill
                        className="object-contain "
                      />
                    </div>
                  </div>
                </div>
              ) : null}
              <div>
                <div className="flex text-[16px] text-[#3E424A]">
                  <p className="">
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

          {/* Description */}
        </div>
      </div>
    </div>
  );
}
