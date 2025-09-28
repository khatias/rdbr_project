"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "./CartContext";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function CartDrawer() {
  const { isOpen, close, items, subtotal, error } = useCart();
  const itemsQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  console.log(subtotal);
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={close} />
      )}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-[540px] max-w-[90vw] bg-white shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-10 py-10">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-medium">Shopping Cart</h2>
            <span className="text-xl font-medium">({itemsQuantity})</span>
          </div>
          <button onClick={close} aria-label="Close">
            <XMarkIcon className="h-8 w-8" />
          </button>
        </header>

        {/* Content */}
        <div className="h-[calc(100%-140px)] px-10 overflow-y-auto">
          {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}

          {items.length === 0 ? (
            <p >Your cart is empty.</p>
          ) : (
            <ul className="space-y-10">
              {items.map((it, idx) => (
                <li
                  key={`${it.id}-${it.color ?? "na"}-${it.size ?? "na"}-${idx}`}
                  className="flex gap-6"
                >
                  {/* Product image */}
                  <div className="relative h-[134px] w-25 flex-shrink-0 rounded-md border border-slate-200 overflow-hidden bg-slate-50">
                    {it.cover_image ? (
                      <Image
                        src={it.cover_image}
                        alt={it.name}
                        fill
                        className="object-cover"
                      />
                    ) : null}
                  </div>

                  {/* Product info */}
                  <div className="min-w-0 flex-1 flex flex-col">
                    <div className="flex-1">
                      <p className="truncate text-sm font-medium text-[#10151F] pb-2">
                        {it.name}
                      </p>
                      <div className="grid gap-2 text-xs font-medium text-[#3E424A]">
                        {it.color && <p>{it.color}</p>}
                        {it.size && <p>{it.size}</p>}
                      </div>
                    </div>

                    {/* Quantity at bottom */}
                    <p className="mt-auto text-sm font-medium text-[#10151F]">
                      Qty: {it.quantity}
                    </p>
                  </div>

                  {/* Price + Remove column */}
                  <div className="flex flex-col justify-between items-end text-sm font-medium">
                    <p>${(it.price * it.quantity).toFixed(2)}</p>
                    <button className="text-xs text-[#3E424A] hover:underline opacity-80">
                      remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}
