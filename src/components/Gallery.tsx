// components/Gallery.tsx
"use client";

import React from "react";
import Image from "next/image";

type Props = {
  images: string[];
  alt?: string;
  className?: string;
  height?: number;
  /** Controlled index of the main image */
  activeIndex?: number;
  /** Change handler when thumbnails are clicked */
  onChangeIndex?: (index: number) => void;
};

export default function Gallery({
  images,
  alt = "Product image",
  className,
  height = 930,
  activeIndex,
  onChangeIndex,
}: Props) {
  const [internal, setInternal] = React.useState(0);

  // If parent controls it, use that; otherwise fall back to internal state.
  const active = typeof activeIndex === "number" ? activeIndex : internal;

  if (!images?.length) {
    return (
      <div className={className}>
        <div
          className="relative w-full rounded-2xl border border-dashed border-slate-200"
          style={{ height }}
        />
      </div>
    );
  }

  const main = images[active] ?? images[0];

  function handleThumb(i: number) {
    if (onChangeIndex) onChangeIndex(i);
    else setInternal(i);
  }

  return (
    <div className={className}>
      <div className="flex gap-6">
        <div className="flex flex-col gap-2" style={{ ["--g-h" as string]: `${height}px` }}>
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              onClick={() => handleThumb(i)}
              className={`relative shrink-0 w-[121px] h-[161px] overflow-hidden rounded-md border ${
                i === active ? "border-gray-900" : "border-transparent"
              }`}
              aria-label={`Show image ${i + 1}`}
              type="button"
            >
              <Image src={src} alt={`${alt} ${i + 1}`} fill className="object-cover" sizes="121px" />
            </button>
          ))}
        </div>

        <div className="relative w-full overflow-hidden rounded-xl" style={{ height }}>
          <Image
            src={main}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 730px"
            priority
          />
        </div>
      </div>
    </div>
  );
}
