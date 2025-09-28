"use client";

import React from "react";
import ColorSwatches from "@/components/ColorSwatches";
import SizeSwatches from "@/components/products/SizeSwatches";
import QtyPicker from "@/components/products/QtyPicker";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/components/cart/CartContext";

const DEFAULT_SIZE = "S";

type GetStockArgs = { color?: string; size?: string };

export default function PurchaseBox({
  productId,
  colors = [],
  sizes = [],
  initialColor,
  initialSize,
  currentImageUrl,
  controlledColor,
  onColorChange,
  getStock,
}: {
  productId: number;
  colors?: string[];
  sizes?: string[] | null;
  initialColor?: string;
  initialSize?: string;
  controlledColor?: string;
  currentImageUrl?: string;
  onColorChange?: (color: string | undefined) => void;
  getStock?: (args: GetStockArgs) => number | undefined;
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

  const effectiveColor = controlledColor ?? color;

  const rawAvailable = getStock?.({ color: effectiveColor, size });
  const availableQty = Number.isFinite(rawAvailable as number)
    ? Math.max(0, Math.floor(rawAvailable as number))
    : Infinity;

  const uiMax = Number.isFinite(availableQty) ? Math.max(1, availableQty) : 10;

  const isOutOfStock = availableQty <= 0;

  React.useEffect(() => {
    setQty((q) => Math.min(Math.max(1, q), uiMax));
  }, [uiMax]);

  const canSubmit =
    qty > 0 &&
    qty <= (Number.isFinite(availableQty) ? (availableQty as number) : qty) &&
    (!hasColors || !!effectiveColor) &&
    (!hasSizes || !!size) &&
    !pending &&
    !isOutOfStock;

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

  function handleColor(next?: string) {
    onColorChange?.(next);
    setColor(next);
  }

  async function onAdd() {
    if (!canSubmit) return;

    const payload: {
      quantity: number;
      size: string;
      color?: string;
      image?: string;
    } = {
      quantity: Math.min(
        qty,
        Number.isFinite(availableQty) ? (availableQty as number) : qty
      ),
      size: resolveSizeToSend(),
    };

    if (hasColors && effectiveColor) payload.color = effectiveColor;
    if (currentImageUrl) payload.image = currentImageUrl;

    await add(productId, payload);
  }

  return (
    <div className="space-y-14">
      {hasColors ? (
        <section>
          <ColorSwatches
            colors={colors}
            value={effectiveColor}
            onChange={handleColor}
          />
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
        <QtyPicker value={qty} onChange={setQty} max={uiMax} />
      </section>

      <button
        type="button"
        onClick={onAdd}
        disabled={!canSubmit || pending}
        className={`w-full inline-flex items-center justify-center gap-2 text-[18px] px-6 py-4 rounded-[10px] font-medium text-white ${
          !canSubmit || pending
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#FF4000] hover:bg-[#e03e00]"
        }`}
      >
        <ShoppingCartIcon className="h-5 w-5" />
        {pending ? "Adding..." : isOutOfStock ? "Out of stock" : "Add to Cart"}
      </button>
      
    </div>
    
  );
}
