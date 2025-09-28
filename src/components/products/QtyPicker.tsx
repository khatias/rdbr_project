"use client";

import React from "react";
import QuantitySelect from "@/components/products/QuantitySelect";

export default function QtyPicker({ max = 10 }: { max?: number }) {
  const [qty, setQty] = React.useState(1);
  return (
    <div className="flex flex-col gap-3">
      <span className="text-[16px] text-[#10151F]">Quantity</span>
      <QuantitySelect value={qty} onChange={setQty} max={max} />
    </div>
  );
}
