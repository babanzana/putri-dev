"use client";
import { useMemo, useState } from "react";
import { Shell } from "../components/Shell";
import { Badge } from "../components/ui";
import { orders } from "../lib/dummyData";
const filters = [
  "Semua",
  "Menunggu Pembayaran",
  "Menunggu Verifikasi",
  "Selesai",
];
export default function OrdersPage() {
  const [orderFilter, setOrderFilter] = useState<string>("Semua");
  const filteredOrders = useMemo(() => {
    if (orderFilter === "Semua") return orders;
    return orders.filter((o) => o.status === orderFilter);
  }, [orderFilter]);
  return (
    <Shell active="orders" requiresAuth>
      {" "}
      <div className="space-y-4">
        {" "}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {" "}
          <div>
            {" "}
            <p className="text-sm text-slate-500">
              Modul Transaksi Pemesanan
            </p>{" "}
            <h2 className="text-2xl font-semibold">Order List & Detail</h2>{" "}
          </div>{" "}
          <div className="flex gap-2">
            {" "}
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setOrderFilter(f)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${orderFilter === f ? "bg-amber-100 text-amber-800 ring-1 ring-amber-200" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-amber-50"}`}
              >
                {" "}
                {f}{" "}
              </button>
            ))}{" "}
            <button className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm">
              {" "}
              + Manual Add Order{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
        <div className="overflow-auto rounded-2xl border border-slate-100 bg-white/80 shadow-sm ring-1 ring-black/5 backdrop-blur">
          {" "}
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            {" "}
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              {" "}
              <tr>
                {" "}
                <th className="px-4 py-3">No. Transaksi</th>{" "}
                <th className="px-4 py-3">Pelanggan</th>{" "}
                <th className="px-4 py-3">Total</th>{" "}
                <th className="px-4 py-3">Status Pembayaran</th>{" "}
                <th className="px-4 py-3">Bukti Transfer</th>{" "}
                <th className="px-4 py-3 text-right">Aksi</th>{" "}
              </tr>{" "}
            </thead>{" "}
            <tbody className="divide-y divide-slate-100 bg-white">
              {" "}
              {filteredOrders.map((o) => (
                <tr key={o.id}>
                  {" "}
                  <td className="px-4 py-3 font-semibold">{o.id}</td>{" "}
                  <td className="px-4 py-3 text-slate-600">
                    {o.customer.name}
                  </td>{" "}
                  <td className="px-4 py-3 text-slate-600">
                    {" "}
                    Rp {o.total.toLocaleString("id-ID")}{" "}
                  </td>{" "}
                  <td className="px-4 py-3">
                    {" "}
                    <Badge
                      tone={
                        o.status === "Selesai"
                          ? "success"
                          : o.status === "Menunggu Verifikasi"
                            ? "neutral"
                            : "warning"
                      }
                    >
                      {" "}
                      {o.status}{" "}
                    </Badge>{" "}
                  </td>{" "}
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {" "}
                    {o.paymentProof || "Belum upload"}{" "}
                  </td>{" "}
                  <td className="px-4 py-3 text-right text-xs">
                    {" "}
                    <div className="flex items-center justify-end gap-2">
                      {" "}
                      <button className="rounded-lg border border-slate-200 px-3 py-1 hover:border-amber-300 hover:text-amber-800">
                        {" "}
                        Detail{" "}
                      </button>{" "}
                      <button className="rounded-lg border border-emerald-100 px-3 py-1 text-emerald-700 hover:border-emerald-300">
                        {" "}
                        Konfirmasi{" "}
                      </button>{" "}
                    </div>{" "}
                  </td>{" "}
                </tr>
              ))}{" "}
            </tbody>{" "}
          </table>{" "}
        </div>{" "}
        <div className="grid gap-4 lg:grid-cols-2">
          {" "}
          <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur">
            {" "}
            <p className="text-sm font-semibold">Order Detail</p>{" "}
            <p className="text-xs text-slate-500">Dengan bukti transfer</p>{" "}
            <div className="mt-3 space-y-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm">
              {" "}
              <div className="flex items-center justify-between">
                {" "}
                <div>
                  {" "}
                  <p className="text-lg font-semibold">INV-10294</p>{" "}
                  <p className="text-xs text-slate-500">
                    {" "}
                    Pelanggan: Sinta Lestari | Email: sinta.les@mail.com{" "}
                  </p>{" "}
                </div>{" "}
                <Badge tone="neutral">Menunggu Verifikasi</Badge>{" "}
              </div>{" "}
              <div className="rounded-lg bg-white px-3 py-2">
                {" "}
                <p className="text-xs text-slate-500">Barang</p>{" "}
                <ul className="mt-1 space-y-1">
                  {" "}
                  <li className="flex justify-between">
                    {" "}
                    <span>Kampas Rem Depan NMax (x1)</span>{" "}
                    <span>Rp 185.000</span>{" "}
                  </li>{" "}
                  <li className="flex justify-between">
                    {" "}
                    <span>Oli Mesin 10W-40 (x2)</span>{" "}
                    <span>Rp 190.000</span>{" "}
                  </li>{" "}
                </ul>{" "}
                <div className="mt-2 flex items-center justify-between border-t border-dashed border-slate-200 pt-2 font-semibold">
                  {" "}
                  <span>Total</span> <span>Rp 565.000</span>{" "}
                </div>{" "}
              </div>{" "}
              <div className="rounded-lg bg-white px-3 py-2">
                {" "}
                <p className="text-xs text-slate-500">Bukti transfer</p>{" "}
                <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                  {" "}
                  <span>/dummy/bukti-10294.jpg</span>{" "}
                  <button className="rounded-lg border border-emerald-100 px-3 py-1 text-emerald-700 hover:border-emerald-300">
                    {" "}
                    Konfirmasi Pembayaran{" "}
                  </button>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur">
            {" "}
            <p className="text-sm font-semibold">Manual Add Order</p>{" "}
            <p className="text-xs text-slate-500">Admin membuat pesanan baru</p>{" "}
            <form className="mt-3 grid gap-3 sm:grid-cols-2">
              {" "}
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm sm:col-span-2"
                placeholder="Nama pelanggan"
              />{" "}
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="No. HP"
              />{" "}
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Alamat pengiriman"
              />{" "}
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm sm:col-span-2"
                placeholder="Item: contoh 'Oli Mesin 10W-40 x2'"
              />{" "}
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Total (Rp)"
              />{" "}
              <select className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
                {" "}
                <option>Status: Menunggu Pembayaran</option>{" "}
                <option>Menunggu Verifikasi</option>{" "}
                <option>Selesai</option>{" "}
              </select>{" "}
              <div className="flex gap-2 sm:col-span-2">
                {" "}
                <button className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-xs font-semibold text-white shadow-sm">
                  {" "}
                  Simpan Order{" "}
                </button>{" "}
                <button className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold">
                  {" "}
                  Reset{" "}
                </button>{" "}
              </div>{" "}
            </form>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </Shell>
  );
}
