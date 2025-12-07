import { Shell } from "../components/Shell";
import { Badge } from "../components/ui";
export default function ReportsPage() {
  return (
    <Shell active="reportSales" requiresAuth>
      {" "}
      <div className="space-y-4">
        {" "}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {" "}
          <div>
            {" "}
            <p className="text-sm text-slate-500">Modul Laporan</p>{" "}
            <h2 className="text-2xl font-semibold">
              Penjualan & Persediaan
            </h2>{" "}
          </div>{" "}
          <div className="flex gap-2">
            {" "}
            <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:border-amber-300">
              {" "}
              Print{" "}
            </button>{" "}
            <button className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm">
              {" "}
              Export PDF/Excel{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
        <div className="grid gap-4 lg:grid-cols-2">
          {" "}
          <div
            id="penjualan"
            className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur"
          >
            {" "}
            <div className="flex items-center justify-between">
              {" "}
              <div>
                {" "}
                <p className="text-sm text-slate-500">Sales Report</p>{" "}
                <p className="text-lg font-semibold">
                  Filter tanggal & grafik
                </p>{" "}
              </div>{" "}
              <div className="flex gap-2 text-xs">
                {" "}
                <input
                  className="rounded-lg border border-slate-200 px-2 py-1"
                  type="date"
                />{" "}
                <input
                  className="rounded-lg border border-slate-200 px-2 py-1"
                  type="date"
                />{" "}
              </div>{" "}
            </div>{" "}
            <div className="mt-3 overflow-auto rounded-xl border border-slate-100 bg-white">
              {" "}
              <table className="min-w-full divide-y divide-slate-100 text-xs">
                {" "}
                <thead className="bg-slate-50 text-left uppercase text-slate-500">
                  {" "}
                  <tr>
                    {" "}
                    <th className="px-3 py-2">Tanggal</th>{" "}
                    <th className="px-3 py-2">No. Inv</th>{" "}
                    <th className="px-3 py-2">Pelanggan</th>{" "}
                    <th className="px-3 py-2">Total</th>{" "}
                  </tr>{" "}
                </thead>{" "}
                <tbody className="divide-y divide-slate-100">
                  {" "}
                  <tr>
                    {" "}
                    <td className="px-3 py-2">12 Jan</td>{" "}
                    <td className="px-3 py-2">INV-10294</td>{" "}
                    <td className="px-3 py-2">Sinta Lestari</td>{" "}
                    <td className="px-3 py-2">Rp 565.000</td>{" "}
                  </tr>{" "}
                  <tr>
                    {" "}
                    <td className="px-3 py-2">12 Jan</td>{" "}
                    <td className="px-3 py-2">INV-10295</td>{" "}
                    <td className="px-3 py-2">Budi Hartono</td>{" "}
                    <td className="px-3 py-2">Rp 225.000</td>{" "}
                  </tr>{" "}
                </tbody>{" "}
              </table>{" "}
            </div>{" "}
            <div className="mt-3 rounded-xl bg-gradient-to-r from-indigo-50 to-sky-50 p-4">
              {" "}
              <p className="text-xs text-slate-500">Grafik penjualan</p>{" "}
              <div className="mt-2 flex gap-2">
                {" "}
                {[80, 120, 90, 140, 160, 130].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-lg bg-gradient-to-b from-sky-500 to-indigo-600"
                    style={{ height: `${h / 2}px` }}
                  />
                ))}{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div
            id="stok"
            className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur"
          >
            {" "}
            <div className="flex items-center justify-between">
              {" "}
              <div>
                {" "}
                <p className="text-sm text-slate-500">Inventory Report</p>{" "}
                <p className="text-lg font-semibold">
                  Stok & stok menipis
                </p>{" "}
              </div>{" "}
              <Badge tone="warning">Alert</Badge>{" "}
            </div>{" "}
            <div className="mt-3 overflow-auto rounded-xl border border-slate-100 bg-white">
              {" "}
              <table className="min-w-full divide-y divide-slate-100 text-xs">
                {" "}
                <thead className="bg-slate-50 text-left uppercase text-slate-500">
                  {" "}
                  <tr>
                    {" "}
                    <th className="px-3 py-2">Produk</th>{" "}
                    <th className="px-3 py-2">Stok</th>{" "}
                    <th className="px-3 py-2">Status</th>{" "}
                  </tr>{" "}
                </thead>{" "}
                <tbody className="divide-y divide-slate-100">
                  {" "}
                  <tr>
                    {" "}
                    <td className="px-3 py-2">Contoh item</td>{" "}
                    <td className="px-3 py-2">-</td>{" "}
                    <td className="px-3 py-2">
                      {" "}
                      <Badge tone="success">Aman</Badge>{" "}
                    </td>{" "}
                  </tr>{" "}
                </tbody>{" "}
              </table>{" "}
            </div>{" "}
            <div className="mt-3 flex gap-2">
              {" "}
              <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:border-amber-300">
                {" "}
                Cetak Laporan{" "}
              </button>{" "}
              <button className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm">
                {" "}
                Export Excel{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </Shell>
  );
}
