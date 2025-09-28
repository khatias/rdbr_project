"use client";

import React from "react";
import QuantitySelect from "@/components/products/QuantitySelect";

export default function QtyPicker({
  value,
  onChange,
  max = 10,
  min = 1,
  label = "Quantity",
  className = "",
}: {
  value?: number;
  onChange?: (n: number) => void;
  max?: number;
  min?: number;
  label?: string;
  className?: string;
}) {
  const [internal, setInternal] = React.useState<number>(value ?? min);
  const controlled =
    typeof value === "number" && typeof onChange === "function";

  const qty = controlled ? (value as number) : internal;
  const setQty = controlled ? (onChange as (n: number) => void) : setInternal;

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <span className="text-sm text-slate-600">{label}</span>
      <QuantitySelect value={qty} onChange={setQty} max={max} min={min} />
    </div>
  );
}
