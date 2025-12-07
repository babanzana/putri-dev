"use client";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ref, set } from "firebase/database";
import { ChevronDown } from "lucide-react";
import { db } from "../lib/firebase";
import { supabase } from "../lib/supabaseClient";
import { Badge } from "../components/ui";

type Product = {
  slug: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: string;
  images?: string[];
};

type ImageItem = { path: string; url: string };

export function ProductForm({ initial }: { initial?: Product | null }) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [price, setPrice] = useState<number>(initial?.price ?? 0);
  const [stock, setStock] = useState<number>(initial?.stock ?? 0);
  const [status, setStatus] = useState(initial?.status ?? "Aktif");
  const [images, setImages] = useState<ImageItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "Nonaktif") return;
    setStatus(stock <= 5 ? "Stok Menipis" : "Aktif");
  }, [stock, status]);

  useEffect(() => {
    const loadSigned = async () => {
      if (!initial?.images?.length) return;
      const next: ImageItem[] = [];
      for (const path of initial.images) {
        const { data } = await supabase.storage.from("putridev").createSignedUrl(path, 60 * 60);
        next.push({ path, url: data?.signedUrl || path });
      }
      setImages(next);
    };
    void loadSigned();
  }, [initial]);

  const slug = useMemo(() => {
    if (initial?.slug) return initial.slug;
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }, [name, initial?.slug]);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!name.trim() && !initial?.slug) {
      setError("Isi nama produk dulu sebelum upload gambar.");
      return;
    }
    if (images.length >= 5) {
      setError("Maksimal 5 gambar.");
      return;
    }
    const safeSlug = slug || "temp";
    const path = `products/${safeSlug}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { error: uploadError } = await supabase.storage
      .from("putridev")
      .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
    if (uploadError) {
      setError("Gagal upload gambar.");
      return;
    }
    const { data } = await supabase.storage.from("putridev").createSignedUrl(path, 60 * 60);
    setImages((prev) => [...prev, { path, url: data?.signedUrl || path }]);
    setError(null);
    if (e.target) e.target.value = "";
  };

  const handleRemoveImage = async (idx: number) => {
    const target = images[idx];
    setImages((prev) => prev.filter((_, i) => i !== idx));
    try {
      await supabase.storage.from("putridev").remove([target.path]);
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nama produk wajib diisi.");
      return;
    }
    if (!slug) {
      setError("Slug tidak valid.");
      return;
    }
    setSaving(true);
    setError(null);
    const finalStatus = status === "Nonaktif" ? "Nonaktif" : stock <= 5 ? "Stok Menipis" : "Aktif";
    const payload: Product = {
      slug,
      name: name.trim(),
      category: category.trim() || "Umum",
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      status: finalStatus,
      images: images.map((img) => img.path),
    };
    try {
      await set(ref(db, `products/${slug}`), payload);
      router.push("/products");
    } catch {
      setError("Gagal menyimpan produk.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {initial ? "Edit Produk" : "Tambah Produk"}
          </p>
          <h1 className="text-2xl font-semibold">
            {initial ? initial.name : "Produk Baru"}
          </h1>
        </div>
        {initial ? <Badge tone="neutral">{initial.slug}</Badge> : null}
      </div>
      <form className="grid gap-3 sm:grid-cols-2" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-1 sm:col-span-2 text-sm font-semibold text-slate-700">
          Nama
          <input
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="Nama produk"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
          Kategori
          <input
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="Kategori"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
          Harga (Rp)
          <input
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="Harga (Rp)"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
          Stok
          <input
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="Stok"
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
          Status
          <div className="relative">
            <select
              className="appearance-none w-full rounded-xl border border-slate-200 px-3 py-2 pr-8 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Aktif">Aktif</option>
              <option value="Stok Menipis">Stok Menipis</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>
        </label>
        <div className="sm:col-span-2 space-y-2">
          <p className="text-xs font-semibold text-slate-600">Gambar Produk (max 5)</p>
          <div className="flex flex-wrap gap-3">
            {images.map((img, idx) => (
              <div key={img.path} className="group relative h-24 w-24 overflow-hidden rounded-xl border border-slate-200">
                <img src={img.url} alt={`Produk ${idx + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute inset-x-0 bottom-0 hidden bg-black/60 py-1 text-center text-[11px] font-semibold text-white group-hover:block"
                >
                  Hapus
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-xl border border-dashed border-amber-300 bg-amber-50 text-xs font-semibold text-amber-700 transition hover:border-amber-400">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleUpload}
                />
              </label>
            )}
          </div>
        </div>
        {error && <p className="text-xs font-semibold text-rose-600 sm:col-span-2">{error}</p>}
        <div className="flex gap-2 sm:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className={`rounded-lg px-4 py-2 text-xs font-semibold text-white shadow-sm ${saving ? "bg-slate-300" : "bg-gradient-to-r from-amber-500 to-orange-600"}`}
          >
            {saving ? "Menyimpan..." : initial ? "Simpan Perubahan" : "Tambah Produk"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
