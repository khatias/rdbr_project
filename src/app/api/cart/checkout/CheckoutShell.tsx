// components/checkout/CheckoutShell.tsx
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

  return (
    <div className="mx-40">
      <h1 className="text-[42px] font-semibold text-[#10151F]">Checkout</h1>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Left: form (2/3) */}
        <div className="lg:col-span-2">
          {/* CheckoutForm must call onSuccess() after successful POST */}
          <CheckoutForm onSuccess={() => setOpen(true)} />
        </div>

        {/* Right: order summary (1/3) */}
        <aside className="lg:col-span-1 rounded-lg border border-[#E1DFE1] p-6">
          <OrderSummary initialItems={initialItems} />
        </aside>
      </div>

      <SuccessModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
