import { Shell } from "../components/Shell";
import { Badge } from "../components/ui";
import { orders } from "../lib/dummyData";

export default function HistoryPage() {
  return (
    <Shell active="history" requiresAuth>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Riwayat transaksi konsumen</p>
            <h1 className="text-2xl font-semibold">Order History</h1>
          </div>
          <Badge tone="neutral">Customer View</Badge>
        </div>

        <div className="overflow-auto rounded-2xl border border-slate-100 bg-white/80 shadow-sm ring-1 ring-black/5 backdrop-blur">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">No. Transaksi</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Bukti</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="px-4 py-3 font-semibold">{o.id}</td>
                  <td className="px-4 py-3">
                    <Badge
                      tone={
                        o.status === "Selesai"
                          ? "success"
                          : o.status === "Menunggu Verifikasi"
                          ? "neutral"
                          : "warning"
                      }
                    >
                      {o.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    Rp {o.total.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {o.paymentProof || "Belum upload"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}
