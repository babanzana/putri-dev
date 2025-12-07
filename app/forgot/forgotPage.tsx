"use client";
import Link from "next/link";
import { useState } from "react";
import { Shell } from "../components/Shell";
import { useAuth } from "../components/AuthProvider";
export default function ForgotPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setMessage("");
    setError("");
    setLoading(true);
    const res = await resetPassword(email);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setMessage("Link reset password sudah dikirim. Cek email Anda.");
  };
  return (
    <Shell active="login" showQuickInfo={false}>
      {" "}
      <div className="mx-auto max-w-xl rounded-2xl bg-white/80 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
        {" "}
        <p className="text-sm font-semibold">Lupa Password</p>{" "}
        <p className="text-xs text-slate-500">Kirim link reset ke email</p>{" "}
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          {" "}
          <div>
            {" "}
            <label className="text-xs font-semibold text-slate-600">
              {" "}
              Email terdaftar{" "}
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
          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm"
            disabled={loading}
          >
            {" "}
            {loading ? "Mengirim..." : "Kirim Link Reset"}{" "}
          </button>{" "}
          <p className="text-center text-xs text-slate-600">
            {" "}
            Ingat password?{" "}
            <Link
              href="/login"
              className="font-semibold text-amber-700 hover:underline"
            >
              {" "}
              Kembali ke login{" "}
            </Link>{" "}
          </p>{" "}
        </form>{" "}
      </div>{" "}
    </Shell>
  );
}
