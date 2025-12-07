"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Shell } from "../components/Shell";
import { useAuth } from "../components/AuthProvider";
import { admins, consumers } from "../lib/dummyData";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, hydrated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.replace("/catalog");
    }
  }, [hydrated, isAuthenticated, router]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = login(email, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError("");
    router.replace("/catalog");
  };

  return (
    <Shell active="login" showQuickInfo={false}>
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-0 py-4 lg:flex-row lg:items-start lg:gap-16">
        <div className="space-y-4 lg:w-1/2">
          <div className="inline-flex items-center gap-3 rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
            Ponti Pratama - Login
          </div>
          <h1 className="text-3xl font-semibold">
            Masuk terlebih dahulu untuk membuka menu
          </h1>
          <p className="text-sm text-slate-600">
            Gunakan email dan password dummy di bawah. Setelah login Anda langsung diarahkan ke
            katalog item penjualan dan menu lain terbuka.
          </p>
          <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur">
            <p className="text-sm font-semibold">Admin yang diizinkan</p>
            <p className="text-xs text-slate-500">Password default admin: admin123</p>
            <ul className="mt-2 space-y-2 text-sm text-slate-700">
              {admins.map((a) => (
                <li
                  key={a.email}
                  className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2 text-amber-900 ring-1 ring-amber-100"
                >
                  <div>
                    <p className="font-semibold">{a.email}</p>
                    <p className="text-[11px] text-amber-700">{a.role}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-200">
                    admin123
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur">
            <p className="text-sm font-semibold">Contoh konsumen</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              <li>Email: {consumers[0].email}</li>
              <li>Password: {consumers[0].password}</li>
              <li className="text-xs text-slate-500">
                Konsumen juga bisa login dan melihat katalog.
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:w-1/2">
          <div className="rounded-2xl bg-white/80 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
            <p className="text-sm font-semibold">Login</p>
            <p className="text-xs text-slate-500">
              Masukkan email + password dummy lalu klik login
            </p>
            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Email
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="email@domain.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Password
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="********"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
              {error && (
                <div className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm"
              >
                Login & Buka Katalog
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
