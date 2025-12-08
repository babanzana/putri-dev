"use client";

import { useEffect, useMemo, useState } from "react";
import { onValue, ref } from "firebase/database";
import { Shell } from "../../components/Shell";
import { Badge } from "../../components/ui";
import { db } from "../../lib/firebase";

type ProductRow = {
  slug?: string;
  name: string;
  stock: number;
  status?: string;
  category?: string;
};

export default function ReportsStockPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);

  useEffect(() => {
    const productsRef = ref(db, "products");
    const unsubProducts = onValue(productsRef, (snap) => {
      const val = snap.val() as Record<string, ProductRow> | null;
      const list = val ? Object.values(val) : [];
      setProducts(
        list.map((p) => ({
          ...p,
          stock: Number(p.stock) || 0,
          status: p.status || "",
        }))
      );
    });
    return () => unsubProducts();
  }, []);

  const lowStock = useMemo(
    () =>
      products.filter((p) => (p.stock ?? 0) <= 5 && p.status !== "Nonaktif"),
    [products]
  );
  const sortedProducts = useMemo(
    () =>
      [...products].sort((a, b) => {
        const aLow = (a.stock ?? 0) <= 5 && a.status !== "Nonaktif";
        const bLow = (b.stock ?? 0) <= 5 && b.status !== "Nonaktif";
        if (aLow && !bLow) return -1;
        if (!aLow && bLow) return 1;
        return (a.stock ?? 0) - (b.stock ?? 0);
      }),
    [products]
  );

  const buildInventoryTableHtml = () => `
    <html>
      <head>
        <title>Laporan Stok</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 16px; }
          h3 { margin-bottom: 12px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
          th { background: #f8fafc; }
        </style>
      </head>
      <body>
        <h3>Inventory Report - Stok & Stok Menipis</h3>
        <table>
          <thead>
            <tr><th>Produk</th><th>Kategori</th><th>Stok</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${sortedProducts
              .map(
                (p) =>
                  `<tr><td>${p.name}</td><td>${p.category || "-"}</td><td>${p.stock}</td><td>${
                    p.status === "Nonaktif"
                      ? "Nonaktif"
                      : (p.stock ?? 0) <= 5
                        ? "Stok Menipis"
                        : "Aman"
                  }</td></tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const handlePrint = () => {
    const html = buildInventoryTableHtml();
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
      w.focus();
      w.print();
    }
  };

  const handleExportPDF = () => {
    const html = buildInventoryTableHtml();
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
      w.focus();
      w.print();
    }
  };

  const handleExportExcel = () => {
    const rows = [
      ["Produk", "Kategori", "Stok", "Status"],
      ...sortedProducts.map((p) => [
        p.name,
        p.category || "-",
        String(p.stock),
        p.status === "Nonaktif"
          ? "Nonaktif"
          : (p.stock ?? 0) <= 5
            ? "Stok Menipis"
            : "Aman",
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "laporan-stok.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Shell active="reportStock" requiresAuth>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Modul Laporan</p>
            <h2 className="text-2xl font-semibold">Laporan Stok</h2>
          </div>
          <div className="flex gap-2">
            <Badge tone="warning">Stok menipis: {lowStock.length}</Badge>
          </div>
        </div>

        <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Inventory Report</p>
              <p className="text-lg font-semibold">Stok & stok menipis</p>
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
          <div className="mt-3 overflow-auto rounded-xl border border-slate-100 bg-white">
            <table className="min-w-full divide-y divide-slate-100 text-xs">
              <thead className="bg-slate-50 text-left uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-2">Produk</th>
                  <th className="px-3 py-2">Kategori</th>
                  <th className="px-3 py-2">Stok</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedProducts.map((p) => (
                  <tr key={p.slug || p.name}>
                    <td className="px-3 py-2">{p.name}</td>
                    <td className="px-3 py-2">{p.category || "-"}</td>
                    <td className="px-3 py-2">{p.stock}</td>
                    <td className="px-3 py-2">
                      <Badge
                        tone={
                          p.status === "Nonaktif"
                            ? "neutral"
                            : (p.stock ?? 0) <= 5
                              ? "warning"
                              : "success"
                        }
                      >
                        {p.status === "Nonaktif"
                          ? "Nonaktif"
                          : (p.stock ?? 0) <= 5
                            ? "Stok Menipis"
                            : "Aman"}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td className="px-3 py-2 text-slate-500" colSpan={4}>
                      Belum ada data produk.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Shell>
  );
}
