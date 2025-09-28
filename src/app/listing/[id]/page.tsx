// app/listing/[id]/page.tsx
import React from "react";
import { notFound } from "next/navigation";
import Gallery from "@/components/Gallery";
import ColorSwatches from "@/components/ColorSwatches";

const API = "https://api.redseam.redberryinternship.ge/api";

type Product = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  cover_image: string;
  images?: string[];
  available_colors?: string[];
  color?: string | null; // optional current color from API if present
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
    <div className=" px-[100px] ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Gallery images={gallery} alt={product.name} />

        <div className="flex flex-col gap-14">
          <div className="text-3xl font-semibold text-[#10151F] flex flex-col gap-5">
            <h1 className="">
              {product.name}
            </h1>
            <p className="">
              ${product.price}
            </p>
          </div>
          {availableColors.length > 0 && (
            <section className="mb-12">
              <ColorSwatches
                colors={availableColors}
                value={product.color ?? undefined}
              />
            </section>
          )}

          {product.description ? (
            <p className="mt-6 text-slate-700 leading-relaxed">
              {product.description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
