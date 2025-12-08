"use client";
import { onValue, ref } from "firebase/database";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Filter, ShoppingCart } from "lucide-react";
import { Shell } from "../components/Shell";
import { Badge } from "../components/ui";
import { useCart } from "../components/CartProvider";
import { db } from "../lib/firebase";
import { supabase } from "../lib/supabaseClient";
import type { Product } from "../lib/dummyData";
type ViewProduct = Product & { rawImages: string[] };

import fallbackImg from "../assets/loading-image.jpg";
const FALLBACK_IMAGE = fallbackImg.src;

export default function CatalogPage() {
  const [products, setProducts] = useState<ViewProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const { addItem, qtyBySlug } = useCart();
  useEffect(() => {
    const productsRef = ref(db, "products");
    const unsub = onValue(productsRef, (snap) => {
      const val = snap.val() as Record<string, Product> | null;
      const list = val ? Object.values(val) : [];
      const mapped = list
        .map((p) => {
          const stock = Number(p.stock) || 0;
          const status =
            p.status === "Nonaktif"
              ? "Nonaktif"
              : stock <= 5
                ? "Stok Menipis"
                : "Aktif";
          const rawImages = p.images && p.images.length > 0 ? p.images : [];
          const images =
            rawImages.length > 0
              ? rawImages.map((img) =>
                  img && img.startsWith("http")
                    ? img
                    : FALLBACK_IMAGE,
                )
              : [FALLBACK_IMAGE];
          return {
            ...p,
            price: Number(p.price) || 0,
            stock,
            status,
            rawImages,
            images,
          };
        })
        .filter((p) => p.status !== "Nonaktif");
      setProducts(mapped);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const resolveImages = async () => {
      if (products.length === 0) return;
      const resolved = await Promise.all(
        products.map(async (p) => {
          const imgs =
            p.rawImages.length > 0
              ? await Promise.all(
                  p.rawImages.map(async (img) => {
                    if (!img) return FALLBACK_IMAGE;
                    if (img.startsWith("http")) return img;
                    const cleaned = img.startsWith("/") ? img.slice(1) : img;
                    const { data } = await supabase.storage
                      .from("putridev")
                      .createSignedUrl(cleaned, 60 * 60);
                    return data?.signedUrl || FALLBACK_IMAGE;
                  }),
                )
              : [FALLBACK_IMAGE];
          return { ...p, images: imgs };
        }),
      );
      setProducts(resolved);
    };
    void resolveImages();
  }, [products.length]);
  const categories = useMemo(
    () => ["Semua", ...Array.from(new Set(products.map((p) => p.category)))],
    [products],
  );
  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return products.filter(
      (p) =>
        (p.name.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)) &&
        (category === "Semua" || p.category === category),
    );
  }, [search, category, products]);
  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(null), 1200);
    return () => clearTimeout(t);
  }, [justAdded]);
  return (
    <Shell active="catalog" requiresAuth>
      {" "}
      <div className="space-y-4">
        {" "}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {" "}
          <div>
            {" "}
            <p className="text-sm text-slate-500">
              {" "}
              {loading
                ? "Memuat katalog..."
                : `Katalog sparepart (${products.length} item)`}{" "}
            </p>{" "}
            <h1 className="text-2xl font-semibold">
              Pilih item untuk lihat detail
            </h1>{" "}
          </div>{" "}
          <div className="flex flex-wrap items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 shadow-sm ring-1 ring-black/5">
            {" "}
            <div className="flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-[12px] font-semibold text-white">
              {" "}
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                {" "}
                <Filter className="h-3.5 w-3.5" />{" "}
              </span>{" "}
              Filter{" "}
            </div>{" "}
            <div className="relative">
              {" "}
              <select
                className="appearance-none rounded-full border border-amber-300 px-3.5 py-2 pr-9 text-sm font-semibold text-slate-800 shadow-sm focus:border-amber-400 focus:outline-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {" "}
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}{" "}
              </select>{" "}
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />{" "}
            </div>{" "}
            <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm focus-within:border-amber-300">
              {" "}
              <span className="text-[12px] font-bold text-slate-500">
                Cari
              </span>{" "}
              <input
                className="w-36 bg-transparent text-sm outline-none placeholder:text-slate-400 sm:w-56"
                placeholder="nama atau kategori"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {loading ? (
          <div className="rounded-2xl bg-white/80 px-4 py-6 text-sm text-slate-600 ring-1 ring-slate-200">
            {" "}
            Memuat data produk...{" "}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl bg-white/80 px-4 py-6 text-sm text-slate-600 ring-1 ring-slate-200">
            {" "}
            Tidak ada produk untuk filter tersebut.{" "}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {" "}
            {filtered.map((p) => (
              <div
                key={p.slug}
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white/80 p-3 text-left shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-md"
              >
                {" "}
                <div className="relative h-32 w-full overflow-hidden rounded-xl bg-slate-100">
                  {" "}
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    className="object-cover transition group-hover:scale-105"
                  />{" "}
                </div>{" "}
                <div className="mt-3 space-y-1">
                  {" "}
                  <p className="text-sm font-semibold text-slate-900 line-clamp-2">
                    {p.name}
                  </p>{" "}
                  <p className="text-xs text-slate-500">{p.category}</p>{" "}
                  <p className="text-base font-semibold text-amber-700">
                    {" "}
                    Rp {p.price.toLocaleString("id-ID")}{" "}
                  </p>{" "}
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    {" "}
                    <span>Stok {p.stock} pcs</span>{" "}
                    <Badge tone={p.status === "Stok Menipis" ? "warning" : "success"}>
                      {p.status}
                    </Badge>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="mt-3 flex gap-2">
                  {" "}
                  <Link
                    href={`/catalog/${p.slug}`}
                    className="flex flex-1 items-center justify-center rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-white shadow-sm text-center"
                  >
                    {" "}
                    Lihat Detail{" "}
                  </Link>{" "}
                  {p.stock > 0 ? (
                    <button
                      onClick={() => {
                        addItem(p.slug, 1);
                        setJustAdded(p.slug);
                      }}
                      className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-400 via-orange-500 to-orange-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:from-amber-500 hover:to-orange-700"
                    >
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                        <ShoppingCart className="h-3.5 w-3.5" />
                      </span>
                      Keranjang
                      <span className="rounded-full bg-white/20 px-2 py-[2px] text-[10px] font-bold">
                        {qtyBySlug(p.slug)}
                      </span>
                    </button>
                  ) : (
                    <div className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-center text-[11px] font-semibold text-slate-400">
                      Stok habis
                    </div>
                  )}{" "}
                  {justAdded === p.slug && (
                    <span className="absolute right-3 top-3 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-semibold text-white shadow-sm">
                      {" "}
                      ✅ Ditambah{" "}
                    </span>
                  )}{" "}
                </div>{" "}
              </div>
            ))}{" "}
          </div>
        )}{" "}
      </div>{" "}
    </Shell>
  );
}
