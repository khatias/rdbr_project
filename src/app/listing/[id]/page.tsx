// app/listing/[id]/page.tsx
import React from "react";
import { notFound } from "next/navigation";

const API = "https://api.redseam.redberryinternship.ge/api";

type Product = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  cover_image: string;
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

  return (
    <div >
      <h1 >{product.name}</h1>
      <p >${product.price}</p>
      {product.description && (
        <p>{product.description}</p>
      )}
 
    </div>
  );
}
