// components/SizeSwatches.tsx
"use client";

import React from "react";

function normalizeSize(s: string) {
  const key = s.trim().toLowerCase();
  const map: Record<string, string> = {
    xsmall: "XS",
    xs: "XS",
    small: "S",
    s: "S",
    medium: "M",
    m: "M",
    large: "L",
    l: "L",
    xlarge: "XL",
    xl: "XL",
    "2xl": "2XL",
    xxl: "2XL",
    "3xl": "3XL",
  };
  return map[key] ?? s.toUpperCase();
}

export default function SizeSwatches({
  sizes,
  value,
  onChange,
}: {
  sizes: string[];
  value?: string;
  onChange?: (size: string) => void;
}) {
  const [selected, setSelected] = React.useState<string | undefined>(value);
  React.useEffect(() => setSelected(value), [value]);

  const pick = (v: string) => {
    setSelected(v);
    onChange?.(v);
  };

  if (!sizes?.length) return null;

  return (
    <div className="space-y-4">
      <div className="text-[16px] text-[#10151F]">
        Size: <span>{selected ?? "None"}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => {
          const isSel = selected?.toLowerCase() === s.toLowerCase();
          return (
            <button
              key={s}
              type="button"
              onClick={() => pick(s)}
              aria-pressed={isSel}
              className={`cursor-pointer inline-flex items-center justify-center w-[70px] h-[42px] px-4 py-[9px] rounded-[10px] text-[16px] border border-[#E1DFE1] transition
                ${
                  isSel
                    ? "border-black  bg-[#F8F6F7]"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              title={s}
            >
              {normalizeSize(s)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
