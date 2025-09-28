// components/checkout/checkoutForm.tsx
"use client";

import React from "react";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

export default function CheckoutForm({ onSuccess }: { onSuccess?: () => void }) {
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      surname: String(fd.get("surname") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      address: String(fd.get("address") || ""),
      zip_code: String(fd.get("zip_code") || ""),
    };

    try {
      const res = await fetch("/api/cart/checkout", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      id="checkout-form"
      onSubmit={onSubmit}
      className="space-y-5 bg-[#F8F6F7] rounded-[16px] px-[47px] min-h-[635px]"
    >
      <h2 className="text-[22px] font-medium text-[#3E424A] pt-12">Order details</h2>

      <div className="w-[578px] flex justify-between">
        <input name="name" className="h-10 rounded-[8px] border border-[#E1DFE1] bg-white px-3 w-[277px] text-[14px] leading-5 text-[#3E424A] placeholder:text-[#3E424A]" required type="text" placeholder="Name" disabled={pending} />
        <input name="surname" className="h-10 rounded-[8px] border border-[#E1DFE1] bg-white px-3 w-[277px] text-[14px] leading-5 text-[#3E424A] placeholder:text-[#3E424A]" required type="text" placeholder="Surname" disabled={pending} />
      </div>

      <div className="relative">
        <EnvelopeIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none stroke-2" />
        <input name="email" type="email" className="h-10 rounded-[8px] border border-[#E1DFE1] bg-white pl-10 pr-3 min-w-[578px] text-[14px] leading-5 text-[#3E424A] placeholder:text-[#3E424A]" placeholder="Email" required disabled={pending} />
      </div>

      <input name="phone" type="tel" className="h-10 rounded-[8px] border border-[#E1DFE1] bg-white px-3 min-w-[578px] text-[14px] leading-5 text-[#3E424A] placeholder:text-[#3E424A]" placeholder="Phone" required disabled={pending} />

      <div className="w-[578px] flex justify-between">
        <input name="address" className="h-10 rounded-[8px] border border-[#E1DFE1] bg-white px-3 w-[277px] text-[14px] leading-5 text-[#3E424A] placeholder:text-[#3E424A]" required type="text" placeholder="Address" disabled={pending} />
        <input name="zip_code" className="h-10 rounded-[8px] border border-[#E1DFE1] bg-white px-3 w-[277px] text-[14px] leading-5 text-[#3E424A] placeholder:text-[#3E424A]" type="text" placeholder="Zip Code" disabled={pending} />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button type="submit" className="hidden" />
    </form>
  );
}
