"use client";
import { onValue, ref } from "firebase/database";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { useStoreSettings } from "../../lib/useStoreSettings";

type OrderItem = {
  name?: string;
  slug?: string;
  qty?: number;
  price?: number;
};

type OrderRecord = {
  id: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  status: string;
  total?: number;
  subtotal?: number;
  shipping?: number;
  items?: OrderItem[];
  paymentMethod?: "CASH" | "CASHLESS";
  note?: string;
  createdAt?: number;
};

const fmt = (v?: number) => `Rp ${(Number(v) || 0).toLocaleString("id-ID")}`;

const formatDate = (ts?: number) =>
  ts
    ? new Date(ts).toLocaleString("id-ID", {
        dateStyle: "long",
        timeStyle: "short",
      })
    : "-";

export default function NotaPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const { settings } = useStoreSettings();

  useEffect(() => {
    if (!id) return;
    const unsub = onValue(ref(db, `orders/${id}`), (snap) => {
      setOrder(snap.val() as OrderRecord | null);
      setLoading(false);
    });
    return () => unsub();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Memuat nota...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Nota tidak ditemukan.
      </div>
    );
  }

  if (order.status !== "Selesai") {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Nota hanya tersedia untuk pesanan yang sudah selesai.
      </div>
    );
  }

  const subtotal =
    order.subtotal ??
    order.items?.reduce((acc, it) => acc + (Number(it.qty) || 0) * (Number(it.price) || 0), 0) ??
    0;
  const shipping = order.shipping ?? 0;
  const total = order.total ?? subtotal + shipping;

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
        }
        @page { margin: 16mm; }
      `}</style>

      <div className="min-h-screen bg-slate-100 flex flex-col items-center py-8 px-4">
        <div className="no-print mb-6 flex gap-3">
          <button
            onClick={() => window.print()}
            className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800"
          >
            Cetak / Print
          </button>
          <button
            onClick={() => window.close()}
            className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-600 shadow hover:bg-slate-50"
          >
            Tutup
          </button>
        </div>

        <div
          id="nota-print"
          className="w-full max-w-lg bg-white shadow-lg rounded-2xl overflow-hidden"
        >
          <div className="bg-slate-900 px-6 py-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Nota Pembelian
            </p>
            <h1 className="mt-1 text-xl font-bold">
              {settings.storeInfo.name || "Toko"}
            </h1>
            <p className="mt-0.5 text-xs text-slate-400">
              {settings.storeInfo.address}
            </p>
            {settings.contact.whatsapp && settings.contact.whatsapp !== "-" && (
              <p className="mt-0.5 text-xs text-slate-400">
                WA: {settings.contact.whatsapp}
              </p>
            )}
          </div>

          <div className="px-6 py-4 border-b border-dashed border-slate-200">
            <div className="flex justify-between text-xs text-slate-500">
              <span>No. Transaksi</span>
              <span className="font-semibold text-slate-800">{order.id}</span>
            </div>
            <div className="mt-1 flex justify-between text-xs text-slate-500">
              <span>Tanggal</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            <div className="mt-1 flex justify-between text-xs text-slate-500">
              <span>Metode Bayar</span>
              <span>{order.paymentMethod === "CASH" ? "Tunai (CASH)" : "Transfer (CASHLESS)"}</span>
            </div>
            <div className="mt-1 flex justify-between text-xs text-slate-500">
              <span>Status</span>
              <span className="font-semibold text-emerald-600">{order.status}</span>
            </div>
          </div>

          <div className="px-6 py-4 border-b border-dashed border-slate-200">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Data Pembeli
            </p>
            <p className="text-sm font-semibold text-slate-800">{order.customer?.name || "-"}</p>
            <p className="text-xs text-slate-500">{order.customer?.phone || "-"}</p>
            <p className="text-xs text-slate-500">{order.customer?.email || "-"}</p>
            <p className="mt-1 text-xs text-slate-500">{order.customer?.address || "-"}</p>
            {order.note && (
              <p className="mt-1 text-xs text-slate-400 italic">Catatan: {order.note}</p>
            )}
          </div>

          <div className="px-6 py-4 border-b border-dashed border-slate-200">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Item Pesanan
            </p>
            <div className="space-y-2">
              {order.items?.map((it, idx) => (
                <div
                  key={`${it.slug || it.name || idx}`}
                  className="flex justify-between text-sm"
                >
                  <div>
                    <span className="font-medium text-slate-800">{it.name}</span>
                    <span className="ml-2 text-xs text-slate-400">
                      {it.qty} x {fmt(it.price)}
                    </span>
                  </div>
                  <span className="font-semibold text-slate-800">
                    {fmt((Number(it.qty) || 0) * (Number(it.price) || 0))}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 py-4 border-b border-dashed border-slate-200 space-y-1">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span>{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Ongkos Kirim</span>
              <span>{fmt(shipping)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-slate-900 pt-1 border-t border-slate-100 mt-1">
              <span>Total</span>
              <span>{fmt(total)}</span>
            </div>
          </div>

          <div className="px-6 py-4 text-center">
            <p className="text-xs text-slate-400">
              Terima kasih telah berbelanja di{" "}
              <span className="font-semibold">{settings.storeInfo.name || "toko kami"}</span>!
            </p>
            {settings.socialMedia.instagram && settings.socialMedia.instagram !== "-" && (
              <p className="mt-0.5 text-xs text-slate-400">
                IG: @{settings.socialMedia.instagram}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
