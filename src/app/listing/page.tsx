import React from "react";
import Card from "@/components/Card";
type Product = {
  id: number;
  name: string;
  cover_image: string;
  price: number;

};

export default async function page() {
  const products = await fetch(
    "https://api.redseam.redberryinternship.ge/api/products",
    { method: "GET" }
  ).then((res) => res.json());

  return (
    <div className="grid grid-cols-4 gap-6 max-w-[1720px] mx-auto mt-10">
      {products.data.map((product: Product) => (
        <Card key={product.id} product={product} />
      ))}
    </div>
  );
}


