"use client";
import { onValue, ref } from "firebase/database";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Shell } from "../../components/Shell";
import { db } from "../../lib/firebase";
import { ProductForm } from "../ProductForm";

type Product = {
  slug: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: string;
  images?: string[];
};

export default function ProductEditPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const productRef = ref(db, `products/${slug}`);
    const unsub = onValue(productRef, (snap) => {
      const val = snap.val() as Product | null;
      setProduct(val);
      setLoading(false);
    });
    return () => unsub();
  }, [slug]);

  return (
    <Shell active="products" requiresAuth>
      <div className="space-y-4">
        {loading ? (
          <div className="rounded-2xl bg-white/80 px-4 py-6 text-sm text-slate-600 ring-1 ring-slate-200">
            Memuat produk...
          </div>
        ) : product ? (
          <ProductForm initial={product} />
        ) : (
          <div className="rounded-2xl bg-white/80 px-4 py-6 text-sm text-slate-600 ring-1 ring-slate-200">
            Produk tidak ditemukan.
          </div>
        )}
      </div>
    </Shell>
  );
}
