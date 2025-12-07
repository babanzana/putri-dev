"use client";

import { onValue, ref } from "firebase/database";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { db } from "../lib/firebase";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthProvider";
import type { Product } from "../lib/dummyData";

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  selected: boolean;
  stock: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (slug: string, qty?: number) => void;
  updateQty: (slug: string, qty: number) => void;
  toggleSelect: (slug: string) => void;
  selectAll: (selected: boolean) => void;
  removeItem: (slug: string) => void;
  clear: () => void;
  selectedItems: CartItem[];
  totalSelected: number;
  totalPrice: number;
  qtyBySlug: (slug: string) => number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_PREFIX = "sparx-cart";

const normalizeImage = (src?: string) => {
  if (!src) return "https://placehold.co/300x300/png?text=No+Image";
  if (src.startsWith("http")) return src;
  const cleaned = src.startsWith("/") ? src.slice(1) : src;
  return `https://mouisdjwiiirvxnyhora.supabase.co/storage/v1/object/public/putridev/${cleaned}`;
};

const normalizeCartList = (list: CartItem[]): CartItem[] =>
  list.map((i) => ({ ...i, image: normalizeImage(i.image) }));

function withStock(list: CartItem[], productMap: Record<string, Product>): CartItem[] {
  return list.map((i) => {
    const product = productMap[i.slug];
    const stock = product?.stock ?? i.stock ?? 0;
    const price = product?.price ?? i.price;
    const name = product?.name ?? i.name;
    const image = normalizeImage(product?.images?.[0] ?? i.image);
    return { ...i, stock, price, name, image };
  });
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [productMap, setProductMap] = useState<Record<string, Product>>({});
  const storageKey = user?.uid ? `${STORAGE_PREFIX}-${user.uid}` : `${STORAGE_PREFIX}-guest`;
  const [storageReady, setStorageReady] = useState(false);
  const resolvedCache = useMemo<Record<string, string>>(() => ({}), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setStorageReady(false);
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as CartItem[];
        setItems(normalizeCartList(parsed));
      } catch {
        localStorage.removeItem(storageKey);
        setItems([]);
      }
    } else {
      setItems([]);
    }
    setStorageReady(true);
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === "undefined" || !storageReady) return;
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey, storageReady]);

  useEffect(() => {
    const productsRef = ref(db, "products");
    const unsub = onValue(productsRef, (snap) => {
      const val = snap.val() as Record<string, Product> | null;
      const map = val ?? {};
      setProductMap(map);
      setItems((prev) => withStock(prev, map));
    });
    return () => unsub();
  }, []);

  const addItem = (slug: string, qty: number = 1) => {
    const product = productMap[slug];
    if (!product) return;
    setItems((prev) => {
      const found = prev.find((i) => i.slug === slug);
      if (found) {
        return prev.map((i) =>
          i.slug === slug
            ? {
                ...i,
                stock: product.stock,
                price: product.price,
                name: product.name,
                image: normalizeImage(product.images?.[0] ?? i.image),
                qty: Math.min(product.stock, i.qty + qty),
                selected: true,
              }
            : i,
        );
      }
      return [
        ...prev,
        {
          slug,
          name: product.name,
          price: product.price,
          qty: Math.min(product.stock, qty),
          image: normalizeImage(product.images?.[0]),
          selected: true,
          stock: product.stock,
        },
      ];
    });
  };

  const updateQty = (slug: string, qty: number) => {
    const product = productMap[slug];
    setItems((prev) =>
      prev.map((i) => {
        if (i.slug !== slug) return i;
        const maxStock = product?.stock ?? i.stock ?? 1;
        const nextQty = Math.min(Math.max(1, qty), maxStock);
        return {
          ...i,
          qty: nextQty,
          stock: maxStock,
          price: product?.price ?? i.price,
          name: product?.name ?? i.name,
          image: normalizeImage(product?.images?.[0] ?? i.image),
        };
      }),
    );
  };

  const toggleSelect = (slug: string) => {
    setItems((prev) =>
      prev.map((i) => (i.slug === slug ? { ...i, selected: !i.selected } : i)),
    );
  };

  const selectAll = (selected: boolean) => {
    setItems((prev) => prev.map((i) => ({ ...i, selected })));
  };

  const removeItem = (slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  };

  const clear = () => setItems([]);

  const selectedItems = useMemo(() => items.filter((i) => i.selected), [items]);
  const totalSelected = useMemo(
    () => selectedItems.reduce((sum, i) => sum + i.qty, 0),
    [selectedItems],
  );
  const totalPrice = useMemo(
    () => selectedItems.reduce((sum, i) => sum + i.qty * i.price, 0),
    [selectedItems],
  );

  useEffect(() => {
    const resolveImages = async () => {
      const needResolve = items.filter((i) => !i.image || !i.image.startsWith("http") || !i.image.includes("token="));
      if (needResolve.length === 0) return;
      let changed = false;
      const updated = await Promise.all(
        items.map(async (item) => {
          const src = item.image;
          if (src && src.startsWith("http") && src.includes("token=")) return item;
          let path: string | null = null;
          if (src?.startsWith("http")) {
            const match = src.match(/object\/public\/putridev\/([^?]+)/);
            path = match ? match[1] : null;
          } else if (src) {
            const cleaned = src.startsWith("/") ? src.slice(1) : src;
            path = cleaned.replace(/^putridev\//, "");
          }
          if (path) {
            if (resolvedCache[path]) {
              changed = true;
              return { ...item, image: resolvedCache[path] };
            }
            const { data } = await supabase.storage.from("putridev").createSignedUrl(path, 60 * 60);
            if (data?.signedUrl) {
              resolvedCache[path] = data.signedUrl;
              changed = true;
              return { ...item, image: data.signedUrl };
            }
          }
          const fallback = normalizeImage(src);
          if (fallback !== src) changed = true;
          return { ...item, image: fallback };
        }),
      );
      if (changed) setItems(updated);
    };
    void resolveImages();
  }, [items]);

  const value: CartContextValue = {
    items,
    addItem,
    updateQty,
    toggleSelect,
    selectAll,
    removeItem,
    clear,
    selectedItems,
    totalSelected,
    totalPrice,
    qtyBySlug: (slug: string) => items.find((i) => i.slug === slug)?.qty ?? 0,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart harus dipakai di dalam CartProvider");
  }
  return ctx;
}
