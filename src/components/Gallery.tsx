// components/Gallery.tsx
"use client";

import React from "react";
import Image from "next/image";

type Props = {
  images: string[];
  alt?: string;
  className?: string;
  height?: number; // optional, default 560
};

export default function Gallery({
  images,
  alt = "Product image",
  className,
  height = 930,
}: Props) {
  const [active, setActive] = React.useState(0);

  if (!images?.length) {
    return (
      <div className={className}>
        <div className="relative w-full rounded-2xl border border-dashed border-slate-200" style={{ height }} />
      </div>
    );
  }

  const main = images[active] ?? images[0];

  return (
    <div className={className}>
      <div className="flex gap-6">
        <div
          className="flex flex-col gap-2 "
          style={{ ["--g-h" as string]: `${height}px` }}
        >
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              onClick={() => setActive(i)}
              className="relative shrink-0 w-[121px] h-[161px] overflow-hidden"
               
              aria-label={`Show image ${i + 1}`}
            >
              <Image src={src} alt={`${alt} ${i + 1}`} fill className="object-cover" sizes="84px" />
            </button>
          ))}
        </div>

        <div
          className="relative w-full  overflow-hidden   "
          style={{ height }}
        >
          <Image
            src={main}
            alt={alt}
            fill
            className="object-cover"
            sizes="(width: 730px) 100vw, 600px height: "
            priority
          />
        </div>
      </div>
    </div>
  );
}
