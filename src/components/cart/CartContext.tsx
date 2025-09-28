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
  color?: string | null; // may be null from API
  size?: string | null;  // may be null from API
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
  error: string | null;
  pending: boolean;
  subtotal: number;
};

const Ctx = React.createContext<CartCtx | null>(null);

// helper: keep only non-empty strings (avoid sending null/undefined)
function cleanVariantFields(p: { quantity: number; color?: string | null; size?: string | null }) {
  const out: { quantity: number; color?: string; size?: string } = { quantity: p.quantity };
  if (typeof p.color === "string" && p.color.trim() !== "") out.color = p.color;
  if (typeof p.size === "string" && p.size.trim() !== "") out.size = p.size;
  return out;
}

// helper: normalize API item so UI never crashes on nulls
function normalizeItem(it: unknown): CartItem {
  const item = it as Partial<CartItem>;
  return {
    ...item,
    color: typeof item?.color === "string" ? item.color : null,
    size: typeof item?.size === "string" ? item.size : null,
  } as CartItem;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [isOpen, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);

  const reload = React.useCallback(async () => {
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
      const normalized = Array.isArray(data) ? data.map(normalizeItem) : [];
      setItems(normalized);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load cart");
    } finally {
      setPending(false);
    }
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
      // don’t send nulls to backend
      const body = cleanVariantFields(payload);

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

      setOpen(true);     // open immediately
      await reload();    // then refresh cart
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to add to cart");
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
