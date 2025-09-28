import React from "react";

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
    <div className="w-full">
      <ProductClient product={product} />
    </div>
  );
}
