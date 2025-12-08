"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Banknote, MessageCircle } from "lucide-react";
import { Shell } from "../components/Shell";
import { Badge } from "../components/ui";
import { useCart } from "../components/CartProvider";
import { useStoreSettings } from "../lib/useStoreSettings";
export default function CartPage() {
  const router = useRouter();
  const { settings } = useStoreSettings();
  const bank = settings.bankAccounts[0];
  const {
    items,
    updateQty,
    toggleSelect,
    selectAll,
    removeItem,
    selectedItems,
    totalPrice,
  } = useCart();
  const allSelected = items.length > 0 && items.every((i) => i.selected);
  const hasOutOfStock = selectedItems.some((i) => (i.stock ?? 0) <= 0);
  return (
    <Shell active="cart" requiresAuth>
      {" "}
      <div className="space-y-4">
        {" "}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {" "}
          <div>
            {" "}
            <p className="text-sm text-slate-500">Keranjang belanja</p>{" "}
            <h1 className="text-2xl font-semibold">Keranjang</h1>{" "}
          </div>{" "}
          <div className="flex items-center gap-2 text-sm text-slate-600">
            {" "}
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => selectAll(e.target.checked)}
            />{" "}
            <span>Pilih semua</span>{" "}
            <Badge tone="neutral">{items.length} item</Badge>{" "}
          </div>{" "}
        </div>{" "}
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 px-4 py-8 text-center text-sm text-slate-600">
            {" "}
            Keranjang kosong.{" "}
            <Link href="/catalog" className="text-amber-700 font-semibold">
              Cari produk
            </Link>{" "}
          </div>
        ) : (
          <div className="space-y-3">
            {" "}
            {items.map((item) => (
              <div
                key={item.slug}
                className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white/80 p-3 shadow-sm ring-1 ring-black/5 sm:flex-row sm:items-center"
              >
                {" "}
                <div className="flex items-center gap-3">
                  {" "}
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleSelect(item.slug)}
                  />{" "}
                  <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-slate-100">
                    {" "}
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />{" "}
                  </div>{" "}
                </div>{" "}
                <div className="flex-1 space-y-1">
                  {" "}
                  <p className="text-sm font-semibold text-slate-900">
                    {item.name}
                  </p>{" "}
                  <p className="text-xs text-slate-500">
                    {" "}
                    Rp {item.price.toLocaleString("id-ID")} / item{" "}
                  </p>{" "}
                </div>{" "}
                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                  {" "}
                  <div className="flex items-center rounded-xl border border-slate-200">
                    {" "}
                    <button
                      className="px-3 py-2 text-sm font-semibold text-slate-700"
                      onClick={() =>
                        updateQty(item.slug, Math.max(1, item.qty - 1))
                      }
                    >
                      {" "}
                      -{" "}
                    </button>{" "}
                    <div className="px-4 py-2 text-sm font-semibold text-slate-900">
                      {item.qty}
                    </div>{" "}
                    <button
                      className={`px-3 py-2 text-sm font-semibold ${item.qty >= item.stock ? "text-slate-400 cursor-not-allowed" : "text-slate-700"}`}
                      disabled={item.qty >= item.stock}
                      onClick={() => updateQty(item.slug, item.qty + 1)}
                    >
                      {" "}
                      +{" "}
                    </button>{" "}
                  </div>{" "}
                  <p className="text-sm font-semibold text-amber-700">
                    {" "}
                    Rp {(item.qty * item.price).toLocaleString("id-ID")}{" "}
                  </p>{" "}
                  <p className="text-[11px] text-slate-500">
                    Stok max: {item.stock}
                  </p>{" "}
                  <button
                    className="text-xs font-semibold text-rose-600 hover:underline"
                    onClick={() => removeItem(item.slug)}
                  >
                    {" "}
                    Hapus{" "}
                  </button>{" "}
                </div>{" "}
              </div>
            ))}{" "}
          </div>
        )}{" "}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur">
          {" "}
          <div>
            {" "}
            <p className="text-sm text-slate-500">Subtotal (terpilih)</p>{" "}
            <p className="text-xl font-semibold text-amber-700">
              {" "}
              Rp {totalPrice.toLocaleString("id-ID")}{" "}
            </p>{" "}
          </div>{" "}
          <div className="flex gap-2">
            {" "}
            <Link
              href="/catalog"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              {" "}
              Lanjut belanja{" "}
            </Link>{" "}
            <button
              disabled={selectedItems.length === 0 || hasOutOfStock}
              onClick={() => router.push("/checkout")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm ${selectedItems.length === 0 || hasOutOfStock ? "bg-slate-300 cursor-not-allowed" : "bg-gradient-to-r from-amber-500 to-orange-600"}`}
            >
              {" "}
              Checkout{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
        <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5">
          <p className="text-sm font-semibold text-slate-900">
            Pembayaran & Konfirmasi
          </p>
          <div className="mt-2 space-y-1 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <Banknote className="h-4 w-4 text-amber-600" />
              <span>
                {bank
                  ? `${bank.bank} ${bank.number} a.n ${bank.holder}`
                  : "Rekening belum diatur"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-emerald-600" />
              <span>Konfirmasi via WhatsApp {settings.contact.whatsapp || "-"}</span>
            </div>
          </div>
        </div>
      </div>{" "}
    </Shell>
  );
}
