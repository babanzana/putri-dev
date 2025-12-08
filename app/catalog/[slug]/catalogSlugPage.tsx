"use client";
import { onValue, ref } from "firebase/database";
import Image from "next/image";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Shell } from "../../components/Shell";
import { Badge } from "../../components/ui";
import { useCart } from "../../components/CartProvider";
import { db } from "../../lib/firebase";
import { supabase } from "../../lib/supabaseClient";
import type { Product } from "../../lib/dummyData";
import fallbackImg from "../../assets/loading-image.jpg";
const placeholder = fallbackImg.src;
type ViewProduct = Product & { rawImages: string[] };
export default function CatalogDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug =
    typeof params?.slug === "string"
      ? params.slug
      : Array.isArray(params?.slug)
        ? params.slug[0]
        : "";
  const [products, setProducts] = useState<ViewProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const { addItem, qtyBySlug } = useCart();
  const [added, setAdded] = useState(false);
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
          const placeholder = fallbackImg.src;
          const images =
            rawImages.length > 0
              ? rawImages.map((img) =>
                  img && img.startsWith("http") ? img : placeholder,
                )
              : [placeholder];
          return {
            ...p,
            stock,
            price: Number(p.price) || 0,
            status,
            rawImages,
            images,
          };
        })
        .filter((p) => p.status !== "Nonaktif");
      setProducts(mapped);
      setLoading(false);
      setActiveIndex(0);
      setQty(1);
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
                    if (!img) return placeholder;
                    if (img.startsWith("http")) return img;
                    const cleaned = img.startsWith("/") ? img.slice(1) : img;
                    const { data } = await supabase.storage
                      .from("putridev")
                      .createSignedUrl(cleaned, 60 * 60);
                    return data?.signedUrl || placeholder;
                  }),
                )
              : [placeholder];
          return { ...p, images: imgs };
        }),
      );
      setProducts(resolved);
    };
    void resolveImages();
  }, [products.length]);
  const product = useMemo(
    () => products.find((p) => p.slug === slug) || null,
    [products, slug],
  );
  const recommendations = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.slug !== product.slug && p.category === product.category)
      .slice(0, 3);
  }, [product, products]);
  if (loading) {
    return (
      <Shell active="catalog" requiresAuth>
        {" "}
        <div className="mx-auto max-w-5xl rounded-2xl bg-white/80 px-4 py-6 text-sm text-slate-600 ring-1 ring-slate-200">
          {" "}
          Memuat detail produk...{" "}
        </div>{" "}
      </Shell>
    );
  }
  if (!product) return notFound();
  const goNext = () =>
    setActiveIndex((prev) => (prev + 1) % product.images.length);
  const goPrev = () =>
    setActiveIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length,
    );
  return (
    <Shell active="catalog" requiresAuth>
      {" "}
      <div className="mx-auto max-w-5xl space-y-6">
        {" "}
        <button
          onClick={() => router.back()}
          className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-amber-300"
          type="button"
        >
          {" "}
          ← Kembali{" "}
        </button>{" "}
        <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
          {" "}
          <div className="space-y-3">
            {" "}
            <div className="relative h-96 w-full overflow-hidden rounded-2xl bg-slate-100">
              {" "}
              <Image
                src={product.images[activeIndex]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />{" "}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-3">
                {" "}
                <button
                  onClick={goPrev}
                  className="pointer-events-auto rounded-full bg-white/80 px-3 py-3 text-base font-semibold text-slate-900 shadow-lg ring-1 ring-slate-200 transition hover:bg-white hover:ring-amber-200"
                  type="button"
                >
                  {" "}
                  ‹{" "}
                </button>{" "}
                <button
                  onClick={goNext}
                  className="pointer-events-auto rounded-full bg-white/80 px-3 py-3 text-base font-semibold text-slate-900 shadow-lg ring-1 ring-slate-200 transition hover:bg-white hover:ring-amber-200"
                  type="button"
                >
                  {" "}
                  ›{" "}
                </button>{" "}
              </div>{" "}
            </div>{" "}
            <div className="grid grid-cols-4 gap-2">
              {" "}
              {product.images.map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative h-16 w-full overflow-hidden rounded-lg border ${activeIndex === idx ? "border-amber-300" : "border-slate-200"}`}
                  type="button"
                >
                  {" "}
                  <Image
                    src={img}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />{" "}
                </button>
              ))}{" "}
            </div>{" "}
          </div>{" "}
          <div className="space-y-4 rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur">
            {" "}
            <div className="flex items-start justify-between gap-3">
              {" "}
              <div className="-mt-1">
                {" "}
                <p className="text-sm text-slate-500">Detail Produk</p>{" "}
                <h1 className="text-2xl font-semibold text-slate-900">
                  {product.name}
                </h1>{" "}
                <p className="text-sm text-slate-500">
                  Kategori: {product.category}
                </p>{" "}
              </div>{" "}
              <Badge tone={product.stock <= 5 ? "warning" : "success"}>
                {" "}
                {product.stock <= 5 ? "Stok Menipis" : "Ready"}{" "}
              </Badge>{" "}
            </div>{" "}
            <p className="text-3xl font-semibold text-amber-700">
              {" "}
              Rp {product.price.toLocaleString("id-ID")}{" "}
            </p>{" "}
            <p className="text-sm leading-relaxed text-slate-700">
              {product.description}
            </p>{" "}
            {product.stock > 0 ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-xl border border-slate-200">
                  <button
                    type="button"
                    className="px-3 py-2 text-sm font-semibold text-slate-700"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                  >
                    -
                  </button>
                  <div className="px-4 py-2 text-sm font-semibold text-slate-900">
                    {qty}
                  </div>
                  <button
                    type="button"
                    className="px-3 py-2 text-sm font-semibold text-slate-700"
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  >
                    +
                  </button>
                </div>
                <button
                  className="flex-1 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm"
                  onClick={() => {
                    addItem(product.slug, qty);
                    setAdded(true);
                    setTimeout(() => setAdded(false), 1200);
                  }}
                  type="button"
                >
                  Tambah ke Keranjang
                </button>
                <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                  Dalam keranjang: {qtyBySlug(product.slug)}
                </span>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500">
                Stok habis. Keranjang dinonaktifkan.
              </div>
            )}{" "}
            {added && (
              <div className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                {" "}
                Ditambah ke keranjang{" "}
              </div>
            )}{" "}
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 text-xs text-slate-600">
              {" "}
              <p className="font-semibold text-slate-800">
                Info pengiriman
              </p>{" "}
              <p>
                {" "}
                Estimasi tiba 1-2 hari untuk daerah Pontianak, untuk di luar
                Pontianak berdasarkan layanan Jasa (Coming Soon). Terima
                Kasih.{" "}
              </p>{" "}
              <p className="mt-2 font-semibold text-slate-800">
                Tarif Biaya Area Pontianak:
              </p>{" "}
              <p>Rp. 15.000</p>{" "}
              <p className="mt-2 font-semibold text-slate-800">
                {" "}
                Tarif Area di luar Pontianak (Coming Soon){" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {recommendations.length > 0 && (
          <div className="space-y-2">
            {" "}
            <p className="text-sm font-semibold text-slate-900">
              Rekomendasi lain
            </p>{" "}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {" "}
              {recommendations.map((item) => (
                <a
                  key={item.slug}
                  href={`/catalog/${item.slug}`}
                  className="flex gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-sm ring-1 ring-black/5 hover:border-amber-200"
                >
                  {" "}
                  <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-slate-100">
                    {" "}
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />{" "}
                  </div>{" "}
                  <div className="flex-1">
                    {" "}
                    <p className="text-sm font-semibold text-slate-900 line-clamp-2">
                      {item.name}
                    </p>{" "}
                    <p className="text-[11px] text-slate-500">
                      {" "}
                      Rp {item.price.toLocaleString("id-ID")}{" "}
                    </p>{" "}
                  </div>{" "}
                </a>
              ))}{" "}
            </div>{" "}
          </div>
        )}{" "}
      </div>{" "}
    </Shell>
  );
}
