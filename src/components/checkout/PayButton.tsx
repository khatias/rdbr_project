// components/checkout/PayButton.tsx
"use client";

import React from "react";

export default function PayButton({ formId = "checkout-form" }: { formId?: string }) {
  return (
    <button
      type="submit"
      form={formId}
      className="w-full inline-block text-center bg-[#FF4000] text-white text-[18px] font-medium px-6 py-4 rounded-[10px] hover:bg-[#e03e00]"
    >
      Pay
    </button>
  );
}
