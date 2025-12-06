"use client";

import Link from "next/link";
import { Shell } from "../components/Shell";

export default function ForgotPage() {
  return (
    <Shell active="auth">
      <div className="mx-auto max-w-xl rounded-2xl bg-white/80 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
        <p className="text-sm font-semibold">Lupa Password</p>
        <p className="text-xs text-slate-500">Kirim link reset ke email</p>
        <form className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600">
              Email terdaftar
            </label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="email@domain.com"
              type="email"
            />
          </div>
          <button
            type="button"
            className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm"
          >
            Kirim Link Reset
          </button>
          <p className="text-center text-xs text-slate-600">
            Ingat password?{" "}
            <Link
              href="/login"
              className="font-semibold text-amber-700 hover:underline"
            >
              Kembali ke login
            </Link>
          </p>
        </form>
      </div>
    </Shell>
  );
}
