"use client";

import React from "react";
import ColorSwatches from "@/components/ColorSwatches";
import SizeSwatches from "@/components/products/SizeSwatches";
import QtyPicker from "@/components/products/QtyPicker";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/components/cart/CartContext";

const DEFAULT_SIZE = "S";

export default function PurchaseBox({
  productId,
  colors = [],
  sizes = [],
  initialColor,
  initialSize,
}: {
  productId: number;
  colors?: string[];
  sizes?: string[] | null;
  initialColor?: string;
  initialSize?: string;
}) {
  const { add, pending } = useCart();

  const [color, setColor] = React.useState<string | undefined>(
    typeof initialColor === "string" && initialColor.trim()
      ? initialColor
      : undefined
  );
  const [size, setSize] = React.useState<string | undefined>(
    typeof initialSize === "string" && initialSize.trim()
      ? initialSize
      : undefined
  );
  const [qty, setQty] = React.useState<number>(1);

  const hasSizes = Array.isArray(sizes) && sizes.length > 0;
  const hasColors = Array.isArray(colors) && colors.length > 0;

  const canSubmit = qty > 0 && (!hasColors || !!color) && (!hasSizes || !!size);

  function resolveSizeToSend(): string {
    if (hasSizes) {
      if (size) {
        const match =
          sizes!.find(
            (s) => s.trim().toLowerCase() === size.trim().toLowerCase()
          ) ?? null;
        if (match) return match;
      }

      return sizes![0];
    }

    return DEFAULT_SIZE;
  }

  async function onAdd() {
    if (!canSubmit) return;

    const payload: { quantity: number; color?: string; size: string } = {
      quantity: qty,
      size: resolveSizeToSend(),
    };
    if (hasColors && color) payload.color = color;

    await add(productId, payload);
  }

  return (
    <div className="space-y-14">
      {hasColors ? (
        <section>
          <ColorSwatches colors={colors} value={color} onChange={setColor} />
        </section>
      ) : null}

      {hasSizes ? (
        <section>
          <SizeSwatches
            sizes={sizes as string[]}
            value={size}
            onChange={setSize}
          />
        </section>
      ) : null}

      <section>
        <QtyPicker value={qty} onChange={setQty} max={10} />
      </section>

      <button
        type="button"
        onClick={onAdd}
        disabled={!canSubmit || pending}
        className={`w-full inline-flex items-center justify-center gap-2 text-[18px] px-6 py-4   rounded-[10px] font-medium text-white ${
          !canSubmit || pending
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#FF4000] hover:bg-[#e03e00]"
        }`}
      >
        <ShoppingCartIcon className="h-5 w-5" />
        {pending ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
}
