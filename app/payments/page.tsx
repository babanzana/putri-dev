import { Shell } from "../components/Shell";
import { Badge } from "../components/ui";

export default function PaymentsPage() {
  return (
    <Shell active="payments" requiresAuth>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">
              Modul Pembayaran (Customer Side)
            </p>
            <h2 className="text-2xl font-semibold">Instruksi & Upload Bukti</h2>
          </div>
          <Badge tone="neutral">Setelah checkout</Badge>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur">
            <p className="text-sm font-semibold">Payment Instruction</p>
            <p className="text-xs text-slate-500">
              Media transfer hanya melalui BCA (transfer bank)
            </p>
            <div className="mt-3 space-y-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Bank</p>
                  <p className="text-lg font-semibold">BCA - 1234567890</p>
                  <p className="text-xs text-slate-500">
                    a.n. PT Ponti Pratama Indonesia
                  </p>
                </div>
                <Badge tone="neutral">VA/Transfer</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Total Tagihan</p>
                  <p className="text-lg font-semibold">Rp 565.000 (INV-10294)</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Batas Bayar</p>
                  <p className="text-sm font-semibold text-amber-800">
                    2 jam dari sekarang
                  </p>
                </div>
              </div>
              <div className="rounded-lg bg-white px-3 py-2 text-xs text-slate-500">
                Instruksi: transfer sesuai nominal, simpan bukti, kemudian upload
                pada form di bawah.
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur">
            <p className="text-sm font-semibold">Upload Payment Proof</p>
            <p className="text-xs text-slate-500">
              Input nomor transaksi & unggah foto
            </p>
            <form className="mt-3 space-y-3">
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Nomor transaksi (contoh: INV-10294)"
              />
              <div className="rounded-xl border border-dashed border-emerald-300 bg-emerald-50 px-3 py-4 text-sm text-emerald-800">
                Drop / Upload foto bukti transfer
              </div>
              <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <option>Menunggu Verifikasi</option>
                <option>Menunggu Pembayaran</option>
                <option>Selesai</option>
              </select>
              <button className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm">
                Kirim Bukti
              </button>
            </form>
          </div>
        </div>
      </div>
    </Shell>
  );
}
