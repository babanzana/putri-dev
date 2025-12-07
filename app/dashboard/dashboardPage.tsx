"use client";
import { onValue, ref } from "firebase/database";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
};

type OrderRecord = {
  id: string;
  createdAt: number;
  status: string;
  total: number;
  items: { slug: string; qty: number }[];
};

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productsRef = ref(db, "products");
    const ordersRef = ref(db, "orders");
    const unsubProducts = onValue(productsRef, (snap) => {
      const val = snap.val() as Record<string, Product> | null;
      const list = val ? Object.values(val) : [];
      setProducts(
        list.map((p) => ({
          ...p,
          price: Number(p.price) || 0,
          stock: Number(p.stock) || 0,
          status:
            p.status === "Nonaktif"
              ? "Nonaktif"
              : (Number(p.stock) || 0) <= 5
                ? "Stok Menipis"
                : "Aktif",
        })),
      );
    });
    const unsubOrders = onValue(ordersRef, (snap) => {
      const val = snap.val() as Record<string, OrderRecord> | null;
      setOrders(val ? Object.values(val) : []);
      setLoading(false);
    });
    return () => {
      unsubProducts();
      unsubOrders();
    };
  }, []);

  const { totalProducts, lowStockCount, todayTx, pendingPayments, salesSeries } = useMemo(() => {
    const now = new Date();
    const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const total = products.length;
    const low = products.filter((p) => (p.stock ?? 0) <= 5).length;
    const today = orders.filter((o) => o.createdAt >= startToday).length;
    const pending = orders.filter((o) =>
      ["Menunggu Verifikasi", "Menunggu Upload"].includes(o.status),
    ).length;
    const days: number[] = Array(7).fill(0);
    const oneDay = 24 * 60 * 60 * 1000;
    const startWindow = startToday - oneDay * 6;
    orders.forEach((o) => {
      if (o.createdAt >= startWindow) {
        const idx = Math.floor((o.createdAt - startWindow) / oneDay);
        if (idx >= 0 && idx < 7) days[idx] += 1;
      }
    });
    return {
      totalProducts: total,
      lowStockCount: low,
      todayTx: today,
      pendingPayments: pending,
      salesSeries: days,
    };
  }, [orders, products]);

  const lowStockList = useMemo(
    () => products.filter((p) => (p.stock ?? 0) <= 5 && p.status !== "Nonaktif"),
    [products],
  );

  return (
    <Shell active="dashboard" requiresAuth>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Halaman awal admin</p>
            <h1 className="text-2xl font-semibold">Dashboard Ringkasan</h1>
          </div>
          <div className="flex gap-2">
            <Badge tone="success">Online</Badge>
            <Badge tone="warning">Stok menipis: {lowStockCount}</Badge>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Produk" value={`${totalProducts} sparepart`} />
          <StatCard
            label="Transaksi Hari Ini"
            value={`${todayTx} pesanan`}
            accent="from-emerald-500 to-teal-600"
          />
          <StatCard
            label="Menunggu Konfirmasi"
            value={`${pendingPayments} pembayaran`}
            accent="from-indigo-500 to-sky-600"
          />
          <StatCard
            label="Stok Menipis"
            value={`${lowStockCount} SKU`}
            accent="from-rose-500 to-red-600"
          />
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Grafik penjualan</p>
                <p className="text-lg font-semibold">7 hari terakhir</p>
              </div>
              <Badge tone="neutral">Orders</Badge>
            </div>
            <div className="mt-6 flex h-48 items-end gap-3 rounded-xl bg-gradient-to-r from-white to-amber-50 p-4 ring-1 ring-amber-100">
              {salesSeries.map((v, i) => (
                <div key={i} className="flex-1">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-b from-amber-500 to-orange-600 shadow-sm"
                    style={{ height: `${Math.max(6, v * 12)}px` }}
                  />
                  <p className="mt-2 text-center text-xs text-slate-500">
                    D{i + 1}
                  </p>
                  <p className="text-center text-[11px] text-slate-400">{v}x</p>
                </div>
              ))}
              {salesSeries.length === 0 && (
                <p className="text-xs text-slate-500">Belum ada data.</p>
              )}
            </div>
          </div>
          <div className="space-y-3 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Stok menipis</p>
                <p className="text-lg font-semibold">Perlu restock</p>
              </div>
              <Badge tone="warning">Prioritas</Badge>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {lowStockList.length === 0 && (
                <p className="text-xs text-slate-500">Tidak ada stok menipis.</p>
              )}
              {lowStockList.slice(0, 5).map((p) => (
                <div
                  key={p.name}
                  className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-amber-900">{p.name}</p>
                    <p className="text-xs text-amber-800">
                      Stok: {p.stock} | {p.category}
                    </p>
                  </div>
                  <Link
                    href={`/products/${p.slug}`}
                    className="rounded-lg border border-amber-200 px-3 py-1 text-[11px] font-semibold text-amber-800 hover:border-amber-300 hover:bg-amber-100"
                  >
                    Restock
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
