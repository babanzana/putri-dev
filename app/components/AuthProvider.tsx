"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { admins, consumers } from "../lib/dummyData";

type AuthUser = {
  name: string;
  email: string;
  role: "admin" | "customer";
  label?: string;
};

type LoginResult =
  | { ok: true; user: AuthUser }
  | { ok: false; error: string };

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  login: (email: string, password: string) => LoginResult;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = "sparx-auth-user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as AuthUser;
        setUser(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setHydrated(true);
  }, []);

  const login = (email: string, password: string): LoginResult => {
    const normalizedEmail = email.trim().toLowerCase();
    const adminMatch = admins.find(
      (a) => a.email.toLowerCase() === normalizedEmail && a.password === password,
    );
    if (adminMatch) {
      const authUser: AuthUser = {
        name: adminMatch.name,
        email: adminMatch.email,
        role: "admin",
        label: adminMatch.role,
      };
      setUser(authUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      return { ok: true, user: authUser };
    }

    const consumerMatch = consumers.find(
      (c) => c.email.toLowerCase() === normalizedEmail && c.password === password,
    );
    if (consumerMatch) {
      const authUser: AuthUser = {
        name: consumerMatch.name,
        email: consumerMatch.email,
        role: "customer",
      };
      setUser(authUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      return { ok: true, user: authUser };
    }

    return { ok: false, error: "Email / password tidak cocok dengan data dummy" };
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      hydrated,
      login,
      logout,
    }),
    [hydrated, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth harus dipakai di dalam AuthProvider");
  }
  return ctx;
}
