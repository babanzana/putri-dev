"use client";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Shell } from "../components/Shell";
import { useAuth } from "../components/AuthProvider";
export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, hydrated } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.replace("/catalog");
    }
  }, [hydrated, isAuthenticated, router]);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi tidak sama.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    const result = await register({ name, email, password, phone, address });
    setIsSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.replace("/catalog");
  };
  return (
    <Shell active="register" showQuickInfo={false}>
      {" "}
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-0 py-4 lg:flex-row lg:items-center lg:gap-14">
        {" "}
        <div className="space-y-4 lg:w-2/5">
          {" "}
          <div className="inline-flex items-center gap-3 rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
            {" "}
            Ponti Pratama - Register{" "}
          </div>{" "}
          <h1 className="text-3xl font-semibold">Buat akun konsumen</h1>{" "}
          <p className="text-sm text-slate-600">
            {" "}
            Form ini langsung terhubung ke Firebase Authentication dan menyimpan
            data profil ke Firebase Realtime Database. Setelah daftar Anda
            otomatis diarahkan ke katalog dan bisa melakukan pembelian.{" "}
          </p>{" "}
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            {" "}
            Back ke halaman sebelumnya{" "}
          </button>{" "}
        </div>{" "}
        <div className="lg:w-3/5">
          {" "}
          <div className="rounded-2xl bg-white/80 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
            {" "}
            <p className="text-sm font-semibold">Register Konsumen</p>{" "}
            <p className="text-xs text-slate-500">
              {" "}
              Data akan disimpan ke Firebase Authentication dan detail profil ke
              Firebase Realtime Database.{" "}
            </p>{" "}
            <form
              className="mt-4 grid gap-4 sm:grid-cols-2"
              onSubmit={handleSubmit}
            >
              {" "}
              <div className="sm:col-span-2">
                {" "}
                <label className="text-xs font-semibold text-slate-600">
                  {" "}
                  Nama lengkap{" "}
                </label>{" "}
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Nama sesuai KTP/SIM"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />{" "}
              </div>{" "}
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
                  No. HP{" "}
                </label>{" "}
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="08xx-xxxx-xxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />{" "}
              </div>{" "}
              <div className="sm:col-span-2">
                {" "}
                <label className="text-xs font-semibold text-slate-600">
                  {" "}
                  Alamat lengkap{" "}
                </label>{" "}
                <textarea
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Jalan, nomor, kelurahan, kecamatan, kota"
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
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
                    placeholder="Minimal 8 karakter"
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
              <div>
                {" "}
                <label className="text-xs font-semibold text-slate-600">
                  {" "}
                  Konfirmasi password{" "}
                </label>{" "}
                <div className="relative">
                  {" "}
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 pr-12 text-sm"
                    placeholder="Ulangi password"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />{" "}
                  <button
                    type="button"
                    className="absolute inset-y-0 right-2 flex items-center text-slate-400"
                    onClick={() => setShowConfirm((prev) => !prev)}
                    aria-label={
                      showConfirm ? "Sembunyikan password" : "Lihat password"
                    }
                  >
                    {" "}
                    {showConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}{" "}
                  </button>{" "}
                </div>{" "}
              </div>{" "}
              {error && (
                <div className="sm:col-span-2 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">
                  {" "}
                  {error}{" "}
                </div>
              )}{" "}
              <div className="sm:col-span-2 flex gap-2">
                {" "}
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm"
                  disabled={isSubmitting}
                >
                  {" "}
                  {isSubmitting ? "Mendaftarkan..." : "Daftar & Masuk"}{" "}
                </button>{" "}
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold"
                >
                  {" "}
                  Back{" "}
                </button>{" "}
              </div>{" "}
              <p className="sm:col-span-2 text-center text-[11px] text-slate-500">
                {" "}
                Nama, email, nomor HP, dan alamat akan tersimpan di tabel users
                Realtime Database.{" "}
              </p>{" "}
              <p className="sm:col-span-2 text-center text-xs text-slate-600">
                {" "}
                Sudah punya akun?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-amber-700 hover:underline"
                >
                  {" "}
                  Login{" "}
                </Link>{" "}
              </p>{" "}
            </form>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </Shell>
  );
}
