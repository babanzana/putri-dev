import { Shell } from "../components/Shell";

export default function ProfilePage() {
  return (
    <Shell active="profile" requiresAuth>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-slate-500">Atur akun pengguna (tanpa ganti password)</p>
          <h1 className="text-2xl font-semibold">Profil Saya</h1>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <form className="space-y-3 rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-black/5">
            <p className="text-sm font-semibold text-slate-900">Data Akun</p>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="Nama lengkap"
              defaultValue="Adi Pratama"
            />
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="Email"
              defaultValue="adi.pratama@mail.com"
              type="email"
              disabled
            />
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="No. HP"
              defaultValue="0812-3344-5566"
            />
            <textarea
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              rows={3}
              placeholder="Alamat"
              defaultValue="Jl. Melati No. 10, Bandung"
            />
            <div className="flex gap-2">
              <button className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-xs font-semibold text-white shadow-sm">
                Simpan Profil
              </button>
              <button className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold">
                Reset
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Perubahan email/password tidak tersedia di UI ini.
            </p>
          </form>

          <div className="space-y-3 rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-black/5">
            <p className="text-sm font-semibold text-slate-900">Preferensi Notifikasi</p>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" defaultChecked /> Email promo & update
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" defaultChecked /> WhatsApp status pesanan
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" /> SMS reminder pembayaran
            </label>
            <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
              Untuk ganti password silakan hubungi admin atau gunakan menu lupa password.
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
