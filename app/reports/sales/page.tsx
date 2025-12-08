"use client";

import { useEffect, useMemo, useState } from "react";
import { onValue, ref } from "firebase/database";
import { Shell } from "../../components/Shell";
import { Badge } from "../../components/ui";
import { db } from "../../lib/firebase";
import { useAuth } from "../../components/AuthProvider";

type OrderRow = {
  id: string;
  customer?: { name?: string };
  total?: number;
  createdAt?: number;
  paymentMethod?: "CASH" | "CASHLESS";
  status?: string;
};

const formatDate = (ts?: number) =>
  ts
    ? new Date(ts).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })
    : "-";

export default function ReportsSalesPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [currentUserName, setCurrentUserName] = useState("-");
  const [currentUserRole, setCurrentUserRole] = useState("-");
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const { user } = useAuth();

  useEffect(() => {
    const ordersRef = ref(db, "orders");
    const unsubOrders = onValue(ordersRef, (snap) => {
      const val = snap.val() as Record<string, OrderRow> | null;
      const list = val ? Object.values(val) : [];
      setOrders(
        list
          .map((o) => ({
            ...o,
            total: Number(o.total) || 0,
            createdAt: o.createdAt || 0,
          }))
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)),
      );
    });
    return () => {
      unsubOrders();
    };
  }, []);

  const filteredOrders = useMemo(() => {
    const startTs = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    const endTs = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
    return orders.filter((o) => {
      const t = o.createdAt || 0;
      if (startTs && t < startTs) return false;
      if (endTs && t > endTs) return false;
      return o.status === "Selesai";
    });
  }, [endDate, orders, startDate]);

  const grandTotal = useMemo(
    () => filteredOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0),
    [filteredOrders],
  );

  useEffect(() => {
    setCurrentUserName(user?.name || user?.email || "-");
    setCurrentUserRole(user?.role || "-");
    if (typeof window !== "undefined") {
      (window as any).__reportUser = `${user?.name || user?.email || "-"} (${user?.role || "-"})`;
    }
  }, [user?.email, user?.name, user?.role]);

  const handlePrint = () => {
    const html = `
      <html>
        <head>
          <title>Laporan Penjualan</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 16px; }
            h3 { margin-bottom: 12px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
            th { background: #f8fafc; }
            tfoot td { font-weight: bold; }
          </style>
        </head>
        <body>
          <h3 style="margin:0;">Laporan Penjualan</h3>
          <p style="font-size:12px;margin:4px 0;">Dicetak oleh: ${currentUserName} (${currentUserRole})</p>
          <p style="font-size:12px;margin:4px 0 8px 0;">Periode: ${startDate} s.d. ${endDate}</p>
          <table>
            <thead>
              <tr><th>Tanggal</th><th>No. Inv</th><th>Metode</th><th>Pelanggan</th><th>Total</th></tr>
            </thead>
            <tbody>
              ${filteredOrders
                .map(
                  (o) =>
                    `<tr><td>${formatDate(o.createdAt)}</td><td>${o.id}</td><td>${o.paymentMethod || "-"}</td><td>${o.customer?.name || "-"}</td><td>Rp ${(o.total || 0).toLocaleString(
                      "id-ID",
                    )}</td></tr>`,
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr><td colspan="4">Grand Total</td><td>Rp ${grandTotal.toLocaleString("id-ID")}</td></tr>
            </tfoot>
          </table>
        </body>
      </html>
    `;
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
      w.focus();
      w.print();
    }
  };

  const handleExportPDF = () => {
    handlePrint();
  };

  const handleExportExcel = () => {
    const rows = [
      ["Tanggal", "No. Inv", "Metode", "Pelanggan", "Total", "Dicetak oleh", "Role"],
      ...filteredOrders.map((o) => [
        formatDate(o.createdAt),
        o.id,
        o.paymentMethod || "-",
        o.customer?.name || "-",
        `Rp ${(o.total || 0).toLocaleString("id-ID")}`,
        currentUserName,
        currentUserRole,
      ]),
      ["", "", "", "Grand Total", `Rp ${grandTotal.toLocaleString("id-ID")}`, "", ""],
    ];
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "laporan-penjualan.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Shell active="reportSales" requiresAuth>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Modul Laporan</p>
            <h2 className="text-2xl font-semibold">Laporan Penjualan</h2>
          </div>
          <div className="flex gap-2 text-xs">
            <button
              className="rounded-lg border border-slate-200 px-3 py-2 font-semibold hover:border-amber-300"
              onClick={handlePrint}
            >
              Cetak
            </button>
            <button
              className="rounded-lg border border-slate-200 px-3 py-2 font-semibold hover:border-amber-300"
              onClick={handleExportPDF}
            >
              Export PDF
            </button>
            <button
              className="rounded-lg bg-slate-900 px-3 py-2 font-semibold text-white shadow-sm"
              onClick={handleExportExcel}
            >
              Export Excel
            </button>
          </div>
        </div>
        <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Sales Report</p>
              <p className="text-lg font-semibold">Transaksi berdasarkan tanggal</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1">
                <span>Dari</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="rounded-lg border border-slate-200 px-2 py-1"
                />
              </div>
              <div className="flex items-center gap-1">
                <span>Sampai</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="rounded-lg border border-slate-200 px-2 py-1"
                />
              </div>
            </div>
          </div>
          <div className="mt-3 overflow-auto rounded-xl border border-slate-100 bg-white">
            <table className="min-w-full divide-y divide-slate-100 text-xs">
              <thead className="bg-slate-50 text-left uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-2">Tanggal</th>
                  <th className="px-3 py-2">No. Inv</th>
                  <th className="px-3 py-2">Metode</th>
                  <th className="px-3 py-2">Pelanggan</th>
                  <th className="px-3 py-2">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="px-3 py-2">{formatDate(o.createdAt)}</td>
                    <td className="px-3 py-2 font-semibold">{o.id}</td>
                    <td className="px-3 py-2">{o.paymentMethod || "-"}</td>
                    <td className="px-3 py-2">{o.customer?.name || "-"}</td>
                    <td className="px-3 py-2">Rp {(o.total || 0).toLocaleString("id-ID")}</td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td className="px-3 py-2 text-slate-500" colSpan={4}>
                      Belum ada transaksi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-2 flex items-center justify-end rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800">
            <span className="mr-3 text-xs font-normal text-slate-500">Grand Total</span>
            <span>Rp {grandTotal.toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>
    </Shell>
  );
}
