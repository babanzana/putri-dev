"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ref, set } from "firebase/database";
import { Shell } from "../../components/Shell";
import { db } from "../../lib/firebase";

const statusOptions = [
  "Menunggu Upload",
  "Menunggu Verifikasi",
  "Selesai",
  "Batal",
];

export default function OrderNewPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState(statusOptions[0]);
  const [proof, setProof] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = `ORD-${Date.now()}`;
    setSaving(true);
    setError(null);
    try {
      await set(ref(db, `orders/${id}`), {
        id,
        customer: { name: name.trim(), email: email.trim(), phone: phone.trim() },
        total: Number(total) || 0,
        status,
        paymentProofName: proof || null,
        paymentProofPath: null,
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
            <input
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="Total (Rp)"
              type="number"
              value={total}
              onChange={(e) => setTotal(Number(e.target.value))}
            />
            <select
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {statusOptions.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <input
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="Nama file bukti (opsional)"
              value={proof}
              onChange={(e) => setProof(e.target.value)}
            />
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
