"use client";
import { onValue, ref, update } from "firebase/database";
import { useEffect, useState } from "react";
import { Shell } from "../components/Shell";
import { useAuth } from "../components/AuthProvider";
import { db } from "../lib/firebase";
type ProfileData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  role?: string;
  label?: string | null;
};
export default function ProfilePage() {
  const { user, hydrated } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: undefined,
    label: null,
  });
  const [initialProfile, setInitialProfile] = useState<ProfileData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    if (!hydrated || !user) return;
    const userRef = ref(db, `users/${user.uid}`);
    const unsub = onValue(userRef, (snap) => {
      const val = snap.val() as ProfileData | null;
      setProfile({
        name: val?.name || user.name || "",
        email: val?.email || user.email || "",
        phone: val?.phone || "",
        address: val?.address || "",
        role: val?.role,
        label: val?.label ?? null,
      });
      setInitialProfile({
        name: val?.name || user.name || "",
        email: val?.email || user.email || "",
        phone: val?.phone || "",
        address: val?.address || "",
        role: val?.role,
        label: val?.label ?? null,
      });
      setLoading(false);
    });
    return () => unsub();
  }, [hydrated, user]);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || saving) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const userRef = ref(db, `users/${user.uid}`);
      await update(userRef, {
        name: profile.name.trim(),
        email: profile.email,
        phone: profile.phone.trim(),
        address: profile.address.trim(),
        role: profile.role || user.role,
        label: profile.label ?? null,
        updatedAt: Date.now(),
      });
      setMessage("Profil berhasil disimpan.");
    } catch (err) {
      setError("Gagal menyimpan profil. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };
  if (!hydrated) {
    return (
      <Shell active="profile" requiresAuth>
        {" "}
        <div className="mx-auto max-w-xl rounded-2xl bg-white/80 px-4 py-6 text-sm text-slate-600 ring-1 ring-slate-200">
          {" "}
          Memuat profil...{" "}
        </div>{" "}
      </Shell>
    );
  }
  return (
    <Shell active="profile" requiresAuth>
      {" "}
      <div className="space-y-4">
        {" "}
        <div>
          {" "}
          <h1 className="text-2xl font-semibold">Profil Saya</h1>{" "}
        </div>{" "}
        <div className="grid gap-4 lg:grid-cols-2">
          {" "}
          <form
            className="space-y-3 rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-black/5"
            onSubmit={handleSubmit}
          >
            {" "}
            <p className="text-sm font-semibold text-slate-900">
              Data Akun
            </p>{" "}
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="Nama lengkap"
              value={profile.name}
              onChange={(e) =>
                setProfile((p) => ({ ...p, name: e.target.value }))
              }
              disabled={loading || saving}
            />{" "}
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50"
              placeholder="Email"
              value={profile.email}
              type="email"
              disabled
            />{" "}
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="No. HP"
              value={profile.phone}
              onChange={(e) =>
                setProfile((p) => ({ ...p, phone: e.target.value }))
              }
              disabled={loading || saving}
            />{" "}
            <textarea
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              rows={3}
              placeholder="Alamat"
              value={profile.address}
              onChange={(e) =>
                setProfile((p) => ({ ...p, address: e.target.value }))
              }
              disabled={loading || saving}
            />{" "}
            <div className="flex gap-2">
              {" "}
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-xs font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading || saving}
              >
                {" "}
                {saving ? "Menyimpan..." : "Simpan Profil"}{" "}
              </button>{" "}
              <button
                type="button"
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => {
                  if (initialProfile) {
                    setProfile(initialProfile);
                  }
                }}
                disabled={loading || saving}
              >
                {" "}
                Reset{" "}
              </button>{" "}
            </div>{" "}
            {message && (
              <div className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                {" "}
                {message}{" "}
              </div>
            )}{" "}
            {error && (
              <div className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">
                {" "}
                {error}{" "}
              </div>
            )}{" "}
            <p className="text-xs text-slate-500">
              {" "}
              Email mengikuti akun login. Ubah password lewat menu lupa
              password.{" "}
            </p>{" "}
          </form>{" "}
        </div>{" "}
      </div>{" "}
    </Shell>
  );
}
