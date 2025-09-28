// app/checkout/page.tsx
import React from "react";
import Link from "next/link";
import { headers, cookies } from "next/headers";
import CheckoutShell from "../api/cart/checkout/CheckoutShell";

type CartItem = {
  id: number;
  name: string;
  cover_image?: string | null;
  price: number;
  quantity: number;
  color?: string | null;
  size?: string | null;
};

async function absUrl(path: string) {
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  if (!host) throw new Error("Missing host header");
  return `${proto}://${host}${path}`;
}


async function cookieHeader() {
  const store = await cookies();
  const all = store.getAll();
  return all.map(({ name, value }) => `${name}=${value}`).join("; ");
}

async function getCart(): Promise<
  CartItem[] | { message: string; status: number }
> {
  const res = await fetch(await absUrl("/api/cart"), {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Cookie: await cookieHeader(),
    },
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      message: (data as { message?: string })?.message || "Failed to load cart",
      status: res.status,
    };
  }
  return Array.isArray(data) ? (data as CartItem[]) : [];
}

export default async function CheckoutPage() {
  const data = await getCart();

  if (!Array.isArray(data)) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold text-[#10151F]">Checkout</h1>
        <div className="mt-6 rounded-lg border border-[#E1DFE1] p-6">
          <p className="text-red-600 mb-4">{data.message}</p>
          <Link
            href="/login"
            className="inline-block rounded-md bg-[#FF4000] px-4 py-2 text-white hover:bg-[#e03e00]"
          >
            Log in to continue
          </Link>
        </div>
      </div>
    );
  }

  return <CheckoutShell initialItems={data} />;
}
