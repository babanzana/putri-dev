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

  const activeProducts = useMemo(
    () => products.filter((p) => p.status !== "Nonaktif"),
    [products]
  );
  const outOfStock = useMemo(
    () => activeProducts.filter((p) => (p.stock ?? 0) === 0),
    [activeProducts]
  );
  const lowStock = useMemo(
    () => activeProducts.filter((p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 5),
    [activeProducts]
  );
  const safeStock = useMemo(
    () => activeProducts.filter((p) => (p.stock ?? 0) > 5),
    [activeProducts]
  );
  const sortedProducts = useMemo(
    () =>
      [...products].sort((a, b) => {
        const rank = (p: ProductRow) => {
          if (p.status === "Nonaktif") return 4;
          if ((p.stock ?? 0) === 0) return 1;
          if ((p.stock ?? 0) <= 5) return 2;
          return 3;
        };
        return rank(a) - rank(b) || (a.stock ?? 0) - (b.stock ?? 0);
      }),
    [products]
  );

  const getStockStatus = (p: ProductRow) => {
    if (p.status === "Nonaktif") return "Nonaktif";
    if ((p.stock ?? 0) === 0) return "Stok Habis";
    if ((p.stock ?? 0) <= 5) return "Stok Menipis";
    return "Stok Aman";
  };

  const buildInventoryTableHtml = () => `
    <html>
      <head>
        <title>Laporan Stok</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 16px; }
          h3 { margin-bottom: 12px; }
          h4 { margin: 16px 0 6px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 12px; }
          th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
          th { background: #f8fafc; }
          .habis { color: #dc2626; }
          .menipis { color: #d97706; }
          .aman { color: #16a34a; }
        </style>
      </head>
      <body>
        <h3>Laporan Stok - Ponti Pratama</h3>
        <h4 class="habis">Stok Habis (${outOfStock.length})</h4>
        <table><thead><tr><th>Produk</th><th>Kategori</th><th>Stok</th></tr></thead>
        <tbody>${outOfStock.map((p) => `<tr><td>${p.name}</td><td>${p.category || "-"}</td><td>0</td></tr>`).join("") || "<tr><td colspan='3'>Tidak ada</td></tr>"}</tbody></table>
        <h4 class="menipis">Stok Menipis (${lowStock.length})</h4>
        <table><thead><tr><th>Produk</th><th>Kategori</th><th>Stok</th></tr></thead>
        <tbody>${lowStock.map((p) => `<tr><td>${p.name}</td><td>${p.category || "-"}</td><td>${p.stock}</td></tr>`).join("") || "<tr><td colspan='3'>Tidak ada</td></tr>"}</tbody></table>
        <h4 class="aman">Stok Aman (${safeStock.length})</h4>
        <table><thead><tr><th>Produk</th><th>Kategori</th><th>Stok</th></tr></thead>
        <tbody>${safeStock.map((p) => `<tr><td>${p.name}</td><td>${p.category || "-"}</td><td>${p.stock}</td></tr>`).join("") || "<tr><td colspan='3'>Tidak ada</td></tr>"}</tbody></table>
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
        getStockStatus(p),
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
          <div className="flex gap-2 flex-wrap">
            <Badge tone="neutral">Stok Habis: {outOfStock.length}</Badge>
            <Badge tone="warning">Stok Menipis: {lowStock.length}</Badge>
            <Badge tone="success">Stok Aman: {safeStock.length}</Badge>
          </div>
        </div>

        <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Inventory Report</p>
              <p className="text-lg font-semibold">Stok Aman · Stok Menipis · Stok Habis</p>
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

          {/* Stok Habis */}
          <div>
            <p className="mb-2 text-sm font-semibold text-rose-700">Stok Habis ({outOfStock.length})</p>
            <div className="overflow-auto rounded-xl border border-rose-100 bg-white">
              <table className="min-w-full divide-y divide-slate-100 text-xs">
                <thead className="bg-rose-50 text-left uppercase text-rose-500">
                  <tr>
                    <th className="px-3 py-2">Produk</th>
                    <th className="px-3 py-2">Kategori</th>
                    <th className="px-3 py-2">Stok</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {outOfStock.length === 0 ? (
                    <tr><td className="px-3 py-2 text-slate-400" colSpan={3}>Tidak ada produk stok habis.</td></tr>
                  ) : outOfStock.map((p) => (
                    <tr key={p.slug || p.name}>
                      <td className="px-3 py-2 font-semibold text-rose-700">{p.name}</td>
                      <td className="px-3 py-2">{p.category || "-"}</td>
                      <td className="px-3 py-2 font-bold text-rose-700">0</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stok Menipis */}
          <div>
            <p className="mb-2 text-sm font-semibold text-amber-700">Stok Menipis ({lowStock.length})</p>
            <div className="overflow-auto rounded-xl border border-amber-100 bg-white">
              <table className="min-w-full divide-y divide-slate-100 text-xs">
                <thead className="bg-amber-50 text-left uppercase text-amber-500">
                  <tr>
                    <th className="px-3 py-2">Produk</th>
                    <th className="px-3 py-2">Kategori</th>
                    <th className="px-3 py-2">Stok</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lowStock.length === 0 ? (
                    <tr><td className="px-3 py-2 text-slate-400" colSpan={3}>Tidak ada produk stok menipis.</td></tr>
                  ) : lowStock.map((p) => (
                    <tr key={p.slug || p.name}>
                      <td className="px-3 py-2">{p.name}</td>
                      <td className="px-3 py-2">{p.category || "-"}</td>
                      <td className="px-3 py-2 font-semibold text-amber-700">{p.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stok Aman */}
          <div>
            <p className="mb-2 text-sm font-semibold text-emerald-700">Stok Aman ({safeStock.length})</p>
            <div className="overflow-auto rounded-xl border border-emerald-100 bg-white">
              <table className="min-w-full divide-y divide-slate-100 text-xs">
                <thead className="bg-emerald-50 text-left uppercase text-emerald-600">
                  <tr>
                    <th className="px-3 py-2">Produk</th>
                    <th className="px-3 py-2">Kategori</th>
                    <th className="px-3 py-2">Stok</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {safeStock.length === 0 ? (
                    <tr><td className="px-3 py-2 text-slate-400" colSpan={3}>Tidak ada produk stok aman.</td></tr>
                  ) : safeStock.map((p) => (
                    <tr key={p.slug || p.name}>
                      <td className="px-3 py-2">{p.name}</td>
                      <td className="px-3 py-2">{p.category || "-"}</td>
                      <td className="px-3 py-2 font-semibold text-emerald-700">{p.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
