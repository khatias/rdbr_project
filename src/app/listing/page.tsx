import React from "react";
import Card from "@/components/Card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { buildPages } from "@/utils/pagination";

type Product = {
  id: number;
  name: string;
  cover_image: string;
  price: number;
};

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

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page || 1);
  const perPage = 10;

  const res = await fetch(`${API}/products?page=${page}&per_page=${perPage}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="max-w-[1720px] mx-auto mt-10">
        <p className="text-red-600">Failed to load products.</p>
      </div>
    );
  }

  const products = (await res.json()) as Paginated<Product>;

  const totalPages =
    products.meta?.last_page ??
    (products.data.length < perPage ? page : page + 1);

  return (
    <div className="max-w-[1720px] mx-auto mt-10 space-y-8">
      <div className="grid grid-cols-4 gap-6">
        {products.data.map((product) => (
          <Card key={product.id} product={product} />
        ))}
      </div>

      <Pagination
        currentPage={products.meta?.current_page ?? page}
        totalPages={Number(totalPages)}
        basePath="/listing"
      />
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  basePath,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
}) {
  const prevPage = currentPage > 1 ? currentPage - 1 : 1;
  const nextPage = currentPage < totalPages ? currentPage + 1 : totalPages;
  const link = (p: number) => `${basePath}?page=${p}`;

  const pages = buildPages(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center gap-2 mb-20">
      <a
        href={link(prevPage)}
        className={`p-2  ${
          currentPage === 1 ? "pointer-events-none opacity-40" : "hover:bg-gray-50"
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
            className={`px-3 py-1 rounded-sm border ${
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
          currentPage === totalPages ? "pointer-events-none opacity-40" : "hover:bg-gray-50"
        }`}
        aria-label="Next"
      >
        <ArrowRight className="w-5 h-5" />
      </a>
    </div>
  );
}
