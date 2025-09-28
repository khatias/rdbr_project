// components/checkout/OrderSummary.tsx
"use client";

import React from "react";
import Image from "next/image";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import PayButton from "@/components/checkout/PayButton";
import { useCart } from "@/components/cart/CartContext";
import type { CartItem } from "@/components/cart/CartContext";

export default function OrderSummary({ initialItems = [] }: { initialItems?: CartItem[] }) {
  const { items, updateQty, remove, pending } = useCart();

  // After hydration, always use context items (even if empty).
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);

  const list = hydrated ? items : (items.length ? items : initialItems);

  const subtotal = list.reduce((s, it) => s + it.price * it.quantity, 0);
  const delivery = list.length > 0 ? 5 : 0;
  const total = subtotal + delivery;

  return (
    <div className="h-[635px] flex flex-col justify-between ">
      {list.length === 0 ? (
        <div className="mt-4 text-sm text-[#3E424A]">
          Your cart is empty.
        </div>
      ) : (
        <div className="h-[635px] flex flex-col justify-between space-y-6">
          <ul className="space-y-10">
            {list.map((it, idx) => (
              <li key={`${it.id}-${it.color ?? "na"}-${it.size ?? "na"}-${idx}`} className="flex gap-6">
                <div className="relative h-[134px] w-25 flex-shrink-0 rounded-md border border-[#E1DFE1] overflow-hidden bg-slate-50">
                  {it.image ? (
                    <Image src={it.image} alt={it.name} fill className="object-cover" />
                  ) : it.cover_image ? (
                    <Image src={it.cover_image} alt={it.name} fill className="object-cover" />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1 flex flex-col">
                  <div className="flex-1">
                    <p className="truncate text-sm font-medium text-[#10151F] pb-2">{it.name}</p>
                    <div className="grid gap-2 text-xs font-medium text-[#3E424A]">
                      {it.color && <p>{it.color}</p>}
                      {it.size && <p>{it.size}</p>}
                    </div>
                  </div>

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
                      <span className="text-center text-xs font-medium text-[#10151F]">{it.quantity}</span>
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

                <div className="flex flex-col justify-between items-end text-sm font-medium">
                  <p>${(it.price * it.quantity).toFixed(2)}</p>
                  <button
                    className="text-xs text-[#3E424A] hover:underline opacity-80 disabled:opacity-40"
                    onClick={() =>
                      remove(it.id, {
                        color: it.color ?? undefined,
                        size: it.size ?? undefined,
                      })
                    }
                    disabled={pending}
                  >
                    remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#3E424A]">Items Subtotal</span>
              <span className="font-medium text-[#10151F]">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#3E424A]">Delivery</span>
              <span className="font-medium text-[#10151F]">${delivery.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base pt-2">
              <span className="font-semibold text-[#10151F]">Total</span>
              <span className="font-semibold text-[#10151F]">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6">
            <PayButton />
          </div>
        </div>
      )}
    </div>
  );
}
