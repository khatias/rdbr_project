// ProductClient.tsx (client component coordinating Gallery + PurchaseBox)
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

// Case-insensitive find index
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

  // If cover_image is NOT in product.images, then colors start at gallery[1]
  // If cover_image IS in product.images (duplicate), dedupe removed it -> colors start at gallery[0]
  const coverInImages = (product.images ?? []).includes(product.cover_image);
  const coverOffset = coverInImages ? 0 : 1;

  // Map color -> gallery index (respecting the offset)
  const colorToGalleryIndex = (c?: string | null) => {
    if (!colors.length) return 0;
    const colorIdx = ciFindIndex(colors, c);
    const base = colorIdx >= 0 ? colorIdx : 0;
    const idx = base + coverOffset;
    return Math.min(Math.max(0, idx), Math.max(0, gallery.length - 1));
  };

  // Map gallery index -> color value (reverse)
  const galleryIndexToColor = (i: number): string | undefined => {
    const colorIdx = i - coverOffset;
    if (colorIdx < 0 || colorIdx >= colors.length) return undefined;
    return colors[colorIdx];
  };

  // Initial selection (prefer product.color, else first color)
  const initialIndex = colorToGalleryIndex(product.color ?? colors[0]);
  const [activeIndex, setActiveIndex] = React.useState<number>(initialIndex);

  // Keep PurchaseBox’s selected color in sync with gallery
  const controlledColor = galleryIndexToColor(activeIndex);

  // When user changes swatch -> jump gallery to the matching image
  const handleColorChange = (next?: string) => {
    setActiveIndex(colorToGalleryIndex(next));
  };

  // When user clicks a thumbnail -> update controlledColor by index
  const handleThumbClick = (i: number) => {
    setActiveIndex(i);
  };

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
        />
      </div>
    </div>
  );
}
