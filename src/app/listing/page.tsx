import React from "react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
};

export default async function page() {
  const products = await fetch(
    "https://api.redseam.redberryinternship.ge/api/products",
    { method: "GET" }
  ).then((res) => res.json());
  return (
    <div>
      {products.data.map((product: Product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>Price: {product.price}</p>
        </div>
      ))}
    </div>
  );
}


