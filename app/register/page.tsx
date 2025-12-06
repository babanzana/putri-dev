"use client";

import Link from "next/link";
import { Shell } from "../components/Shell";
import { consumers } from "../lib/dummyData";

const dummyConsumer = consumers[0];

export default function RegisterPage() {
  return (
    <Shell active="auth">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-0 py-4 lg:flex-row lg:items-center lg:gap-14">
        <div className="space-y-4 lg:w-2/5">
          <div className="inline-flex items-center gap-3 rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
            SparX Parts · Register
          </div>
          <h1 className="text-3xl font-semibold">Buat akun konsumen</h1>
          <p className="text-sm text-slate-600">
            Form register dengan field wajib: nama, email, password, no. HP, dan
            alamat. Data dummy di bawah bisa dipakai untuk uji coba.
          </p>
          <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur">
            <p className="text-sm font-semibold">Contoh data dummy</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              <li>Nama: {dummyConsumer.name}</li>
              <li>Email: {dummyConsumer.email}</li>
              <li>Password: {dummyConsumer.password}</li>
              <li>No. HP: {dummyConsumer.phone}</li>
              <li>Alamat: {dummyConsumer.address}</li>
            </ul>
          </div>
        </div>

        <div className="lg:w-3/5">
          <div className="rounded-2xl bg-white/80 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
            <p className="text-sm font-semibold">Register Konsumen</p>
            <p className="text-xs text-slate-500">
              UI dummy, tinggal dihubungkan ke Firebase Auth + Firestore.
            </p>
            <form className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-600">
                  Nama lengkap
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Nama sesuai KTP/SIM"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Email
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="email@domain.com"
                  type="email"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">
                  No. HP
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="08xx-xxxx-xxxx"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-600">
                  Alamat lengkap
                </label>
                <textarea
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Jalan, nomor, kelurahan, kecamatan, kota"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Password
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Minimal 8 karakter"
                  type="password"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Konfirmasi password
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Ulangi password"
                  type="password"
                />
              </div>
              <div className="sm:col-span-2 flex gap-2">
                <button
                  type="button"
                  className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm"
                >
                  Daftar
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold"
                >
                  Reset
                </button>
              </div>
              <p className="sm:col-span-2 text-center text-xs text-slate-600">
                Sudah punya akun?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-amber-700 hover:underline"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </Shell>
  );
}
