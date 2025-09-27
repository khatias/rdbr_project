// app/listing/[id]/page.tsx
import React from "react";
import { notFound } from "next/navigation";
import Gallery from "@/components/Gallery";

const API = "https://api.redseam.redberryinternship.ge/api";

type Product = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  cover_image: string;
  images?: string[];
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

  const gallery = [product.cover_image, ...(product.images ?? [])].filter(Boolean);

  return (
    <div className="  px-6 py-10">
      <div className="grid grid-cols-2 gap-10">
        <Gallery images={gallery} alt={product.name} />

        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">{product.name}</h1>
          <p className="mt-2 text-xl md:text-2xl font-medium  ">
            ${product.price}
          </p>

          {product.description ? (
            <p className="mt-4 text-slate-700 leading-relaxed">{product.description}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
