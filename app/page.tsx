"use client";

import Link from "next/link";
import { Shell } from "./components/Shell";
import { Badge } from "./components/ui";
import { admins } from "./lib/dummyData";

const modules = [
  { title: "Dashboard", desc: "Ringkasan produk, transaksi, dan stok menipis", href: "/dashboard" },
  { title: "Produk & Stok", desc: "List produk, tambah/edit, detail produk", href: "/products" },
  { title: "Pemesanan", desc: "Order list, detail, konfirmasi pembayaran", href: "/orders" },
  { title: "Pembayaran", desc: "Instruksi bayar + upload bukti transfer", href: "/payments" },
  { title: "Laporan", desc: "Laporan penjualan & persediaan, export/print", href: "/reports" },
  { title: "Settings", desc: "Info toko, rekening, branding, activity log", href: "/settings" },
];

export default function Home() {
  return (
    <Shell active="auth" showQuickInfo={false}>
      <section className="space-y-8">
        <div className="grid items-center gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
              SparX Parts · Masuk terlebih dulu
            </div>
            <h1 className="text-3xl font-semibold">
              Silakan login dulu. Modul dashboard/produk/pemesanan/pembayaran/laporan/settings hanya
              muncul setelah login atau admin match email.
            </h1>
            <p className="text-sm text-slate-600">
              Gunakan tombol di bawah untuk masuk sebagai konsumen atau admin. Admin dikenali dengan
              email yang terdaftar di daftar admin.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/login"
                className="rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-amber-800 ring-1 ring-amber-200 hover:bg-amber-50"
              >
                Register Konsumen
              </Link>
              <Link
                href="/forgot"
                className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm"
              >
                Lupa Password
              </Link>
            </div>
            <p className="text-xs text-slate-500">
              Setelah login, akses modul admin/ops/finance akan terbuka otomatis sesuai role.
            </p>
          </div>

          <div className="rounded-2xl bg-white/80 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur">
            <p className="text-sm font-semibold">Admin yang diizinkan (dummy)</p>
            <p className="text-xs text-slate-500">
              Sistem multi-admin: login dengan email berikut untuk akses penuh.
            </p>
            <div className="mt-3 space-y-2">
              {admins.map((admin) => (
                <div
                  key={admin.email}
                  className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3 text-amber-900 ring-1 ring-amber-100"
                >
                  <div>
                    <p className="text-sm font-semibold">{admin.name}</p>
                    <p className="text-xs text-amber-800">{admin.email}</p>
                  </div>
                  <Badge tone="neutral">{admin.role}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Modul akan terbuka setelah login</p>
              <p className="text-lg font-semibold">Preview modul (locked state)</p>
            </div>
            <Badge tone="warning">Butuh login</Badge>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((m) => (
              <div
                key={m.title}
                className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white/70 p-4 text-slate-700 shadow-sm ring-1 ring-black/5 backdrop-blur"
              >
                <div className="absolute inset-0 bg-white/60" />
                <div className="relative space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-semibold text-slate-900">{m.title}</p>
                    <Badge tone="neutral">Terkunci</Badge>
                  </div>
                  <p className="text-sm text-slate-600">{m.desc}</p>
                  <p className="text-xs font-semibold text-amber-700">Login admin untuk membuka</p>
                  <p className="text-[11px] text-slate-500">Target URL: {m.href}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}
