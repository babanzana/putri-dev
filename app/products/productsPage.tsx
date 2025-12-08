"use client";
import { onValue, ref, remove } from "firebase/database";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Shell } from "../components/Shell";
import { Badge, StatCard } from "../components/ui";
import { db } from "../lib/firebase";

type Product = {
  slug: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: string;
  images?: string[];
};
type ViewProduct = Product & { derivedStatus: string };

export default function ProductsPage() {
  const [products, setProducts] = useState<ViewProduct[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [status, setStatus] = useState("Semua");
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);

  useEffect(() => {
    const productsRef = ref(db, "products");
    const unsub = onValue(productsRef, (snap) => {
      const val = snap.val() as Record<string, Product> | null;
      const list = val ? Object.values(val) : [];
      setProducts(
        list.map((p) => {
          const stockNum = Number(p.stock) || 0;
          const baseStatus = p.status || "Aktif";
          const derivedStatus =
            baseStatus === "Nonaktif"
              ? "Nonaktif"
              : stockNum <= 5
                ? "Stok Menipis"
                : "Aktif";
          return {
            ...p,
            price: Number(p.price) || 0,
            stock: stockNum,
            derivedStatus,
          };
        }),
      );
    });
    return () => unsub();
  }, []);

  const lowStock = useMemo(() => products.filter((p) => (p.stock ?? 0) <= 5), [products]);
  const categories = useMemo(
    () => ["Semua", ...Array.from(new Set(products.map((p) => p.category || "Umum")))],
    [products],
  );
  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(term) || (p.category || "").toLowerCase().includes(term);
      const matchCategory = category === "Semua" || p.category === category;
      const matchStatus =
        status === "Semua" ||
        (status === "Stok Menipis" && p.derivedStatus === "Stok Menipis") ||
        (status === "Aktif" && p.derivedStatus === "Aktif") ||
        (status === "Nonaktif" && p.derivedStatus === "Nonaktif");
      return matchSearch && matchCategory && matchStatus;
    });
  }, [products, search, category, status]);

  const handleDelete = async (slug: string) => {
    try {
      await remove(ref(db, `products/${slug}`));
    } catch {
      setError("Gagal menghapus produk.");
    }
  };

  return (
    <Shell active="products" requiresAuth>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Modul Pengelolaan Produk</p>
            <h2 className="text-2xl font-semibold">List, Tambah/Edit, Detail</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="success">Realtime</Badge>
            <Badge tone="warning">Stok menipis: {lowStock.length}</Badge>
            <Link
              href="/products/new"
              className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-2 text-xs font-semibold text-white shadow-sm"
            >
              + Tambah Produk
            </Link>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Produk" value={`${products.length} item`} />
          <StatCard
            label="Stok Menipis"
            value={`${lowStock.length} SKU`}
            accent="from-rose-500 to-red-600"
          />
          <StatCard
            label="Kategori"
            value={`${new Set(products.map((p) => p.category)).size} jenis`}
            accent="from-indigo-500 to-sky-600"
          />
          <StatCard
            label="Total Nilai Stok"
            value={`Rp ${products
              .reduce((sum, p) => sum + (p.price || 0) * (p.stock || 0), 0)
              .toLocaleString("id-ID")}`}
            accent="from-emerald-500 to-teal-600"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-100 bg-white/80 p-3 shadow-sm ring-1 ring-black/5">
          <input
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm sm:w-64"
            placeholder="Cari nama / kategori"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="relative">
            <select
              className="appearance-none rounded-lg border border-slate-200 px-3 py-2 pr-8 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>
          <div className="relative">
            <select
              className="appearance-none rounded-lg border border-slate-200 px-3 py-2 pr-8 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>Semua</option>
              <option>Aktif</option>
              <option>Stok Menipis</option>
              <option>Nonaktif</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>
        </div>
        <div className="overflow-auto rounded-2xl border border-slate-100 bg-white/80 shadow-sm ring-1 ring-black/5 backdrop-blur">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Produk</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Harga</th>
                <th className="px-4 py-3">Stok</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((p) => (
                <tr key={p.slug}>
                  <td className="px-4 py-3 font-semibold">{p.name}</td>
                  <td className="px-4 py-3 text-slate-600">{p.category}</td>
                  <td className="px-4 py-3 text-slate-600">
                Rp {p.price.toLocaleString("id-ID")}
              </td>
              <td className="px-4 py-3 text-slate-600">{p.stock}</td>
              <td className="px-4 py-3">
                <Badge
                  tone={
                    p.derivedStatus === "Aktif"
                      ? "success"
                      : p.derivedStatus === "Stok Menipis"
                        ? "warning"
                        : "neutral"
                  }
                >
                  {p.derivedStatus}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right text-xs">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/products/${p.slug}`}
                    className="rounded-lg border border-slate-200 px-3 py-1 hover:border-emerald-300 hover:text-emerald-800"
                  >
                    Edit
                  </Link>
                  <button
                    className="rounded-lg border border-slate-200 px-3 py-1 hover:border-rose-300 hover:text-rose-800"
                    onClick={() => setPendingDelete(p)}
                  >
                    Hapus
                  </button>
                </div>
              </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td className="px-4 py-3 text-xs text-slate-500" colSpan={6}>
                    Tidak ada produk untuk filter tersebut.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {error && (
          <div className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">
            {error}
          </div>
        )}
        {pendingDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
              <h3 className="text-lg font-semibold text-slate-900">Hapus produk?</h3>
              <p className="mt-1 text-sm text-slate-600">
                Produk <span className="font-semibold">{pendingDelete.name}</span> akan dihapus
                permanen dari database. Lanjutkan?
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                  onClick={() => setPendingDelete(null)}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-gradient-to-r from-rose-500 to-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm"
                  onClick={async () => {
                    await handleDelete(pendingDelete.slug);
                    setPendingDelete(null);
                  }}
                >
                  Ya, hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}
