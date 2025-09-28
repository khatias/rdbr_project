// components/cart/CartDrawer.tsx
"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "./CartContext";
import { XMarkIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

export default function CartDrawer() {
  const { isOpen, close, items, subtotal, error, updateQty, remove, pending } = useCart();
  const itemsQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/40" onClick={close} />}
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
            <p>Your cart is empty.</p>
          ) : (
            <ul className="space-y-10">
              {items.map((it, idx) => (
                <li
                  key={`${it.id}-${it.color ?? "na"}-${it.size ?? "na"}-${idx}`}
                  className="flex gap-6"
                >
                  {/* Image */}
                  <div className="relative h-[134px] w-25 flex-shrink-0 rounded-md border border-slate-200 overflow-hidden bg-slate-50">
                    {it.cover_image ? (
                      <Image src={it.cover_image} alt={it.name} fill className="object-cover" />
                    ) : null}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1 flex flex-col">
                    <div className="flex-1">
                      <p className="truncate text-sm font-medium text-[#10151F] pb-2">{it.name}</p>
                      <div className="grid gap-2 text-xs font-medium text-[#3E424A]">
                        {it.color && <p>{it.color}</p>}
                        {it.size && <p>{it.size}</p>}
                      </div>
                    </div>

                    {/* Quantity controls (variant-aware) */}
                    <div className="mt-auto">
          <div className="inline-flex items-center rounded-[22px] border border-[#E1DFE1] w-[70px] h-[26px]">
                        <button
                          aria-label="Decrease quantity"
                 className="h-8 w-8 grid place-items-center disabled:opacity-40"
                          disabled={pending || it.quantity <= 1}
                          onClick={() =>
                            updateQty(it.id, it.quantity - 1, {
                              color: it.color ?? undefined,
                              size: it.size ?? undefined,
                            })
                          }
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                         <span className=" text-center text-xs font-medium text-[#10151F]">
                          {it.quantity}
                        </span>
                        <button
                          aria-label="Increase quantity"
                         className="h-8 w-8 grid place-items-center disabled:opacity-40"
                          disabled={pending || it.quantity >= 10}
                          onClick={() =>
                            updateQty(it.id, it.quantity + 1, {
                              color: it.color ?? undefined,
                              size: it.size ?? undefined,
                            })
                          }
                        >
                          <PlusIcon className="h-4 w-4 stroke-[2] text-slate-900" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Price + Remove */}
                  <div className="flex flex-col justify-between items-end text-sm font-medium">
                    <p>${(it.price * it.quantity).toFixed(2)}</p>
                    <button
                      className="text-xs text-[#3E424A] hover:underline opacity-80 disabled:opacity-40"
                      onClick={() =>
                        remove(it.id, { color: it.color ?? undefined, size: it.size ?? undefined })
                      }
                      disabled={pending}
                    >
                      remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-10 py-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#3E424A]">Subtotal</span>
            <span className="font-medium text-[#10151F]">${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </aside>
    </>
  );
}
