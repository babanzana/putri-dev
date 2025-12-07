"use client";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Shell } from "../components/Shell";
import { useAuth } from "../components/AuthProvider";
export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, hydrated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.replace("/catalog");
    }
  }, [hydrated, isAuthenticated, router]);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");
    const result = await login(email, password);
    setIsSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.replace("/catalog");
  };
  return (
    <Shell active="login" showQuickInfo={false}>
      {" "}
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-0 py-4 lg:flex-row lg:items-start lg:gap-16">
        {" "}
        <div className="space-y-4 lg:w-1/2">
          {" "}
          <div className="inline-flex items-center gap-3 rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
            {" "}
            Ponti Pratama - Login{" "}
          </div>{" "}
          <h1 className="text-3xl font-semibold">
            {" "}
            Masuk terlebih dahulu untuk membuka menu{" "}
          </h1>{" "}
          <p className="text-sm text-slate-600">
            {" "}
            Gunakan email dan password yang sudah terdaftar di Firebase. Setelah
            login Anda langsung diarahkan ke katalog item penjualan dan menu
            lain terbuka.{" "}
          </p>{" "}
          <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur">
            {" "}
            <p className="text-sm font-semibold">Tips</p>{" "}
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              {" "}
              <li>
                Jika belum punya akun, daftar dulu via tombol Register.
              </li>{" "}
              <li>
                Admin dapat login dengan akun yang sudah dibuat di Firebase
                (email sama).
              </li>{" "}
            </ul>{" "}
          </div>{" "}
        </div>{" "}
        <div className="lg:w-1/2">
          {" "}
          <div className="rounded-2xl bg-white/80 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
            {" "}
            <p className="text-sm font-semibold">Login</p>{" "}
            <p className="text-xs text-slate-500">
              {" "}
              Masukkan email + password lalu klik login{" "}
            </p>{" "}
            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              {" "}
              <div>
                {" "}
                <label className="text-xs font-semibold text-slate-600">
                  {" "}
                  Email{" "}
                </label>{" "}
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="email@domain.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />{" "}
              </div>{" "}
              <div>
                {" "}
                <label className="text-xs font-semibold text-slate-600">
                  {" "}
                  Password{" "}
                </label>{" "}
                <div className="relative">
                  {" "}
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 pr-12 text-sm"
                    placeholder="********"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />{" "}
                  <button
                    type="button"
                    className="absolute inset-y-0 right-2 flex items-center text-slate-400"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Sembunyikan password" : "Lihat password"
                    }
                  >
                    {" "}
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}{" "}
                  </button>{" "}
                </div>{" "}
              </div>{" "}
              <div className="flex items-center justify-between text-xs text-slate-600">
                {" "}
                <label className="inline-flex items-center gap-2">
                  {" "}
                  <input type="checkbox" /> Remember me{" "}
                </label>{" "}
                <Link
                  href="/forgot"
                  className="font-semibold text-amber-700 hover:underline"
                >
                  {" "}
                  Lupa Password{" "}
                </Link>{" "}
              </div>{" "}
              {error && (
                <div className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">
                  {" "}
                  {error}{" "}
                </div>
              )}{" "}
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm"
                disabled={isSubmitting}
              >
                {" "}
                {isSubmitting ? "Memproses..." : "Login & Buka Katalog"}{" "}
              </button>{" "}
              <p className="text-center text-xs text-slate-600">
                {" "}
                Belum punya akun?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-amber-700 hover:underline"
                >
                  {" "}
                  Daftar sekarang{" "}
                </Link>{" "}
              </p>{" "}
            </form>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </Shell>
  );
}
