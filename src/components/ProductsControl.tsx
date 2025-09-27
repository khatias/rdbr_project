// components/ProductsControl.tsx
"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

export default function ProductsControl() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [min, setMin] = React.useState(sp.get("filter[price_from]") || "");
  const [max, setMax] = React.useState(sp.get("filter[price_to]") || "");
  const [sort, setSort] = React.useState(sp.get("sort") || "-created_at");

  const [openFilter, setOpenFilter] = React.useState(false);
  const [openSort, setOpenSort] = React.useState(false);

  function updateParams(next: Record<string, string | undefined>) {
    const params = new URLSearchParams(sp.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  function applyFilter() {
    updateParams({
      "filter[price_from]": min || undefined,
      "filter[price_to]": max || undefined,
    });
    setOpenFilter(false);
  }

  function clearFilter() {
    setMin("");
    setMax("");
    updateParams({
      "filter[price_from]": undefined,
      "filter[price_to]": undefined,
    });
    setOpenFilter(false);
  }

  function pickSort(value: string) {
    setSort(value);
    updateParams({ sort: value });
    setOpenSort(false);
  }

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      const t = e.target as HTMLElement;
      if (!t.closest?.("[data-dd=filter]")) setOpenFilter(false);
      if (!t.closest?.("[data-dd=sort]")) setOpenSort(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const sortLabel =
    sort === "price"
      ? "Price, Low  to High"
      : sort === "-price"
      ? "Price,  High to Low"
      : "New Product first";

  return (
    <div className="flex items-center gap-3">
      <div className="relative" data-dd="filter">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={openFilter}
          onClick={() => {
            setOpenFilter((v) => !v);
            setOpenSort(false);
          }}
          className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm"
        >
          <AdjustmentsHorizontalIcon className="h-5 w-5" />
          <span className="text-[16px]">Filter</span>
        </button>

        {openFilter && (
          <div className="absolute z-20 mt-2 w-[260px] rounded-md border border-slate-200 bg-white p-3">
            <p className="mb-2 text-[16px] font-semibold">Select Price</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") applyFilter();
                    if (e.key === "Escape") setOpenFilter(false);
                  }}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="h-9 w-full rounded-md border border-slate-200 px-2 text-sm"
                  placeholder="from"
                />
              </div>
              <div>
                <input
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") applyFilter();
                    if (e.key === "Escape") setOpenFilter(false);
                  }}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="h-9 w-full rounded-md border border-slate-200 px-2 text-sm"
                  placeholder="to"
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={clearFilter}
                className="text-sm text-slate-600 underline"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={applyFilter}
                className="h-9 rounded-md bg-orange-600 px-3 text-sm font-medium text-white"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="relative" data-dd="sort">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={openSort}
          onClick={() => {
            setOpenSort((v) => !v);
            setOpenFilter(false);
          }}
          className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm"
        >
          <span className="text-[16px]">{sortLabel}</span>
          <ChevronDownIcon className="h-5 w-5" />
        </button>

        {openSort && (
          <div className="absolute z-20 mt-2 min-w-[220px] rounded-md border border-slate-200 bg-white p-1">
            <button
              onClick={() => pickSort("-created_at")}
              className={`block w-full rounded-sm px-3 py-2 text-left text-sm ${
                sort === "-created_at"
                  ? "bg-slate-100 font-medium cursor-default"
                  : "hover:bg-slate-50"
              }`}
            >
              New Product first
            </button>
            <button
              onClick={() => pickSort("price")}
              className={`block w-full rounded-sm px-3 py-2 text-left text-sm ${
                sort === "price"
                  ? "bg-slate-100 font-medium cursor-default"
                  : "hover:bg-slate-50"
              }`}
            >
              Price low to high
            </button>
            <button
              onClick={() => pickSort("-price")}
              className={`block w-full rounded-sm px-3 py-2 text-left text-sm ${
                sort === "-price"
                  ? "bg-slate-100 font-medium cursor-default"
                  : "hover:bg-slate-50"
              }`}
            >
              Price high to low
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
