"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, ChangeEvent } from "react";
import { onValue, ref, set } from "firebase/database";
import { ChevronDown, Upload } from "lucide-react";
import { Shell } from "../../components/Shell";
import { db } from "../../lib/firebase";
import { supabase } from "../../lib/supabaseClient";
import { normalizeImage } from "../../lib/image";

type ProductCard = {
  slug: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  rawPath?: string;
};

export default function OrderNewPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CASHLESS">("CASH");
  const [proofFileName, setProofFileName] = useState("");
  const [proofFilePath, setProofFilePath] = useState("");
  const [proofUploading, setProofUploading] = useState(false);
  const [proofError, setProofError] = useState<string | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductCard[]>([]);
  const [items, setItems] = useState<
    { slug: string; name: string; price: number; qty: number; image?: string | null }[]
  >([]);
  const [users, setUsers] = useState<
    { uid: string; name: string; email: string; phone?: string; address?: string }[]
  >([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [qtyByProduct, setQtyByProduct] = useState<Record<string, number>>({});
  const [resolvedImages, setResolvedImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const productsRef = ref(db, "products");
    const unsub = onValue(productsRef, (snap) => {
      const val = snap.val() as
        | Record<string, { slug: string; name: string; price: number; stock: number }>
        | null;
      const list = val ? Object.values(val) : [];
      setProducts(
        list.map((p) => ({
          slug: p.slug,
          name: p.name,
          price: Number(p.price) || 0,
          stock: Number(p.stock) || 0,
          rawPath: Array.isArray((p as { images?: string[] }).images)
            ? (p as { images?: string[] }).images?.[0]
            : undefined,
          image: normalizeImage(
            Array.isArray((p as { images?: string[] }).images)
              ? (p as { images?: string[] }).images?.[0]
              : undefined,
          ),
        })),
      );
    });
    const usersRef = ref(db, "users");
    const unsubUsers = onValue(usersRef, (snap) => {
      const val = snap.val() as
        | Record<string, { uid: string; name: string; email: string; phone?: string; address?: string }>
        | null;
      setUsers(val ? Object.values(val) : []);
    });
    return () => {
      unsub();
      unsubUsers();
    };
  }, []);

  useEffect(() => {
    if (!selectedUser) return;
    const user = users.find((u) => u.uid === selectedUser);
    if (!user) return;
    setName((prev) => (prev ? prev : user.name || ""));
    setEmail((prev) => (prev ? prev : user.email || ""));
    setPhone((prev) => (prev ? prev : user.phone || ""));
    setAddress((prev) => (prev ? prev : user.address || ""));
  }, [selectedUser, users]);

  const total = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.qty, 0),
    [items],
  );

  const filteredProducts = useMemo(() => {
    const term = productSearch.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.slug.toLowerCase().includes(term) ||
        (p.price || 0).toString().includes(term),
    );
  }, [productSearch, products]);

  useEffect(() => {
    const resolveImages = async () => {
      const need = products.filter(
        (p) => !resolvedImages[p.slug] && (p.rawPath || p.image),
      );
      if (need.length === 0) return;
      const entries: [string, string][] = [];
      for (const p of need) {
        const source = p.rawPath || p.image || "";
        if (source.startsWith("http")) {
          entries.push([p.slug, source]);
          continue;
        }
        const path = source.startsWith("/")
          ? source.replace(/^\/+/, "")
          : source.replace(/^putridev\//, "");
        if (!path) continue;
        const { data } = await supabase.storage.from("putridev").createSignedUrl(path, 60 * 60);
        if (data?.signedUrl) entries.push([p.slug, data.signedUrl]);
        else entries.push([p.slug, normalizeImage(source)]);
      }
      if (entries.length > 0) {
        setResolvedImages((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
      }
    };
    void resolveImages();
  }, [products, resolvedImages]);

  const handleAddFromCard = (slug: string) => {
    const product = products.find((p) => p.slug === slug);
    if (!product) return;
    const qty = Math.max(1, qtyByProduct[slug] || 1);
    const allowedQty = product.stock > 0 ? Math.min(qty, product.stock) : qty;
    setItems((prev) => {
      const found = prev.find((i) => i.slug === product.slug);
      if (found) {
        return prev.map((i) =>
          i.slug === product.slug ? { ...i, qty: Math.max(1, i.qty + allowedQty) } : i,
        );
      }
      return [
        ...prev,
        {
          slug: product.slug,
          name: product.name,
          price: product.price,
          qty: allowedQty,
          image: product.rawPath || product.image || null,
        },
      ];
    });
  };

  const handleProofChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setProofError("Supabase belum dikonfigurasi.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setProofError("Ukuran file maksimal 2MB.");
      return;
    }
    setProofUploading(true);
    setProofError(null);
    const safeName = file.name.replace(/\s+/g, "-");
    const path = `manual-proofs/${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage
      .from("putridev")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "application/octet-stream",
      });
    if (uploadError) {
      setProofError("Gagal upload bukti.");
      setProofUploading(false);
      return;
    }
    setProofFileName(file.name);
    setProofFilePath(path);
    const { data: signed } = await supabase.storage.from("putridev").createSignedUrl(path, 60 * 60);
    setProofPreview(signed?.signedUrl || null);
    setProofUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setError("Tambah minimal 1 produk.");
      return;
    }
    if (!name.trim()) {
      setError("Nama pelanggan wajib diisi.");
      return;
    }
    const id = `ORD-${Date.now()}`;
    setSaving(true);
    setError(null);
    try {
      await set(ref(db, `orders/${id}`), {
        id,
        customer: {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          address: address.trim(),
        },
        total: Number(total) || 0,
        subtotal: Number(total) || 0,
        shipping: 0,
        status: "Selesai",
        paymentProofName: paymentMethod === "CASHLESS" ? proofFileName || null : null,
        paymentProofPath: paymentMethod === "CASHLESS" ? proofFilePath || null : null,
        paymentMethod,
        items: items.map((it) => ({
          ...it,
          image: it.image || null,
        })),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      router.push("/orders");
    } catch (err) {
      setError("Gagal menyimpan pesanan, coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Shell active="orders" requiresAuth>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-slate-500">Tambah pesanan manual</p>
          <h1 className="text-2xl font-semibold">Order Baru</h1>
        </div>
        <form className="space-y-3 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5" onSubmit={handleSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-600">Cari pelanggan terdaftar</label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-xl border border-slate-200 px-3 py-2 pr-9 text-sm"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="">- Pilih pelanggan (opsional) -</option>
                  {users.map((u) => (
                    <option key={u.uid} value={u.uid}>
                      {u.name || u.email} ({u.email})
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
              <p className="text-[11px] text-slate-500">
                Jika tidak terdaftar, isi manual nama dan kontak di bawah.
              </p>
            </div>
            <input
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="Nama pelanggan"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="No. HP"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <textarea
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm sm:col-span-2"
              placeholder="Alamat pengiriman (opsional)"
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold text-slate-600">Tambah produk</p>
              <div className="mt-2 flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative w-full sm:w-64">
                    <input
                      className="w-full rounded-full border border-slate-200 px-3 py-2 text-sm"
                      placeholder="Cari produk..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                    />
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                  <p className="text-[11px] text-slate-500">Klik tambah pada kartu untuk memasukkan produk.</p>
                </div>
                <div className="grid max-h-72 grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-2 lg:grid-cols-4">
                  {filteredProducts.map((p) => (
                    <div
                      key={p.slug}
                      className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                    >
                      <div className="h-14 w-14 overflow-hidden rounded-lg bg-slate-100">
                        {resolvedImages[p.slug] || p.image ? (
                          <img
                            src={resolvedImages[p.slug] || (p.rawPath ? normalizeImage(p.rawPath) : p.image)}
                            alt={p.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[11px] text-slate-400">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-semibold text-slate-900 line-clamp-2">{p.name}</p>
                        <p className="text-xs text-slate-500">
                          Rp {p.price.toLocaleString("id-ID")} • Stok {p.stock}
                        </p>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={1}
                            className="w-16 rounded-lg border border-slate-200 px-2 py-1 text-xs"
                            value={qtyByProduct[p.slug] || 1}
                            onChange={(e) =>
                              setQtyByProduct((prev) => ({
                                ...prev,
                                [p.slug]: Math.max(1, Number(e.target.value) || 1),
                              }))
                            }
                          />
                          <button
                            type="button"
                            className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm disabled:opacity-60"
                            onClick={() => handleAddFromCard(p.slug)}
                            disabled={p.stock === 0}
                          >
                            Tambah
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredProducts.length === 0 && (
                    <p className="text-xs text-slate-500 sm:col-span-2 lg:col-span-3">
                      Tidak ada produk untuk kata kunci tersebut.
                    </p>
                  )}
                </div>
                {items.length > 0 && (
                  <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-900">Produk tertambah</p>
                      <span className="text-xs text-slate-500">Klik hapus untuk mengeluarkan</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {items.map((it) => (
                        <div key={it.slug} className="flex items-center justify-between py-2 text-sm">
                          <div>
                            <p className="font-semibold text-slate-900">{it.name}</p>
                            <p className="text-xs text-slate-500">
                              Qty {it.qty} x Rp {it.price.toLocaleString("id-ID")}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900">
                              Rp {(it.qty * it.price).toLocaleString("id-ID")}
                            </span>
                            <button
                              type="button"
                              className="text-xs font-semibold text-rose-600 hover:underline"
                              onClick={() =>
                                setItems((prev) => prev.filter((p) => p.slug !== it.slug))
                              }
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {items.length > 0 && (
                <div className="flex justify-between px-3 py-2 text-sm font-semibold text-slate-900">
                  <span>Total</span>
                  <span>Rp {total.toLocaleString("id-ID")}</span>
                </div>
              )}
            </div>
            <input
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="Total (otomatis dari item)"
              type="number"
              value={total}
              readOnly
            />
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 text-sm">
              <span className="text-xs font-semibold text-slate-600">Metode</span>
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="radio"
                  checked={paymentMethod === "CASH"}
                  onChange={() => setPaymentMethod("CASH")}
                />
                CASH
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="radio"
                  checked={paymentMethod === "CASHLESS"}
                  onChange={() => setPaymentMethod("CASHLESS")}
                />
                CASHLESS
              </label>
            </div>
            {paymentMethod === "CASHLESS" ? (
              <div className="flex flex-col gap-1 text-sm sm:col-span-2">
                <label className="text-xs font-semibold text-slate-600">Bukti pembayaran (opsional)</label>
                <div className="flex flex-wrap items-center gap-2">
                  {!proofPreview && (
                    <label
                      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold shadow-sm ${proofUploading ? "border-slate-200 bg-slate-100 text-slate-500" : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300"}`}
                    >
                      <Upload className="h-4 w-4" />
                      {proofUploading ? "Mengunggah..." : "Tambah bukti foto"}
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleProofChange}
                        disabled={proofUploading}
                      />
                    </label>
                  )}
                  {proofPreview && (
                    <div className="flex items-center gap-3">
                      <img
                        src={proofPreview}
                        alt={proofFileName || "Bukti pembayaran"}
                        className="h-16 w-16 rounded-lg border border-slate-200 object-cover"
                      />
                      <div className="space-y-1 text-xs">
                        <p className="font-semibold text-slate-700">{proofFileName}</p>
                        <button
                          type="button"
                          className="text-rose-600 underline"
                          onClick={() => {
                            setProofFileName("");
                            setProofFilePath("");
                            setProofPreview(null);
                          }}
                        >
                          Hapus foto
                        </button>
                      </div>
                    </div>
                  )}
                  {proofError && (
                    <span className="text-[11px] font-semibold text-rose-600">{proofError}</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Status otomatis <strong>Selesai</strong> untuk pesanan manual.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1 text-sm sm:col-span-2">
                <label className="text-xs font-semibold text-slate-600">Catatan bukti (opsional)</label>
                <input
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Contoh: bayar tunai di toko"
                  value={proofFileName}
                  onChange={(e) => setProofFileName(e.target.value)}
                />
                <p className="text-[11px] text-slate-500">
                  Status otomatis <strong>Selesai</strong> untuk pesanan manual.
                </p>
              </div>
            )}
          </div>
          {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className={`rounded-lg px-4 py-2 text-xs font-semibold text-white shadow-sm ${saving ? "bg-slate-300" : "bg-gradient-to-r from-emerald-500 to-teal-600"}`}
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/orders")}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </Shell>
  );
}
