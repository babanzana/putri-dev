import {
  CreditCard,
  HelpCircle,
  History,
  Info,
  MessageCircle,
  Package,
  Search,
  ShoppingCart,
  User,
  Wrench,
} from "lucide-react";
import { Shell } from "../components/Shell";
const categories = [
  {
    title: "Katalog Sparepart",
    icon: <Package className="h-5 w-5 text-orange-500" />,
    items: [
      "Cara mencari sparepart sesuai model mobil",
      "Status stok dan estimasi ketersediaan",
      "Rekomendasi produk terkait",
    ],
  },
  {
    title: "Keranjang & Checkout",
    icon: <ShoppingCart className="h-5 w-5 text-blue-500" />,
    items: [
      "Batasan qty sesuai stok",
      "Alamat pengiriman & catatan kurir",
      "Upload bukti pembayaran",
    ],
  },
  {
    title: "Pembayaran",
    icon: <CreditCard className="h-5 w-5 text-orange-500" />,
    items: [
      "Metode: transfer bank (BCA)",
      "Konfirmasi pembayaran manual",
      "Kendala bukti transfer tidak terbaca",
    ],
  },
  {
    title: "Riwayat Pembelian",
    icon: <History className="h-5 w-5 text-blue-500" />,
    items: [
      "Melihat status pesanan dan bukti bayar",
      "Filter berdasarkan tanggal",
      "Cetak atau download invoice",
    ],
  },
  {
    title: "Akun & Profil",
    icon: <User className="h-5 w-5 text-orange-500" />,
    items: [
      "Ubah data profil & notifikasi",
      "Ganti password via lupa password",
      "Keamanan akses multi-user admin",
    ],
  },
  {
    title: "Tentang Aplikasi & Toko",
    icon: <Info className="h-5 w-5 text-blue-500" />,
    items: [
      "Profil Ponti Pratama & jaringan supplier",
      "Jam operasional dan SLA pengiriman",
      "Kontak CS: WA, email, dan chat support",
    ],
  },
];
export default function FAQPage() {
  return (
    <Shell active="faq" requiresAuth showQuickInfo={false}>
      {" "}
      <div className="space-y-6">
        {" "}
        <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 via-white to-orange-50 ring-1 ring-slate-100">
          {" "}
          <div className="relative grid gap-4 px-5 py-5 sm:grid-cols-[1.2fr,0.8fr] sm:items-center">
            {" "}
            <div className="space-y-2">
              {" "}
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                {" "}
                <HelpCircle className="h-4 w-4 text-orange-500" /> Bantuan &
                FAQ{" "}
              </div>{" "}
              <h1 className="text-2xl font-semibold text-slate-900">
                {" "}
                Panduan cepat aplikasi penjualan sparepart mobil{" "}
              </h1>{" "}
              <p className="text-sm text-slate-600">
                {" "}
                Temukan jawaban seputar katalog, keranjang, pembayaran, riwayat
                pembelian, pengaturan akun, dan informasi toko Ponti
                Pratama.{" "}
              </p>{" "}
              <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                {" "}
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
                  {" "}
                  <Search className="h-3.5 w-3.5 text-blue-500" /> Cari
                  sparepart{" "}
                </span>{" "}
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
                  {" "}
                  <MessageCircle className="h-3.5 w-3.5 text-orange-500" /> Chat
                  support{" "}
                </span>{" "}
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
                  {" "}
                  <Wrench className="h-3.5 w-3.5 text-slate-700" /> Gear &
                  mekanik{" "}
                </span>{" "}
              </div>{" "}
            </div>{" "}
            <div className="relative h-32 sm:h-40">
              {" "}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-orange-500/10 blur-2xl" />{" "}
              <div className="relative flex h-full items-center justify-center gap-3">
                {" "}
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow ring-1 ring-slate-100">
                  {" "}
                  <Wrench className="h-8 w-8 text-orange-500" />{" "}
                </div>{" "}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow ring-1 ring-slate-100">
                  {" "}
                  <ShoppingCart className="h-7 w-7 text-blue-500" />{" "}
                </div>{" "}
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow ring-1 ring-slate-100">
                  {" "}
                  <HelpCircle className="h-6 w-6 text-slate-700" />{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {" "}
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm ring-1 ring-black/5"
            >
              {" "}
              <div className="flex items-center gap-2">
                {" "}
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 ring-1 ring-blue-100">
                  {" "}
                  {cat.icon}{" "}
                </span>{" "}
                <p className="text-sm font-semibold text-slate-900">
                  {cat.title}
                </p>{" "}
              </div>{" "}
              <ul className="space-y-1 text-sm text-slate-600">
                {" "}
                {cat.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    {" "}
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-400" />{" "}
                    <span>{item}</span>{" "}
                  </li>
                ))}{" "}
              </ul>{" "}
            </div>
          ))}{" "}
        </div>{" "}
      </div>{" "}
    </Shell>
  );
}
