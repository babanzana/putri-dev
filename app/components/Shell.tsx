import Link from "next/link";
import React from "react";

type NavKey =
  | "auth"
  | "dashboard"
  | "products"
  | "orders"
  | "payments"
  | "reports"
  | "settings";

const navItems: { key: NavKey; label: string; href: string }[] = [
  { key: "auth", label: "Login & Auth", href: "/login" },
  { key: "dashboard", label: "Dashboard", href: "/dashboard" },
  { key: "products", label: "Produk & Stok", href: "/products" },
  { key: "orders", label: "Pemesanan", href: "/orders" },
  { key: "payments", label: "Pembayaran", href: "/payments" },
  { key: "reports", label: "Laporan", href: "/reports" },
  { key: "settings", label: "Settings", href: "/settings" },
];

export function Shell({
  children,
  active,
  showQuickInfo = true,
}: {
  children: React.ReactNode;
  active: NavKey;
  showQuickInfo?: boolean;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-4 px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold shadow-lg">
                SP
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  SparX Parts
                </p>
                <p className="text-lg font-semibold">Admin & Storefront UI</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              UI dummy · siap dihubungkan ke Firebase
            </div>
          </div>
          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active === item.key
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-amber-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full px-6 py-8">
        {showQuickInfo && (
          <div className="mb-6 rounded-2xl bg-slate-900 p-4 text-white shadow-sm">
            <p className="text-sm font-semibold">Quick Info</p>
            <p className="mt-2 text-xs text-slate-200">
              Data dummy sudah termasuk konsumen (nama, email, password, no. hp,
              alamat), admin, produk, pesanan, dan bukti transfer.
            </p>
          </div>
        )}
        <div className="mx-auto max-w-screen-xl">{children}</div>
      </main>
    </div>
  );
}
