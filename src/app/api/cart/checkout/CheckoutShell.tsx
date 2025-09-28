"use client";

import React from "react";
import CheckoutForm from "@/components/checkout/checkoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import SuccessModal from "@/components/checkout/SuccessModal";

type CartItem = {
  id: number;
  name: string;
  cover_image?: string | null;
  price: number;
  quantity: number;
  color?: string | null;
  size?: string | null;
};

export default function CheckoutShell({ initialItems }: { initialItems: CartItem[] }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      if (typeof window !== "undefined") {
        // hard navigation => fresh SSR + empty cart
        window.location.assign("/listing");
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [open]);

  return (
    <div className="w-full">
      <h1 className="text-[42px] font-semibold text-[#10151F]">Checkout</h1>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CheckoutForm onSuccess={() => setOpen(true)} />
        </div>

        <aside className="lg:col-span-1 ">
          <OrderSummary
            initialItems={initialItems.map((item) => ({
              ...item,
              total_price: item.price * item.quantity,
            }))}
          />
        </aside>
      </div>

      <SuccessModal open={open} onClose={() => setOpen(false)} />

    
    </div>
  );
}
