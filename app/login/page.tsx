"use client";

import Link from "next/link";
import { Shell } from "../components/Shell";
import { admins } from "../lib/dummyData";

export default function LoginPage() {
  return (
    <Shell active="auth">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-0 py-4 lg:flex-row lg:items-center lg:gap-16">
        <div className="space-y-4 lg:w-1/2">
          <div className="inline-flex items-center gap-3 rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
            SparX Parts · Login
          </div>
          <h1 className="text-3xl font-semibold">
            Masuk ke dashboard admin atau konsumen
          </h1>
          <p className="text-sm text-slate-600">
            UI dummy siap dihubungkan ke Firebase Auth. Admin dikenali
            berdasarkan email yang termasuk dalam daftar admin.
          </p>
          <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur">
            <p className="text-sm font-semibold">Admin yang diizinkan</p>
            <ul className="mt-2 space-y-2 text-sm text-slate-700">
              {admins.map((a) => (
                <li
                  key={a.email}
                  className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2 text-amber-900 ring-1 ring-amber-100"
                >
                  <span>{a.email}</span>
                  <span className="text-xs font-semibold">{a.role}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:w-1/2">
          <div className="rounded-2xl bg-white/80 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
            <p className="text-sm font-semibold">Login</p>
            <p className="text-xs text-slate-500">
              Email admin atau konsumen, password, dengan opsi remember me.
            </p>
            <form className="mt-4 space-y-4">
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
                  Password
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="•••••••"
                  type="password"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" />
                  Remember me
                </label>
                <Link
                  href="/forgot"
                  className="font-semibold text-amber-700 hover:underline"
                >
                  Lupa Password
                </Link>
              </div>
              <button
                type="button"
                className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm"
              >
                Login
              </button>
              <p className="text-center text-xs text-slate-600">
                Belum punya akun?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-amber-700 hover:underline"
                >
                  Daftar sekarang
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </Shell>
  );
}
