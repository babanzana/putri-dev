"use client";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Store,
} from "lucide-react";
import bannerPonti from "../assets/banner-ponti-pratama.png";
import logoPonti from "../assets/logo-ponti-pratama.png";
import { Shell } from "../components/Shell";

export default function SettingsPage() {
  return (
    <Shell active="settings" requiresAuth>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Tentang perusahaan & toko</p>
            <h1 className="text-2xl font-semibold">Profil Perusahaan</h1>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.2fr,1fr]">
          <div className="space-y-3 rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-black/5">
            <p className="text-sm font-semibold text-slate-900">Ponti Pratama</p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Penyedia sparepart motor dan aksesoris dengan jaringan supplier
              nasional. Fokus pada kecepatan pengiriman, stok terkelola, dan
              dukungan pelanggan yang responsif.
            </p>
            <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                <span className="rounded-lg bg-amber-100 p-2 text-amber-700">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Alamat Kantor</p>
                  <p>Jl. Raya Bogor KM 25, Jakarta Timur</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                <span className="rounded-lg bg-amber-100 p-2 text-amber-700">
                  <Store className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Alamat Toko</p>
                  <p>Jl.Khatulistiwa, Batu Layang, Kota Pontianak, Kalimantan Barat</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                <span className="rounded-lg bg-amber-100 p-2 text-amber-700">
                  <Mail className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Email</p>
                  <p>support@sparx.id</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                <span className="rounded-lg bg-amber-100 p-2 text-amber-700">
                  <MessageCircle className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-500">WhatsApp</p>
                  <p>0812-1234-5678</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                <span className="rounded-lg bg-amber-100 p-2 text-amber-700">
                  <Instagram className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Sosial Media</p>
                  <div className="mt-1 space-y-1 text-[13px] text-slate-700">
                    <div className="flex items-center gap-2">
                      <Instagram className="h-4 w-4 text-amber-700" />
                      <span>@pontipratama</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Facebook className="h-4 w-4 text-blue-600" />
                      <span>fb.com/pontipratama</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-black/5">
            <p className="text-sm font-semibold text-slate-900">Tampilan Toko</p>
            <div className="mt-3 space-y-3">
              <div className="relative h-32 w-full overflow-hidden rounded-xl bg-slate-100">
                <Image
                  src={bannerPonti}
                  alt="Banner"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-slate-200">
                  <Image
                    src={logoPonti}
                    alt="Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Ponti Pratama
                  </p>
                  <p className="text-xs text-slate-600">
                    Jual Spare Part Kendaraan Mobil.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
