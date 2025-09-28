// components/products/QuantitySelect.tsx
"use client";

import React from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function QuantitySelect({
  value = 1,
  onChange,
  max = 10,
  min = 1,
  className = "",
}: {
  value?: number;
  onChange?: (n: number) => void;
  max?: number;
  min?: number;
  className?: string;
}) {
  const options = Array.from(
    { length: Math.max(0, max - min + 1) },
    (_, i) => min + i
  );

  return (
    <div className={`relative inline-block z-50 ${className}`}>
      <select
        aria-label="Quantity"
        value={value}
        onChange={(e) => onChange?.(Number(e.target.value))}
        className="w-[70px] h-[42px] rounded-[10px] border border-[#E1DFE1]  px-3 pr-8 text-[16px] appearance-none"
      >
        {options.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute top-1/2 left-8 h-4 w-4 -translate-y-1/2 text-slate-900 " />
    </div>
  );
}
