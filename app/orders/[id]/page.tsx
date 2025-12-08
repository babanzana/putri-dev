"use client";
import { ChevronDown } from "lucide-react";
import { onValue, ref, update } from "firebase/database";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Shell } from "../../components/Shell";
import { Badge } from "../../components/ui";
import { db } from "../../lib/firebase";
import { supabase } from "../../lib/supabaseClient";

type OrderItem = {
  name?: string;
  slug?: string;
  qty?: number;
  price?: number;
  image?: string;
};

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
  "Menunggu Upload",
  "Menunggu Verifikasi",
  "Selesai",
  "Batal",
];

const formatCurrency = (value?: number) =>
  `Rp ${(Number(value) || 0).toLocaleString("id-ID")}`;

const formatDate = (ts?: number) =>
  ts ? new Date(ts).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : "-";

export default function OrderEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [status, setStatus] = useState(statusOptions[0]);
  const [total, setTotal] = useState(0);
  const [proof, setProof] = useState("");
  const [showProof, setShowProof] = useState(false);
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [itemUrls, setItemUrls] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const orderRef = ref(db, `orders/${id}`);
    const unsub = onValue(orderRef, (snap) => {
      const val = snap.val() as OrderRecord | null;
      setOrder(val);
      setStatus(val?.status || statusOptions[0]);
      setTotal(Number(val?.total) || 0);
      setProof(val?.paymentProofName || "");
      setLoading(false);
    });
    return () => unsub();
  }, [id]);

  useEffect(() => {
    const fetchProof = async () => {
      if (!order?.paymentProofPath) {
        setProofUrl(null);
        return;
      }
      const path = order.paymentProofPath;
      if (path.startsWith("http")) {
        setProofUrl(path);
        return;
      }
      const { data, error } = await supabase.storage.from("putridev").createSignedUrl(path, 60 * 60);
      if (error) {
        setProofUrl(null);
        return;
      }
      setProofUrl(data.signedUrl);
    };
    void fetchProof();
  }, [order?.paymentProofPath]);

  useEffect(() => {
    const fetchItemImages = async () => {
      if (!order?.items || order.items.length === 0) {
        setItemUrls({});
        return;
      }
      const bucketUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/putridev/`
        : "";
      const entries = await Promise.all(
        order.items.map(async (it, idx) => {
          const key = `${it.slug || it.name || "item"}-${idx}`;
          if (!it.image) return [key, ""];
          if (it.image.startsWith("http")) return [key, it.image];
          const { data, error } = await supabase.storage.from("putridev").createSignedUrl(it.image, 60 * 60);
          if (data?.signedUrl) return [key, data.signedUrl];
          if (error && bucketUrl) return [key, `${bucketUrl}${it.image}`];
          return [key, ""];
        }),
      );
      setItemUrls(Object.fromEntries(entries));
    };
    void fetchItemImages();
  }, [order?.items]);

  const derivedSubtotal =
    order?.subtotal ??
    order?.items?.reduce(
      (acc, item) => acc + (Number(item.qty) || 0) * (Number(item.price) || 0),
      0,
    ) ??
    0;
  const shipping = order?.shipping ?? 0;
  const derivedTotal = total || derivedSubtotal + shipping;
  const proofName = order?.paymentProofName || order?.paymentProofPath || "";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    setSaving(true);
    setError(null);
    try {
      await update(ref(db, `orders/${order.id}`), {
        status,
        total,
        paymentProofName: proof || null,
        updatedAt: Date.now(),
      });
      router.push("/orders");
    } catch {
      setError("Gagal memperbarui pesanan.");
    } finally {
      setSaving(false);
    }
  };

  const badgeTone =
    status === "Selesai"
      ? "success"
      : status === "Menunggu Verifikasi"
        ? "neutral"
        : status === "Batal"
          ? "warning"
          : "warning";

  if (loading) {
    return (
      <Shell active="orders" requiresAuth>
        <div className="rounded-2xl bg-white/80 px-4 py-6 text-sm text-slate-600 ring-1 ring-slate-200">
          Memuat pesanan...
        </div>
      </Shell>
    );
  }

  if (!order) {
    return (
      <Shell active="orders" requiresAuth>
        <div className="rounded-2xl bg-white/80 px-4 py-6 text-sm text-slate-600 ring-1 ring-slate-200">
          Pesanan tidak ditemukan.
        </div>
      </Shell>
    );
  }

  return (
    <Shell active="orders" requiresAuth>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Edit pesanan</p>
            <h1 className="text-2xl font-semibold">{order.id}</h1>
            <p className="text-xs text-slate-500">
              {order.customer?.name} - {order.customer?.email}
            </p>
            <p className="text-xs text-slate-500">Dibuat: {formatDate(order.createdAt)}</p>
          </div>
          <Badge tone={badgeTone}>{order.status}</Badge>
        </div>

        <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5">
          <h3 className="text-sm font-semibold text-slate-700">Detail Customer</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs text-slate-500">Nama</p>
              <p className="text-sm text-slate-700">{order.customer?.name || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Email</p>
              <p className="text-sm text-slate-700">{order.customer?.email || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Telepon</p>
              <p className="text-sm text-slate-700">{order.customer?.phone || "-"}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-slate-500">Alamat</p>
              <p className="text-sm text-slate-700">{order.customer?.address || "-"}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">Item Pesanan</h3>
            <p className="text-xs text-slate-500">Dibuat: {formatDate(order.createdAt)}</p>
          </div>
          <div className="mt-3 space-y-2">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, idx) => (
                <div
                  key={`${item.slug || item.name || "item"}-${idx}`}
                  className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-100">
                      {item.image ? (
                        <img
                          src={
                            itemUrls[`${item.slug || item.name || "item"}-${idx}`] ||
                            (item.image.startsWith("http")
                              ? item.image
                              : `${process.env.NEXT_PUBLIC_SUPABASE_URL || ""}/storage/v1/object/public/putridev/${item.image}`)
                          }
                          alt={item.name || "Produk"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
                          No Image
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500">
                        Qty: {item.qty} x {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    {formatCurrency((Number(item.qty) || 0) * (Number(item.price) || 0))}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Belum ada item pada pesanan ini.</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5">
            <h3 className="text-sm font-semibold text-slate-700">Ringkasan Pembayaran</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(derivedSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Ongkir</span>
                <span>{formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(derivedTotal)}</span>
              </div>
            <div className="pt-2">
              <p className="text-xs text-slate-500">Bukti pembayaran</p>
              {proofUrl ? (
                <div className="mt-1 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowProof(true)}
                    className="h-14 w-14 overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                    title="Lihat bukti"
                  >
                    <img
                      src={proofUrl}
                      alt="Bukti pembayaran"
                      className="h-full w-full object-cover"
                    />
                  </button>
                  <div className="text-sm text-slate-700">
                    <p className="font-semibold">{proofName || "Bukti"}</p>
                    <p className="text-xs text-slate-500">Klik thumbnail untuk perbesar</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-700">Belum ada bukti pembayaran</p>
              )}
            </div>
              {order.note && (
                <div className="pt-2">
                  <p className="text-xs text-slate-500">Catatan</p>
                  <p className="text-sm text-slate-700">{order.note}</p>
                </div>
              )}
            </div>
          </div>

          <form
            className="space-y-3 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5"
            onSubmit={handleSave}
          >
            <h3 className="text-sm font-semibold text-slate-700">Update Pesanan</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs text-slate-500">Status</p>
                <div className="relative mt-1">
                  <select
                    className="w-full appearance-none rounded-xl border border-slate-200 px-3 py-2 pr-10 text-sm"
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
              <div>
                <p className="text-xs text-slate-500">Total (Rp)</p>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  type="number"
                  value={total}
                  onChange={(e) => setTotal(Number(e.target.value))}
                />
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-slate-500">Nama bukti (opsional)</p>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={proof}
                  onChange={(e) => setProof(e.target.value)}
                />
              </div>
            </div>
            {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className={`rounded-lg px-4 py-2 text-xs font-semibold text-white shadow-sm ${
                  saving ? "bg-slate-300" : "bg-gradient-to-r from-emerald-500 to-teal-600"
                }`}
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
      </div>
      {showProof && proofUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setShowProof(false)}>
          <div className="max-h-[90vh] max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end border-b border-slate-200 p-3">
              <button
                type="button"
                className="text-sm font-semibold text-slate-600 hover:text-slate-900"
                onClick={() => setShowProof(false)}
              >
                Tutup
              </button>
            </div>
            <div className="bg-slate-900">
              <img
                src={proofUrl}
                alt="Bukti pembayaran"
                className="h-full w-full max-h-[80vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}
