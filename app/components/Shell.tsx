"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { JSX, useEffect } from "react";
import {
  Box,
  ClipboardList,
  Clock3,
  CreditCard,
  FilePieChart,
  LayoutDashboard,
  LogIn,
  Package,
  HelpCircle,
  Settings,
  ShoppingCart,
  Store,
  User,
  UserPlus,
} from "lucide-react";
import logoPonti from "../assets/logo-ponti-pratama.png";
import { useAuth } from "./AuthProvider";

type NavKey =
  | "login"
  | "register"
  | "catalog"
  | "cart"
  | "profile"
  | "faq"
  | "history"
  | "dashboard"
  | "products"
  | "orders"
  | "reports"
  | "settings";

type NavItem = { key: NavKey; label: string; href: string; requiresAuth?: boolean };

const primaryNav: NavItem[] = [
  { key: "catalog", label: "Katalog", href: "/catalog", requiresAuth: true },
  { key: "cart", label: "Keranjang", href: "/cart", requiresAuth: true },
  { key: "history", label: "Riwayat Transaksi", href: "/history", requiresAuth: true },
  { key: "faq", label: "Bantuan/FAQ", href: "/faq", requiresAuth: true },
  { key: "profile", label: "Profile", href: "/profile", requiresAuth: true },
  { key: "settings", label: "Settings", href: "/settings", requiresAuth: true },
];

const adminNav: NavItem[] = [
  ...primaryNav,
  { key: "dashboard", label: "Dashboard", href: "/dashboard", requiresAuth: true },
  { key: "products", label: "Produk & Stok", href: "/products", requiresAuth: true },
  { key: "orders", label: "Pemesanan", href: "/orders", requiresAuth: true },
  { key: "reports", label: "Laporan", href: "/reports", requiresAuth: true },
];

const consumerNav: NavItem[] = [...primaryNav];

const navIcon: Record<NavKey, JSX.Element> = {
  login: <LogIn className="h-4 w-4" />,
  register: <UserPlus className="h-4 w-4" />,
  catalog: <Store className="h-4 w-4" />,
  cart: <ShoppingCart className="h-4 w-4" />,
  profile: <User className="h-4 w-4" />,
  faq: <HelpCircle className="h-4 w-4" />,
  history: <Clock3 className="h-4 w-4" />,
  dashboard: <LayoutDashboard className="h-4 w-4" />,
  products: <Box className="h-4 w-4" />,
  orders: <ClipboardList className="h-4 w-4" />,
  payments: <CreditCard className="h-4 w-4" />,
  reports: <FilePieChart className="h-4 w-4" />,
  settings: <Settings className="h-4 w-4" />,
};

const publicNav: NavItem[] = [
  { key: "login", label: "Login", href: "/login" },
  { key: "register", label: "Register", href: "/register" },
];

export function Shell({
  children,
  active,
  showQuickInfo = false,
  requiresAuth = false,
}: {
  children: React.ReactNode;
  active: NavKey;
  showQuickInfo?: boolean;
  requiresAuth?: boolean;
}) {
  const { isAuthenticated, user, logout, hydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (requiresAuth && hydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [requiresAuth, hydrated, isAuthenticated, router]);

  const visibleNav = isAuthenticated
    ? user?.role === "admin"
      ? adminNav
      : consumerNav
    : publicNav;
  const isLocked = requiresAuth && hydrated && !isAuthenticated;
  const showContent = !requiresAuth || (requiresAuth && hydrated && isAuthenticated);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-4 px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-white shadow-lg ring-2 ring-amber-200">
                <Image
                  src={logoPonti}
                  alt="Ponti Pratama"
                  fill
                  className="object-contain p-1.5"
                  priority
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Ponti Pratama
                </p>
                <p className="text-lg font-semibold">
                  {isAuthenticated ? "Ponti Pratama Portal" : "Silakan Login"}
                </p>
              </div>
            </div>

            {isAuthenticated ? (
              <div className="flex flex-wrap items-center gap-3 rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-700">
                <div className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800 ring-1 ring-emerald-200">
                  {user?.role === "admin" ? user?.label || "Admin" : "Konsumen"}
                </div>
                <div className="text-left">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">
                    Logged in
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {user?.name || user?.email}
                  </p>
                  <p className="text-[11px] text-slate-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white shadow-sm hover:bg-slate-800"
                  type="button"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-600">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Fitur lain dikunci sampai login
              </div>
            )}
          </div>
          <nav className="flex flex-wrap gap-2">
            {visibleNav.map((item) => {
              const isActive = active === item.key;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "border-amber-600 bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:border-amber-300"
                  }`}
                >
                  <span
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
                      isActive ? "bg-white/15 text-white" : "bg-slate-900 text-white"
                    }`}
                  >
                    {navIcon[item.key]}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full px-6 py-8">
        {showQuickInfo && (
          <div className="mb-6 rounded-2xl bg-slate-900 p-4 text-white shadow-sm">
            <p className="text-sm font-semibold">Quick Info</p>
            <p className="mt-2 text-xs text-slate-200">
              Data dummy sudah termasuk konsumen (nama, email, password, no. hp, alamat), admin,
              produk, pesanan, dan bukti transfer.
            </p>
          </div>
        )}
        <div className="mx-auto max-w-screen-xl">
          {!hydrated && requiresAuth && (
            <div className="rounded-2xl bg-white/70 px-4 py-6 text-center text-sm text-slate-600 ring-1 ring-slate-200">
              Memuat sesi login...
            </div>
          )}
          {showContent && children}
          {isLocked && (
            <div className="rounded-2xl bg-white/80 px-4 py-6 text-center text-sm text-slate-700 ring-1 ring-black/5">
              Silakan login terlebih dahulu untuk membuka menu ini.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
