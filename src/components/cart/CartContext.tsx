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
};

type CartCtx = {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  reload: () => Promise<void>;
  add: (
    productId: number,
    payload: { quantity: number; color?: string; size?: string }
  ) => Promise<void>;
  error: string | null;
  pending: boolean;
  subtotal: number;
};

const Ctx = React.createContext<CartCtx | null>(null);

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
      setItems(Array.isArray(data) ? data : []);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to load cart");
      }
    } finally {
      setPending(false);
    }
  }, []);

  React.useEffect(() => {
    reload();
  }, [reload]);

  async function add(
    productId: number,
    payload: { quantity: number; color?: string; size?: string }
  ) {
    setPending(true);
    setError(null);
    try {
      const res = await fetch(`/api/cart/products/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
      await reload();
      setOpen(true);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to add to cart";
      setError(message);
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
