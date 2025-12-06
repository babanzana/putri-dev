import { Shell } from "../components/Shell";
import { Badge } from "../components/ui";

export default function SettingsPage() {
  return (
    <Shell active="settings">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Modul Tambahan</p>
            <h2 className="text-2xl font-semibold">Settings & Activity Log</h2>
          </div>
          <Badge tone="neutral">Non fungsional</Badge>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur">
            <p className="text-sm font-semibold">Settings Page</p>
            <p className="text-xs text-slate-500">
              Info toko, rekening, branding
            </p>
            <form className="mt-3 space-y-3">
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Nama Toko"
                defaultValue="SparX Parts"
              />
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="No Rekening"
                defaultValue="BCA - 1234567890"
              />
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Email Toko"
                defaultValue="support@sparx.id"
              />
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-600">
                Upload logo & hero banner
              </div>
              <div className="flex gap-2">
                <button className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-xs font-semibold text-white shadow-sm">
                  Simpan
                </button>
                <button className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold">
                  Reset
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Activity Log</p>
                <p className="text-xs text-slate-500">
                  Aktivitas admin (opsional)
                </p>
              </div>
              <Badge tone="success">Multi Admin</Badge>
            </div>
            <div className="mt-3 space-y-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">
                  Rangga Santoso
                </span>
                <Badge tone="neutral">12:14</Badge>
              </div>
              <p>Update stok kampas rem +10</p>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">
                  Kiki Syahputra
                </span>
                <Badge tone="neutral">11:55</Badge>
              </div>
              <p>Konfirmasi pembayaran INV-10294</p>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">
                  Dewi Kurnia
                </span>
                <Badge tone="neutral">11:30</Badge>
              </div>
              <p>Tambah admin baru (Finance)</p>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
