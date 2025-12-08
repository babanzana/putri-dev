"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  Banknote,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Store,
  Truck,
} from "lucide-react";
import { ref, set } from "firebase/database";
import bannerPonti from "../assets/banner-ponti-pratama.png";
import logoPonti from "../assets/logo-ponti-pratama.png";
import { Shell } from "../components/Shell";
import { useAuth } from "../components/AuthProvider";
import { db } from "../lib/firebase";
import { Badge } from "../components/ui";
import { useStoreSettings } from "../lib/useStoreSettings";

type FormState = {
  name: string;
  address: string;
  storeOpen: boolean;
  courierAvailable: boolean;
  bank: string;
  bankNumber: string;
  bankHolder: string;
  whatsapp: string;
  email: string;
  facebook: string;
  instagram: string;
};

export default function SettingsPage() {
  const { settings, loading } = useStoreSettings();
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin" || user?.role === "Super Admin";
  const [form, setForm] = useState<FormState>({
    name: "",
    address: "",
    storeOpen: true,
    courierAvailable: true,
    bank: "",
    bankNumber: "",
    bankHolder: "",
    whatsapp: "",
    email: "",
    facebook: "",
    instagram: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const primaryBank = useMemo(
    () => settings.bankAccounts[0] || { bank: "", number: "", holder: "" },
    [settings.bankAccounts]
  );

  useEffect(() => {
    setForm({
      name: settings.storeInfo.name || "",
      address: settings.storeInfo.address || "",
      storeOpen: settings.status?.storeOpen ?? true,
      courierAvailable: settings.status?.courierAvailable ?? true,
      bank: primaryBank.bank || "",
      bankNumber: primaryBank.number || "",
      bankHolder: primaryBank.holder || "",
      whatsapp: settings.contact.whatsapp || "",
      email: settings.contact.email || "",
      facebook: settings.socialMedia.facebook || "",
      instagram: settings.socialMedia.instagram || "",
    });
  }, [primaryBank.bank, primaryBank.holder, primaryBank.number, settings]);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAdmin || saving) return;
    setSaving(true);
    setMessage("");
    setError("");
    const trimmedName =
      form.name.trim() || settings.storeInfo.name || "Ponti Pratama";
    const trimmedAddress = form.address.trim() || settings.storeInfo.address;
    const nextData = {
      storeInfo: {
        name: trimmedName,
        address: trimmedAddress,
      },
      bankAccounts: [
        {
          bank: form.bank.trim() || "BCA",
          number: form.bankNumber.trim(),
          holder: form.bankHolder.trim() || trimmedName,
        },
        ...settings.bankAccounts.slice(1),
      ],
      contact: {
        whatsapp: form.whatsapp.trim(),
        email: form.email.trim(),
      },
      socialMedia: {
        facebook: form.facebook.trim(),
        instagram: form.instagram.trim(),
      },
      status: {
        storeOpen: form.storeOpen,
        courierAvailable: form.courierAvailable,
      },
    };
    try {
      await set(ref(db, "settings"), nextData);
      setMessage("Settings berhasil disimpan.");
    } catch {
      setError("Gagal menyimpan settings. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Shell active="settings" requiresAuth>
        <div className="rounded-2xl bg-white/80 px-4 py-6 text-sm text-slate-600 ring-1 ring-slate-200">
          Memuat data perusahaan...
        </div>
      </Shell>
    );
  }

  return (
    <Shell active="settings" requiresAuth>
      <div className="space-y-6">
        {!isAdmin && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Customer Settings</p>
                <h1 className="text-2xl font-semibold">Profil Perusahaan</h1>
              </div>
              {settings.status && (
                <div className="flex flex-wrap gap-2">
                  <Badge
                    tone={settings.status.storeOpen ? "success" : "danger"}
                  >
                    Toko {settings.status.storeOpen ? "Buka" : "Tutup"}
                  </Badge>
                  <Badge
                    tone={
                      settings.status.courierAvailable ? "success" : "warning"
                    }
                  >
                    Kurir{" "}
                    {settings.status.courierAvailable
                      ? "Tersedia"
                      : "Tidak Tersedia"}
                  </Badge>
                </div>
              )}
            </div>
            <div className="grid gap-4 lg:grid-cols-[1.2fr,1fr]">
              <div className="space-y-3 rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-black/5">
                <p className="text-sm font-semibold text-slate-900">
                  {settings.storeInfo.name || "Perusahaan"}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Informasi toko dan kontak yang diambil langsung dari Firebase
                  Realtime Database. Bagian ini adalah tampilan untuk customer.
                </p>
                <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                    <span className="rounded-lg bg-amber-100 p-2 text-amber-700">
                      <Store className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        Nama Toko
                      </p>
                      <p className="font-semibold text-slate-900">
                        {settings.storeInfo.name || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                    <span className="rounded-lg bg-amber-100 p-2 text-amber-700">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        Alamat
                      </p>
                      <p className="leading-snug">
                        {settings.storeInfo.address || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                    <span className="rounded-lg bg-amber-100 p-2 text-amber-700">
                      <Banknote className="h-4 w-4" />
                    </span>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-500">
                        Rekening
                      </p>
                      {settings.bankAccounts.length === 0 && <p>-</p>}
                      {settings.bankAccounts.map((acc) => (
                        <p
                          key={`${acc.bank}-${acc.number}`}
                          className="leading-snug"
                        >
                          {acc.bank} {acc.number} a.n {acc.holder}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                    <span className="rounded-lg bg-amber-100 p-2 text-amber-700">
                      <MessageCircle className="h-4 w-4" />
                    </span>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-500">
                        Kontak
                      </p>
                      <p>WhatsApp: {settings.contact.whatsapp || "-"}</p>
                      <p className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-500" />
                        {settings.contact.email || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 sm:col-span-2">
                    <span className="rounded-lg bg-amber-100 p-2 text-amber-700">
                      <Instagram className="h-4 w-4" />
                    </span>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-500">
                        Sosial Media
                      </p>
                      <div className="flex flex-wrap gap-3 text-[13px] text-slate-700">
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                          <Instagram className="h-4 w-4 text-amber-700" />
                          {settings.socialMedia.instagram || "-"}
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                          <Facebook className="h-4 w-4 text-blue-600" />
                          {settings.socialMedia.facebook || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-black/5">
                <p className="text-sm font-semibold text-slate-900">
                  Tampilan Toko
                </p>
                <div className="mt-3 space-y-3">
                  <div className="relative h-32 w-full overflow-hidden rounded-xl bg-slate-100">
                    <Image
                      src={bannerPonti}
                      alt="Banner"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-slate-200">
                      <Image
                        src={logoPonti}
                        alt="Logo"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {settings.storeInfo.name || "Ponti Pratama"}
                      </p>
                      <p className="text-xs text-slate-600">
                        {settings.storeInfo.address || "Alamat belum diatur"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {isAdmin && (
          <form
            className="space-y-4 rounded-2xl bg-slate-900/90 p-5 text-white shadow-sm ring-1 ring-black/10"
            onSubmit={handleSave}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Admin Settings</p>
                <p className="text-xs text-slate-200">
                  Kelola data yang muncul ke customer. Simpan langsung ke
                  Firebase.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {settings.status && (
                  <>
                    <Badge
                      tone={settings.status.storeOpen ? "success" : "danger"}
                    >
                      Toko {settings.status.storeOpen ? "Buka" : "Tutup"}
                    </Badge>
                    <Badge
                      tone={
                        settings.status.courierAvailable ? "success" : "warning"
                      }
                    >
                      Kurir{" "}
                      {settings.status.courierAvailable
                        ? "Tersedia"
                        : "Tidak Tersedia"}
                    </Badge>
                  </>
                )}
                <Badge tone="neutral">Realtime Database</Badge>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm font-semibold">
                <span className="inline-flex items-center gap-2">
                  <Store className="h-4 w-4 text-amber-300" />
                  <span>Nama Toko</span>
                </span>
                <input
                  className="rounded-xl border border-slate-700 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-400"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </label>
              <div className="grid gap-2 sm:grid-cols-2 sm:col-span-2">
                <button
                  type="button"
                  onClick={() =>
                    setForm((p) => ({ ...p, storeOpen: !p.storeOpen }))
                  }
                  className={`group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm transition ${
                    form.storeOpen
                      ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-emerald-950"
                      : "bg-white/10 text-white ring-1 ring-white/10"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    Status Toko
                  </span>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs ${
                      form.storeOpen
                        ? "bg-white/80 text-emerald-800"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    {form.storeOpen ? "Buka" : "Tutup"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setForm((p) => ({
                      ...p,
                      courierAvailable: !p.courierAvailable,
                    }))
                  }
                  className={`group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm transition ${
                    form.courierAvailable
                      ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-emerald-950"
                      : "bg-white/10 text-white ring-1 ring-white/10"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Kurir
                  </span>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs ${
                      form.courierAvailable
                        ? "bg-white/80 text-emerald-800"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    {form.courierAvailable ? "Tersedia" : "Tidak Tersedia"}
                  </span>
                </button>
              </div>
              <label className="flex flex-col gap-1 text-sm font-semibold sm:col-span-2">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-300" />
                  <span>Alamat</span>
                </span>
                <textarea
                  className="rounded-xl border border-slate-700 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-400"
                  rows={2}
                  value={form.address}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, address: e.target.value }))
                  }
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-semibold">
                <span className="inline-flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-amber-300" />
                  <span>Bank</span>
                </span>
                <input
                  className="rounded-xl border border-slate-700 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-400"
                  value={form.bank}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, bank: e.target.value }))
                  }
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-semibold">
                <span className="inline-flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-amber-300" />
                  <span>Nomor Rekening</span>
                </span>
                <input
                  className="rounded-xl border border-slate-700 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-400"
                  value={form.bankNumber}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, bankNumber: e.target.value }))
                  }
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-semibold">
                <span className="inline-flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-amber-300" />
                  <span>Nama Pemilik Rekening</span>
                </span>
                <input
                  className="rounded-xl border border-slate-700 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-400"
                  value={form.bankHolder}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, bankHolder: e.target.value }))
                  }
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-semibold">
                <span className="inline-flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-amber-300" />
                  <span>Nomor WA</span>
                </span>
                <input
                  className="rounded-xl border border-slate-700 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-400"
                  value={form.whatsapp}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, whatsapp: e.target.value }))
                  }
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-semibold">
                <span className="inline-flex items-center gap-2">
                  <Mail className="h-4 w-4 text-amber-300" />
                  <span>Email</span>
                </span>
                <input
                  className="rounded-xl border border-slate-700 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-400"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-semibold">
                <span className="inline-flex items-center gap-2">
                  <Facebook className="h-4 w-4 text-amber-300" />
                  <span>Facebook</span>
                </span>
                <input
                  className="rounded-xl border border-slate-700 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-400"
                  value={form.facebook}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, facebook: e.target.value }))
                  }
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-semibold">
                <span className="inline-flex items-center gap-2">
                  <Instagram className="h-4 w-4 text-amber-300" />
                  <span>Instagram</span>
                </span>
                <input
                  className="rounded-xl border border-slate-700 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-400"
                  value={form.instagram}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, instagram: e.target.value }))
                  }
                />
              </label>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="submit"
                disabled={saving}
                className={`rounded-xl px-4 py-2 text-xs font-semibold text-emerald-950 shadow-sm ${saving ? "bg-slate-500 text-white" : "bg-gradient-to-r from-amber-300 to-orange-400"}`}
              >
                {saving ? "Menyimpan..." : "Simpan Settings"}
              </button>
              {message && (
                <span className="text-xs font-semibold text-emerald-200">
                  {message}
                </span>
              )}
              {error && (
                <span className="text-xs font-semibold text-rose-200">
                  {error}
                </span>
              )}
            </div>
            <div className="rounded-xl bg-white/10 px-3 py-2 text-[11px] text-slate-100">
              Perubahan akan langsung tersimpan di path <code>settings</code>{" "}
              pada Firebase Realtime Database.
            </div>
          </form>
        )}
      </div>
    </Shell>
  );
}
