// components/cart/CartContext.tsx
"use client";

import React from "react";

export type CartItem = {
  id: number;
  name: string;
  cover_image?: string | null;
  price: number;
  total_price: number;
  quantity: number;
  brand?: { id: number; name: string; image?: string | null };
  color?: string | null;
  size?: string | null;
};

type CartCtx = {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  reload: () => Promise<void>;
  add: (
    productId: number,
    payload: { quantity: number; color?: string | null; size?: string | null }
  ) => Promise<void>;
  updateQty: (
    productId: number,
    quantity: number,
    opts: { color?: string | null; size?: string | null }
  ) => Promise<void>;
  remove: (
    productId: number,
    opts: { color?: string | null; size?: string | null }
  ) => Promise<void>;
  error: string | null;
  pending: boolean;
  subtotal: number;
};

const Ctx = React.createContext<CartCtx | null>(null);

const norm = (v?: string | null) =>
  typeof v === "string" ? v.trim().toLowerCase() : "";

function normalizeItem(it: unknown): CartItem {
  const item = it as Partial<CartItem>;
  return {
    id: item.id as number,
    name: (item.name as string) ?? "",
    cover_image: item.cover_image ?? null,
    price: (item.price as number) ?? 0,
    total_price: (item.total_price as number) ?? 0,
    quantity: (item.quantity as number) ?? 0,
    brand: item.brand,
    color: typeof item?.color === "string" ? item.color : null,
    size: typeof item?.size === "string" ? item.size : null,
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [isOpen, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);

  const reload = React.useCallback(async () => {
    setError(null);
    const res = await fetch("/api/cart", { cache: "no-store" });
    const data = await res.json();
    if (!res.ok) {
      setItems([]);
      setError(data?.message || `HTTP ${res.status}`);
      return;
    }
    const normalized = Array.isArray(data) ? data.map(normalizeItem) : [];
    setItems(normalized);
  }, []);

  React.useEffect(() => {
    reload();
  }, [reload]);

  async function add(
    productId: number,
    payload: { quantity: number; color?: string | null; size?: string | null }
  ) {
    setPending(true);
    setError(null);
    try {
      const body: Record<string, unknown> = { quantity: payload.quantity };
      if (payload.color && payload.color.trim()) body.color = payload.color;
      if (payload.size && payload.size.trim()) body.size = payload.size;

      const res = await fetch(`/api/cart/products/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
      setOpen(true);
      await reload();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to add to cart");
    } finally {
      setPending(false);
    }
  }

  // Core trick: rebuild product's variants so only the targeted (color,size) is changed.
  async function rebuildProductVariants(
    productId: number,
    variants: Array<{
      color?: string | null;
      size?: string | null;
      quantity: number;
    }>
  ) {
    // 1) clear all variants for this product
    const del = await fetch(`/api/cart/products/${productId}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });
    if (!del.ok && del.status !== 204) {
      let msg = `HTTP ${del.status}`;
      try {
        const d = await del.json();
        msg = d?.message || msg;
      } catch {}
      throw new Error(msg);
    }

    // 2) re-add each variant with its individual quantity
    for (const v of variants) {
      if (v.quantity <= 0) continue;
      const body: Record<string, unknown> = { quantity: v.quantity };
      if (v.color && v.color.trim()) body.color = v.color;
      if (v.size && v.size.trim()) body.size = v.size;

      const res = await fetch(`/api/cart/products/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(
          typeof data === "object" && data !== null && "message" in data
            ? (data as { message?: string }).message
            : `HTTP ${res.status}`
        );
    }
  }

  async function updateQty(
    productId: number,
    quantity: number,
    opts: { color?: string | null; size?: string | null }
  ) {
    const nextQty = Math.max(1, Math.min(10, quantity));
    setPending(true);
    setError(null);
    try {
      const siblings = items.filter((it) => it.id === productId);
      const variants = siblings.map((v) => {
        const isTarget =
          norm(v.color) === norm(opts.color) &&
          norm(v.size) === norm(opts.size);
        return {
          color: v.color,
          size: v.size,
          quantity: isTarget ? nextQty : v.quantity,
        };
      });

      await rebuildProductVariants(productId, variants);
      await reload();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update quantity");
    } finally {
      setPending(false);
    }
  }

  async function remove(
    productId: number,
    opts: { color?: string | null; size?: string | null }
  ) {
    setPending(true);
    setError(null);
    try {
      const siblings = items.filter((it) => it.id === productId);
      const variants = siblings
        .filter(
          (v) =>
            !(
              norm(v.color) === norm(opts.color) &&
              norm(v.size) === norm(opts.size)
            )
        )
        .map((v) => ({ color: v.color, size: v.size, quantity: v.quantity }));

      await rebuildProductVariants(productId, variants);
      await reload();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to remove item");
    } finally {
      setPending(false);
    }
  }

  return (
    <Ctx.Provider
      value={{
        items,
        isOpen,
        open: () => setOpen(true),
        close: () => setOpen(false),
        reload,
        add,
        updateQty,
        remove,
        error,
        pending,
        subtotal,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
