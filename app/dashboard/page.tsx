import { Shell } from "../components/Shell";
import { Badge, StatCard } from "../components/ui";
import { products, salesSeries } from "../lib/dummyData";

export default function DashboardPage() {
  return (
    <Shell active="dashboard" requiresAuth>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Halaman awal admin</p>
            <h1 className="text-2xl font-semibold">Dashboard Ringkasan</h1>
          </div>
          <div className="flex gap-2">
            <Badge tone="success">Online</Badge>
            <Badge tone="warning">Stok menipis: 2</Badge>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Produk" value="124 sparepart" />
          <StatCard
            label="Transaksi Hari Ini"
            value="32 pesanan"
            accent="from-emerald-500 to-teal-600"
          />
          <StatCard
            label="Menunggu Konfirmasi"
            value="6 pembayaran"
            accent="from-indigo-500 to-sky-600"
          />
          <StatCard
            label="Stok Menipis"
            value="8 SKU"
            accent="from-rose-500 to-red-600"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Grafik penjualan</p>
                <p className="text-lg font-semibold">7 hari terakhir (dummy)</p>
              </div>
              <Badge tone="neutral">Line Chart</Badge>
            </div>
            <div className="mt-6 flex h-48 items-end gap-3 rounded-xl bg-gradient-to-r from-white to-amber-50 p-4 ring-1 ring-amber-100">
              {salesSeries.map((v, i) => (
                <div key={i} className="flex-1">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-b from-amber-500 to-orange-600 shadow-sm"
                    style={{ height: `${v * 4}px` }}
                  />
                  <p className="mt-2 text-center text-xs text-slate-500">D{i + 1}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Stok menipis</p>
                <p className="text-lg font-semibold">Perlu restock</p>
              </div>
              <Badge tone="warning">Prioritas</Badge>
            </div>
            <div className="space-y-3">
              {products
                .filter((p) => p.stock <= 5)
                .map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-semibold text-amber-900">{p.name}</p>
                      <p className="text-xs text-amber-800">
                        Stok: {p.stock} | {p.category}
                      </p>
                    </div>
                    <Badge tone="warning">Restock</Badge>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
