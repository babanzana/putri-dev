"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Shell } from "../components/Shell";
import { Badge } from "../components/ui";
import { useCart } from "../components/CartProvider";

export default function CheckoutPage() {
  const router = useRouter();
  const { selectedItems, totalPrice, clear } = useCart();
  const [note, setNote] = useState("");
  const [paid, setPaid] = useState(false);

  if (selectedItems.length === 0) {
    return (
      <Shell active="cart" requiresAuth>
        <div className="mx-auto max-w-xl space-y-4 rounded-2xl border border-slate-100 bg-white/80 p-6 text-center shadow-sm ring-1 ring-black/5">
          <p className="text-sm text-slate-600">
            Tidak ada item terpilih. Pilih produk di keranjang dahulu.
          </p>
          <Link
            href="/cart"
            className="inline-flex justify-center rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm"
          >
            Kembali ke keranjang
          </Link>
        </div>
      </Shell>
    );
  }

  const handleConfirm = () => {
    setPaid(true);
    clear();
    setTimeout(() => router.push("/history"), 800);
  };

  return (
    <Shell active="cart" requiresAuth>
      <div className="grid gap-5 lg:grid-cols-[1.5fr,1fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Review pesanan</p>
              <h1 className="text-2xl font-semibold">Checkout</h1>
            </div>
            <Badge tone="success">Terpilih: {selectedItems.length}</Badge>
          </div>

          <div className="space-y-3">
            {selectedItems.map((item) => (
              <div
                key={item.slug}
                className="flex gap-3 rounded-2xl border border-slate-100 bg-white/80 p-3 shadow-sm ring-1 ring-black/5"
              >
                <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-slate-100">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">Qty: {item.qty}</p>
                  <p className="text-sm font-semibold text-amber-700">
                    Rp {(item.qty * item.price).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5">
            <p className="text-sm font-semibold text-slate-900">Alamat Pengiriman</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                defaultValue="Adi Pratama"
                placeholder="Nama penerima"
              />
              <input
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                defaultValue="0812-3344-5566"
                placeholder="No. HP"
              />
              <textarea
                className="sm:col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                rows={3}
                defaultValue="Jl. Melati No. 10, Bandung"
                placeholder="Alamat lengkap"
              />
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-600">Catatan untuk kurir</label>
                <textarea
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Misal: tolong hubungi sebelum sampai"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5">
            <p className="text-sm font-semibold text-slate-900">Upload Bukti Pembayaran</p>
            <p className="text-xs text-slate-500">Transfer ke BCA 1234567890 a.n Ponti Pratama</p>
            <input type="file" className="w-full text-sm" accept="image/*" />
            <p className="text-xs text-slate-500">Format: JPG/PNG, max 2MB (dummy)</p>
          </div>
        </div>

        <div className="space-y-3 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5">
          <p className="text-sm font-semibold text-slate-900">Ringkasan Pembayaran</p>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between">
              <span>Ongkir (estimasi)</span>
              <span>Rp 20.000</span>
            </div>
            <div className="flex justify-between font-semibold text-slate-900">
              <span>Total</span>
              <span>
                Rp {(totalPrice + 20000).toLocaleString("id-ID")}
              </span>
            </div>
          </div>
          <button
            onClick={handleConfirm}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm"
          >
            Konfirmasi & Kirim
          </button>
          {paid && (
            <div className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              Pembayaran dikirim (dummy). Mengalihkan ke riwayat...
            </div>
          )}
          <Link
            href="/cart"
            className="block text-center text-xs font-semibold text-amber-700 hover:underline"
          >
            Kembali ke keranjang
          </Link>
        </div>
      </div>
    </Shell>
  );
}
