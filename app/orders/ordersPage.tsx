"use client";
import { onValue, ref } from "firebase/database";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Shell } from "../components/Shell";
import { Badge } from "../components/ui";
import { db } from "../lib/firebase";

type OrderItem = { slug: string; name: string; qty: number; price: number; image?: string };
type OrderRecord = {
  id: string;
  customer?: { name?: string; email?: string; phone?: string; address?: string };
  status: string;
  total?: number;
  subtotal?: number;
  shipping?: number;
  items?: OrderItem[];
  paymentProofName?: string | null;
  paymentProofPath?: string | null;
  createdAt?: number;
  note?: string;
};

const statusOptions = [
  "Semua",
  "Menunggu Upload",
  "Menunggu Verifikasi",
  "Selesai",
  "Batal",
];

export default function OrdersPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Semua");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  useEffect(() => {
    const ordersRef = ref(db, "orders");
    const unsub = onValue(ordersRef, (snap) => {
      const val = snap.val() as Record<string, OrderRecord> | null;
      const list = val ? Object.values(val) : [];
      setOrders(
        list.map((o) => ({
          ...o,
          total: Number(o.total) || 0,
        })),
      );
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    const startTs = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    const endTs = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
    return orders
      .filter((o) => {
        const matchStatus = status === "Semua" || o.status === status;
        const matchSearch =
          o.id?.toLowerCase().includes(term) ||
          (o.customer?.name || "").toLowerCase().includes(term) ||
          (o.customer?.email || "").toLowerCase().includes(term);
        const created = o.createdAt || 0;
        const matchStart = startTs ? created >= startTs : true;
        const matchEnd = endTs ? created <= endTs : true;
        return matchStatus && matchSearch && matchStart && matchEnd;
      })
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }, [orders, search, status, startDate, endDate]);

  const formatDate = (ts?: number) =>
    ts ? new Date(ts).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : "-";

  return (
    <Shell active="orders" requiresAuth>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Modul Transaksi Pemesanan</p>
            <h2 className="text-2xl font-semibold">Order List & Detail</h2>
          </div>
          <div className="flex flex-wrap items-end gap-3 text-xs text-slate-500">
            <div className="flex flex-col gap-1">
              <label htmlFor="order-search">Pencarian</label>
              <input
                id="order-search"
                className="rounded-full border border-slate-200 px-3 py-2 text-sm"
                placeholder="Cari ID / nama / email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="order-status">Filter Status</label>
              <div className="relative">
                <select
                  id="order-status"
                  className="appearance-none rounded-full border border-slate-200 px-3 py-2 pr-9 text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {statusOptions.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="order-date-from">Dari</label>
              <input
                id="order-date-from"
                type="date"
                className="rounded-full border border-slate-200 px-3 py-2 text-sm"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="order-date-to">Sampai</label>
              <input
                id="order-date-to"
                type="date"
                className="rounded-full border border-slate-200 px-3 py-2 text-sm"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 self-end">
              <Link
                href="/orders/new"
                className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm"
              >
                + Manual Add Order
              </Link>
            </div>
          </div>
        </div>

        <div className="overflow-auto rounded-2xl border border-slate-100 bg-white/80 shadow-sm ring-1 ring-black/5 backdrop-blur">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">No. Transaksi</th>
                <th className="px-4 py-3">Pelanggan</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status Pembayaran</th>
                <th className="px-4 py-3">Bukti Transfer</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td className="px-4 py-3 font-semibold">{o.id}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {o.customer?.name || "-"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(o.createdAt)}</td>
                  <td className="px-4 py-3 text-slate-600">
                    Rp {o.total?.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      tone={
                        o.status === "Selesai"
                          ? "success"
                          : o.status === "Menunggu Verifikasi"
                            ? "neutral"
                            : o.status === "Batal"
                              ? "warning"
                              : "warning"
                      }
                    >
                      {o.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {o.paymentProofName || o.paymentProofPath || "Belum upload"}
                  </td>
                  <td className="px-4 py-3 text-right text-xs">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/orders/${o.id}`}
                        className="rounded-lg border border-slate-200 px-3 py-1 hover:border-amber-300 hover:text-amber-800"
                      >
                        Edit / Detail
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td className="px-4 py-3 text-xs text-slate-500" colSpan={7}>
                    Tidak ada pesanan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}
