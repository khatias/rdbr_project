"use client";

import React from "react";
import Image from "next/image";
import Gallery from "@/components/Gallery";
import PurchaseBox from "@/components/products/PurchaseBox";

type Brand = { id: number; name: string; image?: string | null };
type Product = {
  id: number;
  name: string;
  price: number;
  description?: string | null;
  cover_image: string;
  images?: string[];
  available_colors?: string[] | null;
  available_sizes?: string[] | null;
  brand?: Brand;
  color?: string | null;
  size?: string | null;
  total_price?: number;
  quantity?: number;
};

function dedupeUrls(arr: string[]) {
  const seen = new Set<string>();
  return arr.filter((u) => {
    const key = String(u || "").trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const ciFindIndex = (arr: string[], value?: string | null) => {
  if (!value) return -1;
  const needle = value.toLowerCase();
  return arr.findIndex((x) => String(x).toLowerCase() === needle);
};

export default function ProductClient({ product }: { product: Product }) {
  const colors = (product.available_colors ?? []).map(String);
  const rawImages = [product.cover_image, ...(product.images ?? [])].filter(Boolean);
  const gallery = dedupeUrls(rawImages);

  const coverInImages = (product.images ?? []).includes(product.cover_image);
  const coverOffset = coverInImages ? 0 : 1;

  const colorToGalleryIndex = (c?: string | null) => {
    if (!colors.length) return 0;
    const colorIdx = ciFindIndex(colors, c);
    const base = colorIdx >= 0 ? colorIdx : 0;
    const idx = base + coverOffset;
    return Math.min(Math.max(0, idx), Math.max(0, gallery.length - 1));
  };

  const galleryIndexToColor = (i: number): string | undefined => {
    const colorIdx = i - coverOffset;
    if (colorIdx < 0 || colorIdx >= colors.length) return undefined;
    return colors[colorIdx];
  };

  const initialIndex = colorToGalleryIndex(product.color ?? colors[0]);
  const [activeIndex, setActiveIndex] = React.useState<number>(initialIndex);

  const controlledColor = galleryIndexToColor(activeIndex);

  const handleColorChange = (next?: string) => setActiveIndex(colorToGalleryIndex(next));
  const handleThumbClick = (i: number) => setActiveIndex(i);

  const getStock = React.useCallback(() => {
    const q = product.quantity;
    if (typeof q === "number" && Number.isFinite(q)) return Math.max(0, Math.floor(q));
    return undefined;
  }, [product.quantity]);

  return (
    <div className="grid grid-cols-2 justify-between w-full">
      <Gallery
        images={gallery}
        alt={product.name}
        activeIndex={activeIndex}
        onChangeIndex={handleThumbClick}
      />
      <div className="flex flex-col gap-8">
        <div className="text-3xl font-semibold text-[#10151F] flex flex-col gap-5">
          <h1>{product.name}</h1>
          <p>${product.price}</p>
        </div>
        <div className="pb-8 border-b border-[#E1DFE1]">
          <PurchaseBox
            productId={product.id}
            colors={colors}
            sizes={product.available_sizes ?? []}
            initialColor={controlledColor ?? colors[0]}
            controlledColor={controlledColor}
            onColorChange={handleColorChange}
            currentImageUrl={gallery[activeIndex]}
            getStock={getStock}
          />
        </div>
        {product.brand ? (
          <div className="mt-2">
            {product.brand.image ? (
              <div className="flex w-full items-center justify-between">
                <p className="font-medium text-xl">Details</p>
                <div className="relative w-[109px] h-[61px]">
                  <Image
                    src={product.brand.image}
                    alt={product.brand.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            ) : null}
            <div className="mt-4">
              <div className="flex text-[16px] text-[#3E424A]">
                <p>
                  <span>Brand: </span>
                  {product.brand.name}
                </p>
              </div>
            </div>
          </div>
        ) : null}
        {product.description ? (
          <p className="mt-2 text-slate-700 leading-relaxed">{product.description}</p>
        ) : null}
      </div>
    </div>
  );
}
