// components/cart/CartButton.tsx
"use client";

import React from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { useCart } from "@/components/cart/CartContext";

export default function CartButton() {
  const { open, items } = useCart();
  const count = items.reduce((s, it) => s + (it.quantity || 0), 0);

  return (
    <button
      type="button"
      onClick={open}
      aria-label="Open cart"
      className="relative inline-flex items-center justify-center"
    >
      <ShoppingCartIcon className="h-[20px] w-[20px] text-gray-800" />
      {count > 0 && (
        <span className="absolute -right-2 -top-2 min-w-[18px] h-[18px] rounded-full bg-[#FF4000] text-white text-[10px] leading-[18px] text-center px-1">
          {count}
        </span>
      )}
    </button>
  );
}
