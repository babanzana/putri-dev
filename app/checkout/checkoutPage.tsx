"use client";
import { onValue, ref, set, update } from "firebase/database";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { Banknote, MessageCircle } from "lucide-react";
import { Shell } from "../components/Shell";
import { Badge } from "../components/ui";
import { useCart } from "../components/CartProvider";
import { useAuth } from "../components/AuthProvider";
import { db } from "../lib/firebase";
import { supabase } from "../lib/supabaseClient";
import { useStoreSettings } from "../lib/useStoreSettings";
export default function CheckoutPage() {
  const router = useRouter();
  const { selectedItems, totalPrice, clear } = useCart();
  const { user } = useAuth();
  const { settings } = useStoreSettings();
  const [recipient, setRecipient] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [paid, setPaid] = useState(false);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [proofName, setProofName] = useState("");
  const [showProofModal, setShowProofModal] = useState(false);
  const [proofPath, setProofPath] = useState("");
  const [proofUploading, setProofUploading] = useState(false);
  const [proofError, setProofError] = useState<string | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const removeProofFromStorage = async (path: string) => {
    try {
      await supabase.storage.from("putridev").remove([path]);
    } catch {
      // swallow errors for cleanup
    }
  };
  const clearProof = () => {
    if (proofPath) {
      void removeProofFromStorage(proofPath);
    }
    setProofName("");
    setProofPath("");
    setProofError(null);
    setProofUploading(false);
    setProofPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setShowProofModal(false);
  };
  useEffect(() => {
    if (!user?.uid) return;
    const userRef = ref(db, `users/${user.uid}`);
    const unsub = onValue(userRef, (snap) => {
      const val = snap.val() as {
        name?: string;
        phone?: string;
        address?: string;
      } | null;
      if (!val) return;
      setRecipient((prev) => (prev ? prev : val.name || user.name || ""));
      setPhone((prev) => (prev ? prev : val.phone || ""));
      setAddress((prev) => (prev ? prev : val.address || ""));
    });
    return () => unsub();
  }, [user]);
  useEffect(
    () => () => {
      if (proofPreview) URL.revokeObjectURL(proofPreview);
    },
    [proofPreview],
  );
  const handleProofChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setProofError("Ukuran file lebih dari 2MB.");
      return;
    }
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      setProofError("Supabase belum dikonfigurasi (URL/Anon key kosong).");
      return;
    }
    setProofError(null);
    setProofName(file.name);
    setProofUploading(true);
    if (proofPath) {
      // Upsert manual: hapus file lama supaya tidak menumpuk.
      await removeProofFromStorage(proofPath);
    }
    const safeName = file.name.replace(/\s+/g, "-");
    const path = `proofs/${user?.uid || "guest"}/${Date.now()}-${safeName}`;
    const { error } = await supabase.storage
      .from("putridev")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "application/octet-stream",
      });
    if (error) {
      setProofError("Gagal mengunggah bukti, coba lagi.");
      setProofUploading(false);
      return;
    }
    setProofPath(path);
    const nextUrl = URL.createObjectURL(file);
    setProofPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return nextUrl;
    });
    setShowProofModal(false);
    setProofUploading(false);
  };
  if (selectedItems.length === 0) {
    return (
      <Shell active="cart" requiresAuth>
        {" "}
        <div className="mx-auto max-w-xl space-y-4 rounded-2xl border border-slate-100 bg-white/80 p-6 text-center shadow-sm ring-1 ring-black/5">
          {" "}
          <p className="text-sm text-slate-600">
            {" "}
            Tidak ada item terpilih. Pilih produk di keranjang dahulu.{" "}
          </p>{" "}
          <Link
            href="/cart"
            className="inline-flex justify-center rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm"
          >
            {" "}
            Kembali ke keranjang{" "}
          </Link>{" "}
        </div>{" "}
      </Shell>
    );
  }
  const handleConfirm = async () => {
    if (!user?.uid) {
      setSaveError("Silakan login sebelum konfirmasi.");
      return;
    }
    const insufficient = selectedItems.filter((i) => i.qty > (i.stock ?? 0));
    if (insufficient.length > 0) {
      setSaveError(
        `Stok tidak cukup untuk: ${insufficient
          .map((i) => `${i.name} (tersisa ${i.stock})`)
          .join(", ")}.`,
      );
      return;
    }
    setSaveError(null);
    setSavingOrder(true);
    const orderId = `ORD-${Date.now()}`;
    const shippingFee = 15000;
    const payload = {
      id: orderId,
      userId: user.uid,
      customer: {
        name: recipient || user.name,
        email: user.email,
        phone,
        address,
      },
      note,
      status: proofPath ? "Menunggu Verifikasi" : "Menunggu Upload",
      paymentProofPath: proofPath || null,
      paymentProofName: proofName || null,
      subtotal: totalPrice,
      shipping: shippingFee,
      total: totalPrice + shippingFee,
      items: selectedItems.map((i) => ({
        slug: i.slug,
        name: i.name,
        qty: i.qty,
        price: i.price,
        image: i.image,
      })),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    try {
      await set(ref(db, `orders/${orderId}`), payload);
      await set(ref(db, `userOrders/${user.uid}/${orderId}`), true);
      await Promise.all(
        selectedItems.map((i) =>
          update(ref(db, `products/${i.slug}`), {
            stock: Math.max(0, (i.stock ?? 0) - i.qty),
          }),
        ),
      );
      setPaid(true);
      clear();
      setTimeout(() => router.push("/history"), 800);
    } catch (err) {
      setSaveError("Gagal menyimpan transaksi, coba lagi.");
    } finally {
      setSavingOrder(false);
    }
  };
  return (
    <Shell active="cart" requiresAuth>
      {" "}
      <div className="grid gap-5 lg:grid-cols-[1.5fr,1fr]">
        {" "}
        <div className="space-y-4">
          {" "}
          <div className="flex items-center justify-between">
            {" "}
            <div>
              {" "}
              <p className="text-sm text-slate-500">Review pesanan</p>{" "}
              <h1 className="text-2xl font-semibold">Checkout</h1>{" "}
            </div>{" "}
            <Badge tone="success">Terpilih: {selectedItems.length}</Badge>{" "}
          </div>{" "}
          <div className="space-y-3">
            {" "}
            {selectedItems.map((item) => (
              <div
                key={item.slug}
                className="flex gap-3 rounded-2xl border border-slate-100 bg-white/80 p-3 shadow-sm ring-1 ring-black/5"
              >
                {" "}
                <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-slate-100">
                  {" "}
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />{" "}
                </div>{" "}
                <div className="flex-1 space-y-1">
                  {" "}
                  <p className="text-sm font-semibold text-slate-900">
                    {item.name}
                  </p>{" "}
                  <p className="text-xs text-slate-500">Qty: {item.qty}</p>{" "}
                  <p className="text-sm font-semibold text-amber-700">
                    {" "}
                    Rp {(item.qty * item.price).toLocaleString("id-ID")}{" "}
                  </p>{" "}
                </div>{" "}
              </div>
            ))}{" "}
          </div>{" "}
          <div className="space-y-3 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5">
            {" "}
            <p className="text-sm font-semibold text-slate-900">
              Alamat Pengiriman
            </p>{" "}
            <div className="grid gap-3 sm:grid-cols-2">
              {" "}
              <input
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Nama penerima"
              />{" "}
              <input
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="No. HP"
              />{" "}
              <textarea
                className="sm:col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Alamat lengkap"
              />{" "}
              <div className="sm:col-span-2">
                {" "}
                <label className="text-xs font-semibold text-slate-600">
                  Catatan untuk kurir
                </label>{" "}
                <textarea
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Misal: tolong hubungi sebelum sampai"
                />{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="space-y-3 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5">
            <p className="text-sm font-semibold text-slate-900">
              Upload Bukti Pembayaran
            </p>
            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <Banknote className="h-4 w-4 text-amber-600" />
                <span>
                  Transfer ke{" "}
                  {settings.bankAccounts[0]
                    ? `${settings.bankAccounts[0].bank} ${settings.bankAccounts[0].number} a.n ${settings.bankAccounts[0].holder}`
                    : "rekening belum diatur"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                <span>
                  Konfirmasi via WhatsApp {settings.contact.whatsapp || "-"}
                </span>
              </div>
            </div>
            <div className="space-y-3 rounded-xl border border-dashed border-slate-200 bg-white/70 p-4">
              {!proofPreview && (
                <label
                  htmlFor="payment-proof"
                  className={`flex items-center gap-3 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-200 hover:bg-amber-100 ${proofUploading ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg text-amber-700 shadow">
                    +
                  </span>
                  <div className="leading-tight">
                    <span>{proofUploading ? "Mengunggah..." : "Pilih file bukti"}</span>
                    <p className="text-[11px] font-normal text-amber-700">
                      JPG/PNG, max 2MB
                    </p>
                  </div>
                </label>
              )}
              <input
                id="payment-proof"
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={proofUploading}
                onChange={handleProofChange}
              />
              <div className="space-y-1 text-xs text-slate-500">
                <p>
                  {proofUploading
                    ? "Mengunggah ke Supabase..."
                    : proofName
                      ? `File terpilih: ${proofName}`
                      : "Belum ada file terpilih"}
                </p>
                {proofPath && (
                  <p className="break-all text-[11px] text-slate-500">
                    Path tersimpan: {proofPath}
                  </p>
                )}
                {proofError && (
                  <p className="text-[11px] font-semibold text-rose-600">{proofError}</p>
                )}
              </div>
              {proofPreview && (
                <div className="pt-1">
                  <p className="text-xs font-semibold text-slate-700">Pratinjau</p>
                  <div className="mt-2 flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => setShowProofModal(true)}
                      className="group relative h-28 w-28 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5"
                    >
                      <img
                        src={proofPreview}
                        alt="Pratinjau bukti pembayaran"
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    </button>
                    <div className="space-y-2 text-[11px] text-slate-500">
                      <p>Klik gambar untuk memperbesar di modal.</p>
                      <button
                        type="button"
                        onClick={clearProof}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
                      >
                        Hapus bukti
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>{" "}
        <div className="space-y-3 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5">
          {" "}
          <p className="text-sm font-semibold text-slate-900">
            Ringkasan Pembayaran
          </p>{" "}
          <div className="space-y-2 text-sm text-slate-600">
            {" "}
            <div className="flex justify-between">
              {" "}
              <span>Subtotal</span>{" "}
              <span>Rp {totalPrice.toLocaleString("id-ID")}</span>{" "}
            </div>{" "}
            <div className="flex justify-between">
              {" "}
              <span>Ongkir (estimasi)</span> <span>Rp 15.000</span>{" "}
            </div>{" "}
            <div className="flex justify-between font-semibold text-slate-900">
              {" "}
              <span>Total</span>{" "}
              <span>
                {" "}
                Rp {(totalPrice + 15000).toLocaleString("id-ID")}{" "}
              </span>{" "}
            </div>{" "}
          </div>{" "}
          <button
            onClick={handleConfirm}
            disabled={
              savingOrder ||
              proofUploading ||
              selectedItems.length === 0 ||
              selectedItems.some((i) => (i.stock ?? 0) <= 0)
            }
            className={`w-full rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm ${savingOrder || proofUploading || selectedItems.some((i) => (i.stock ?? 0) <= 0) ? "bg-slate-300 cursor-not-allowed" : "bg-gradient-to-r from-emerald-500 to-teal-600"}`}
          >
            {savingOrder ? "Menyimpan..." : "Konfirmasi & Kirim"}
          </button>{" "}
          {saveError && (
            <div className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">
              {saveError}
            </div>
          )}
          {paid && (
            <div className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              Berhasil membuat transaksi. Mengalihkan ke riwayat...
            </div>
          )}{" "}
          <Link
            href="/cart"
            className="block text-center text-xs font-semibold text-amber-700 hover:underline"
          >
            {" "}
            Kembali ke keranjang{" "}
          </Link>{" "}
        </div>{" "}
      </div>{" "}
      {showProofModal && proofPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowProofModal(false)}
        >
          <div
            className="relative max-h-[80vh] max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={proofPreview}
              alt="Bukti pembayaran"
              className="max-h-[80vh] rounded-2xl shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setShowProofModal(false)}
              className="absolute -right-3 -top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-slate-700 shadow"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </Shell>
  );
}
