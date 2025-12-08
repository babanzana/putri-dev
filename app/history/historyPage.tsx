"use client";
import { onValue, ref, update } from "firebase/database";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Shell } from "../components/Shell";
import { Badge } from "../components/ui";
import { useAuth } from "../components/AuthProvider";
import { db } from "../lib/firebase";
import { supabase } from "../lib/supabaseClient";

type OrderRecord = {
  id: string;
  userId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: { slug: string; name: string; qty: number; price: number; image?: string }[];
  note?: string;
  status: string;
  paymentProofPath?: string | null;
  paymentProofName?: string | null;
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: number;
  updatedAt: number;
};

export default function HistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<OrderRecord | null>(null);
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [proofUploading, setProofUploading] = useState(false);
  const [proofError, setProofError] = useState<string | null>(null);
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    const ordersRef = ref(db, "orders");
    const unsub = onValue(ordersRef, (snap) => {
      const val = snap.val() as Record<string, OrderRecord> | null;
      const list = Object.values(val ?? {}).filter((o) => o.userId === user.uid);
      setOrders(list.sort((a, b) => b.createdAt - a.createdAt));
      setLoading(false);
    });
    return () => unsub();
  }, [user?.uid]);

  useEffect(() => {
    const loadProof = async () => {
      if (!selected?.paymentProofPath) {
        setProofUrl(null);
        return;
      }
      const { data, error } = await supabase.storage
        .from("putridev")
        .createSignedUrl(selected.paymentProofPath, 60 * 60);
      if (error) {
        setProofUrl(null);
        return;
      }
      setProofUrl(data.signedUrl);
    };
    void loadProof();
  }, [selected?.paymentProofPath]);

  const filteredOrders = useMemo(() => {
    if (!startDate && !endDate) return orders;
    const startTs = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    const endTs = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
    return orders.filter((o) => {
      const t = o.createdAt;
      if (startTs && t < startTs) return false;
      if (endTs && t > endTs) return false;
      return true;
    });
  }, [endDate, orders, startDate]);

  const totalOrders = useMemo(() => filteredOrders.length, [filteredOrders]);

  const handleProofUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selected || !user?.uid) return;
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setProofError("Ukuran file lebih dari 2MB.");
      return;
    }
    setProofError(null);
    setProofUploading(true);
    const safeName = file.name.replace(/\s+/g, "-");
    const path = `proofs/${user.uid}/${selected.id}-${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from("putridev").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "application/octet-stream",
    });
    if (error) {
      setProofError("Gagal mengunggah bukti, coba lagi.");
      setProofUploading(false);
      return;
    }
    try {
      const updates = {
        paymentProofPath: path,
        paymentProofName: file.name,
        status: "Menunggu Verifikasi",
        updatedAt: Date.now(),
      };
      await update(ref(db, `orders/${selected.id}`), updates);
      await update(ref(db, `userOrders/${user.uid}/${selected.id}`), updates);
      const { data } = await supabase.storage.from("putridev").createSignedUrl(path, 60 * 60);
      setProofUrl(data?.signedUrl ?? null);
      setSelected((prev) => (prev ? { ...prev, ...updates } : prev));
    } catch {
      setProofError("Gagal menyimpan bukti, coba lagi.");
    } finally {
      setProofUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Shell active="history" requiresAuth>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Riwayat transaksi konsumen</p>
            <h1 className="text-2xl font-semibold">Order History</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl bg-white/70 p-2 text-xs text-slate-600 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-1">
                <span>Dari</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                />
              </div>
              <div className="flex items-center gap-1">
                <span>Sampai</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                />
              </div>
              {(startDate || endDate) && (
                <button
                  type="button"
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="text-xs font-semibold text-amber-700 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
            <Badge tone="neutral">Total: {totalOrders}</Badge>
          </div>
        </div>
        <div className="overflow-auto rounded-2xl border border-slate-100 bg-white/80 shadow-sm ring-1 ring-black/5 backdrop-blur">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">No. Transaksi</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Bukti</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading && (
                <tr>
                  <td className="px-4 py-3 text-xs text-slate-500" colSpan={4}>
                    Memuat riwayat...
                  </td>
                </tr>
              )}
              {!loading && filteredOrders.length === 0 && (
                <tr>
                  <td className="px-4 py-3 text-xs text-slate-500" colSpan={4}>
                    Tidak ada transaksi pada rentang ini.
                  </td>
                </tr>
              )}
              {filteredOrders.map((o) => (
                <tr
                  key={o.id}
                  className="cursor-pointer transition hover:bg-amber-50"
                  onClick={() => setSelected(o)}
                >
                  <td className="px-4 py-3 font-semibold">{o.id}</td>
                  <td className="px-4 py-3">
                    <Badge
                      tone={
                        o.status === "Selesai"
                          ? "success"
                          : ["Menunggu Verifikasi", "Pengiriman"].includes(o.status)
                            ? "neutral"
                            : "warning"
                      }
                    >
                      {o.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    Rp {o.total.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {o.paymentProofName || o.paymentProofPath || "Belum upload"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">No. Transaksi</p>
                <p className="text-lg font-semibold text-slate-900">{selected.id}</p>
                <p className="text-xs text-slate-500">
                  {new Date(selected.createdAt).toLocaleString("id-ID")}
                </p>
              </div>
              <Badge
                tone={
                  selected.status === "Selesai"
                    ? "success"
                    : selected.status === "Menunggu Verifikasi"
                      ? "neutral"
                      : "warning"
                }
              >
                {selected.status}
              </Badge>
            </div>
            <div className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-500">Customer</p>
                <p className="font-semibold text-slate-900">{selected.customer.name}</p>
                <p>{selected.customer.phone}</p>
                <p className="text-xs text-slate-500">{selected.customer.email}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-500">Alamat</p>
                <p className="text-sm text-slate-700">{selected.customer.address}</p>
                {selected.note ? (
                  <p className="mt-2 text-xs text-slate-500">Catatan: {selected.note}</p>
                ) : null}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-500">Item</p>
              <div className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50">
                {selected.items.map((it) => (
                  <div key={it.slug} className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-3">
                      {it.image ? (
                        <img
                          src={it.image}
                          alt={it.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : null}
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{it.name}</p>
                        <p className="text-xs text-slate-500">Qty: {it.qty}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">
                      Rp {(it.qty * it.price).toLocaleString("id-ID")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-slate-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp {selected.subtotal.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span>Ongkir</span>
                <span>Rp {selected.shipping.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-900">
                <span>Total</span>
                <span>Rp {selected.total.toLocaleString("id-ID")}</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-500">Bukti Pembayaran</p>
              {selected.paymentProofPath ? (
                <div className="mt-2 flex items-center gap-3">
                  {proofUrl ? (
                    <a
                      href={proofUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:border-amber-300"
                    >
                      Lihat bukti ({selected.paymentProofName || "file"})
                    </a>
                  ) : (
                    <span className="text-xs text-slate-500">Memuat bukti...</span>
                  )}
                </div>
              ) : (
                <div className="mt-2 space-y-2">
                  <p className="text-xs text-slate-500">Belum ada bukti pembayaran.</p>
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="proof-upload-history"
                      className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:border-amber-300 ${proofUploading ? "pointer-events-none opacity-60" : ""}`}
                    >
                      {proofUploading ? "Mengunggah..." : "Upload bukti"}
                    </label>
                    <input
                      ref={fileInputRef}
                      id="proof-upload-history"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={proofUploading}
                      onChange={handleProofUpload}
                    />
                    {proofError && (
                      <p className="text-[11px] font-semibold text-rose-600">{proofError}</p>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">Format JPG/PNG, max 2MB.</p>
                </div>
              )}
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}
