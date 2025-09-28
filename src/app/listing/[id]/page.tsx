// app/listing/[id]/page.tsx
import React from "react";
import Image from "next/image"; // ← add
import { notFound } from "next/navigation";
import Gallery from "@/components/Gallery";
import ColorSwatches from "@/components/ColorSwatches";
import SizeSwatches from "@/components/products/SizeSwatches";
import QtyPicker from "@/components/products/QtyPicker";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

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
    // ← add
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
  const availableColors = product.available_colors ?? [];

  return (
    <div className="px-[100px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Gallery images={gallery} alt={product.name} />

        <div className="flex flex-col gap-14">
          <div className="text-3xl font-semibold text-[#10151F] flex flex-col gap-5">
            <h1>{product.name}</h1>
            <p>${product.price}</p>
          </div>

          {availableColors.length > 0 && (
            <section>
              <ColorSwatches
                colors={availableColors}
                value={product.color ?? undefined}
              />
            </section>
          )}

          {product.available_sizes?.length ? (
            <section>
              <SizeSwatches sizes={product.available_sizes as string[]} />
            </section>
          ) : null}

          <section>
            <QtyPicker max={10} />
          </section>

          <button>
            <span className="w-full inline-block text-center bg-[#FF4000] text-white text-[18px] font-medium px-6 py-4 rounded-[10px] hover:bg-[#e03e00] transition">
              <ShoppingCartIcon className="h-5 w-5 inline-block mr-2" />
              Add to Cart
            </span>
          </button>

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
