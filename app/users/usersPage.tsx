"use client";
import { onValue, ref, update } from "firebase/database";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Shell } from "../components/Shell";
import { db } from "../lib/firebase";
import { useAuth } from "../components/AuthProvider";
import { Badge } from "../components/ui";

type UserRow = {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: "Super Admin" | "Admin" | "Customer";
  label?: string | null;
};

const roleOptions: { value: UserRow["role"]; label: string }[] = [
  { value: "Customer", label: "Customer" },
  { value: "Admin", label: "Admin" },
  { value: "Super Admin", label: "Super Admin" },
];

const normalizeRole = (role?: string | null): UserRow["role"] => {
  const val = (role || "").toLowerCase();
  if (val.includes("super")) return "Super Admin";
  if (val === "admin") return "Admin";
  return "Customer";
};

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isSuperAdmin = user?.role === "Super Admin";

  useEffect(() => {
    const usersRef = ref(db, "users");
    const unsub = onValue(usersRef, (snap) => {
      const val = snap.val() as Record<string, UserRow> | null;
      const list = val ? Object.values(val) : [];
      setUsers(
        list.map((u) => ({
          uid: u.uid,
          name: u.name || u.email,
          email: u.email,
          phone: u.phone || "",
          address: u.address || "",
          role: normalizeRole(u.role),
          label: u.label ?? null,
        })),
      );
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        (u.phone || "").toLowerCase().includes(term),
    );
  }, [search, users]);

  const handleSave = async (target: UserRow) => {
    setSaving(target.uid);
    setError(null);
    try {
      await update(ref(db, `users/${target.uid}`), {
        role: target.role,
        label: target.role === "Admin" || target.role === "Super Admin" ? target.label || target.role : null,
        updatedAt: Date.now(),
      });
    } catch {
      setError("Gagal memperbarui role user.");
    } finally {
      setSaving(null);
    }
  };

  if (!isSuperAdmin) {
    return (
      <Shell active="users" requiresAuth>
        <div className="rounded-2xl bg-white/80 px-4 py-6 text-sm text-slate-600 ring-1 ring-slate-200">
          Halaman ini hanya bisa diakses oleh Super Admin.
        </div>
      </Shell>
    );
  }

  return (
    <Shell active="users" requiresAuth>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Kelola role dan label pengguna</p>
            <h1 className="text-2xl font-semibold">User Management</h1>
          </div>
          <Badge tone="neutral">Super Admin</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-100 bg-white/80 p-3 shadow-sm ring-1 ring-black/5">
          <input
            className="w-full rounded-full border border-slate-200 px-3 py-2 text-sm sm:w-80"
            placeholder="Cari nama / email / no HP"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {error && (
            <span className="text-xs font-semibold text-rose-600">{error}</span>
          )}
        </div>
        <div className="overflow-auto rounded-2xl border border-slate-100 bg-white/80 shadow-sm ring-1 ring-black/5">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">No HP</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Label (opsional)</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((u) => (
                <tr key={u.uid}>
                  <td className="px-4 py-3 font-semibold text-slate-900">{u.name}</td>
                  <td className="px-4 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3 text-slate-600">{u.phone || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <select
                        className="w-full appearance-none rounded-full border border-slate-200 px-3 py-2 pr-8 text-sm"
                        value={u.role}
                        onChange={(e) =>
                          setUsers((prev) =>
                            prev.map((row) =>
                              row.uid === u.uid
                                ? { ...row, role: normalizeRole(e.target.value) }
                                : row,
                            ),
                          )
                        }
                      >
                        {roleOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      placeholder="Label (Finance, CS, dll)"
                      value={u.label || ""}
                      onChange={(e) =>
                        setUsers((prev) =>
                          prev.map((row) =>
                            row.uid === u.uid ? { ...row, label: e.target.value } : row,
                          ),
                        )
                      }
                      disabled={u.role !== "Admin" && u.role !== "Super Admin"}
                    />
                  </td>
                  <td className="px-4 py-3 text-right text-xs">
                    <button
                      type="button"
                      className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm disabled:opacity-60"
                      onClick={() => handleSave(u)}
                      disabled={saving === u.uid}
                    >
                      {saving === u.uid ? "Menyimpan..." : "Simpan"}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td className="px-4 py-3 text-xs text-slate-500" colSpan={6}>
                    Tidak ada user.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}
