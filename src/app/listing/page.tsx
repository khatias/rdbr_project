// app/listing/page.tsx
import React from "react";
import Card from "@/components/Card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProductsControl from "@/components/ProductsControl";
import Link from "next/link";
type Product = { id: number; name: string; cover_image: string; price: number };
type Paginated<T> = {
  data: T[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

const API = "https://api.redseam.redberryinternship.ge/api";

function buildPages(
  currentPage: number,
  totalPages: number
): (number | "...")[] {
  if (!Number.isFinite(totalPages) || totalPages <= 0) return [];
  if (totalPages <= 7)
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  const windowStart = Math.max(2, currentPage - 1);
  const windowEnd = Math.min(totalPages - 1, currentPage + 1);
  const items: (number | "...")[] = [1];
  if (windowStart > 2) items.push("...");
  for (let p = windowStart; p <= windowEnd; p++) items.push(p);
  if (windowEnd < totalPages - 1) items.push("...");
  items.push(totalPages);
  return items;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const page = Number(sp.page || 1);
  const sort = ((sp.sort as string) || "-created_at") as string;
  const min = (sp["filter[price_from]"] as string) || "";
  const max = (sp["filter[price_to]"] as string) || "";

  const qs = new URLSearchParams();
  qs.set("page", String(page));
  if (min) qs.set("filter[price_from]", min);
  if (max) qs.set("filter[price_to]", max);
  if (sort) qs.set("sort", sort);

  let payload: Paginated<Product> | null = null;
  let errorText = "";
  let status = 0;

  try {
    const res = await fetch(`${API}/products?${qs.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    status = res.status;
    const raw = await res.text();
    const isJSON = (res.headers.get("content-type") || "").includes(
      "application/json"
    );
    const data = isJSON && raw ? JSON.parse(raw) : { message: raw || "" };
    if (!res.ok) {
      errorText = data?.message || `HTTP ${status}`;
    } else {
      payload = data as Paginated<Product>;
    }
  } catch (e: unknown) {
    errorText = e instanceof Error ? e.message : "Network error";
  }

  if (!payload) {
    return (
      <div className="max-w-[1720px] mx-auto mt-10 space-y-2">
        <p className="text-red-600">Failed to load products.</p>
        {errorText ? (
          <pre className="text-xs text-slate-600 whitespace-pre-wrap">
            {errorText}
          </pre>
        ) : null}
        {status ? (
          <p className="text-xs text-slate-500">Status: {status}</p>
        ) : null}
      </div>
    );
  }

  const currentPage = payload.meta?.current_page ?? page;
  const totalPages =
    payload.meta?.last_page ??
    (payload.data.length < 12 ? currentPage : currentPage + 1);

  return (
    <div className="max-w-[1720px] mx-auto px-10 mt-10 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-[42px] font-semibold">Products</h2>
        <ProductsControl />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {payload.data.map((product) => (
          <Link
            key={product.id}
            href={`/listing/${product.id}`}
            className="block"
            aria-label={`View ${product.name}`}
          >
            <Card product={product} />
          </Link>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={Number(totalPages)}
        basePath="/listing"
        searchParams={sp}
      />
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const prevPage = currentPage > 1 ? currentPage - 1 : 1;
  const nextPage = currentPage < totalPages ? currentPage + 1 : totalPages;

  const link = (p: number) => {
    const params = new URLSearchParams();
    params.set("page", String(p));
    const min = searchParams["filter[price_from]"];
    const max = searchParams["filter[price_to]"];
    const sort = searchParams["sort"];
    if (typeof min === "string") params.set("filter[price_from]", min);
    if (typeof max === "string") params.set("filter[price_to]", max);
    if (typeof sort === "string") params.set("sort", sort);
    return `${basePath}?${params.toString()}`;
  };

  const pages = buildPages(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center gap-2">
      <a
        href={link(prevPage)}
        className={`p-2 rounded-lg ${
          currentPage === 1
            ? "pointer-events-none opacity-40"
            : "hover:bg-gray-50"
        }`}
        aria-label="Previous"
      >
        <ArrowLeft className="w-5 h-5" />
      </a>

      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={`dots-${idx}`} className="px-2 text-slate-400 select-none">
            …
          </span>
        ) : (
          <a
            key={p}
            href={link(p)}
            className={`px-3 py-2 rounded-lg border ${
              p === currentPage
                ? "border-orange-600 text-orange-600"
                : "border-slate-200 hover:bg-gray-50"
            }`}
          >
            {p}
          </a>
        )
      )}

      <a
        href={link(nextPage)}
        className={`p-2 rounded-lg ${
          currentPage === totalPages
            ? "pointer-events-none opacity-40"
            : "hover:bg-gray-50"
        }`}
        aria-label="Next"
      >
        <ArrowRight className="w-5 h-5" />
      </a>
    </div>
  );
}
