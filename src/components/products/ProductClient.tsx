// ProductClient.tsx
"use client";

import React from "react";
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
  // from your API:
  total_price?: number;
  quantity?: number; // total stock across all variants
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
  const rawImages = [product.cover_image, ...(product.images ?? [])].filter(
    Boolean
  );
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

  // If API gives product.color = "Color 2" (not in available_colors),
  // we safely fall back to the first color.
  const initialIndex = colorToGalleryIndex(product.color ?? colors[0]);
  const [activeIndex, setActiveIndex] = React.useState<number>(initialIndex);

  const controlledColor = galleryIndexToColor(activeIndex);

  const handleColorChange = (next?: string) => {
    setActiveIndex(colorToGalleryIndex(next));
  };

  const handleThumbClick = (i: number) => setActiveIndex(i);

  // ✅ Global stock (no per-variant). If quantity is undefined, we treat as unlimited.
  const getStock = React.useCallback(() => {
    const q = product.quantity;
    if (typeof q === "number" && Number.isFinite(q))
      return Math.max(0, Math.floor(q));
    return undefined; // PurchaseBox will treat as unlimited
  }, [product.quantity]);
  console.log(product.quantity);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <Gallery
        images={gallery}
        alt={product.name}
        height={600}
        activeIndex={activeIndex}
        onChangeIndex={handleThumbClick}
      />

      <div className="flex flex-col gap-14">
        <div className="text-3xl font-semibold text-[#10151F] flex flex-col gap-5">
          <h1>{product.name}</h1>
          <p>${product.price}</p>
        </div>

        <PurchaseBox
          productId={product.id}
          colors={colors}
          sizes={product.available_sizes ?? []}
          initialColor={controlledColor ?? colors[0]} // seed swatch
          controlledColor={controlledColor} // keep swatch in sync with gallery
          onColorChange={handleColorChange}
          currentImageUrl={gallery[activeIndex]}
          getStock={getStock} // ← global stock
        />
      </div>
    </div>
  );
}
