import { Shell } from "../components/Shell";
import { Badge } from "../components/ui";
import { products } from "../lib/dummyData";

export default function ProductsPage() {
  return (
    <Shell active="products" requiresAuth>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Modul Pengelolaan Produk</p>
            <h2 className="text-2xl font-semibold">List, Tambah/Edit, Detail</h2>
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-2 text-xs font-semibold text-white shadow-sm">
              + Tambah Produk
            </button>
            <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:border-amber-300">
              Import CSV
            </button>
          </div>
        </div>

        <div className="overflow-auto rounded-2xl border border-slate-100 bg-white/80 shadow-sm ring-1 ring-black/5 backdrop-blur">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Produk</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Harga</th>
                <th className="px-4 py-3">Stok</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {products.map((p) => (
                <tr key={p.name}>
                  <td className="px-4 py-3 font-semibold">{p.name}</td>
                  <td className="px-4 py-3 text-slate-600">{p.category}</td>
                  <td className="px-4 py-3 text-slate-600">
                    Rp {p.price.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.stock}</td>
                  <td className="px-4 py-3">
                    <Badge
                      tone={
                        p.status === "Aktif"
                          ? "success"
                          : p.status === "Stok Menipis"
                          ? "warning"
                          : "neutral"
                      }
                    >
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-xs">
                    <div className="flex items-center justify-end gap-2">
                      <button className="rounded-lg border border-slate-200 px-3 py-1 hover:border-amber-300 hover:text-amber-800">
                        Detail
                      </button>
                      <button className="rounded-lg border border-slate-200 px-3 py-1 hover:border-emerald-300 hover:text-emerald-800">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur">
            <p className="text-sm font-semibold">Add / Edit Product</p>
            <p className="text-xs text-slate-500">Upload gambar, harga & stok</p>
            <form className="mt-3 grid gap-3 sm:grid-cols-2">
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm sm:col-span-2"
                placeholder="Nama produk"
              />
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Kategori"
              />
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Harga (Rp)"
              />
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Stok"
              />
              <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 px-3 py-4 text-sm text-amber-800 sm:col-span-2">
                Drop / Upload gambar produk
              </div>
              <div className="flex gap-2 sm:col-span-2">
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
            <p className="text-sm font-semibold">Product Detail Page</p>
            <p className="text-xs text-slate-500">Rincian lengkap produk</p>
            <div className="mt-3 space-y-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">Kampas Rem Depan NMax</p>
                <Badge tone="success">Aktif</Badge>
              </div>
              <p className="text-sm text-slate-600">Kategori: Brake System</p>
              <p className="text-sm text-slate-600">Harga: Rp 185.000 | Stok: 12</p>
              <p className="text-xs text-slate-500">
                Deskripsi singkat: kampas rem OEM untuk NMax, material ceramic, cocok untuk harian.
              </p>
              <div className="rounded-lg bg-white px-3 py-2 text-xs text-slate-500">
                Riwayat update stok & harga (dummy)
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
