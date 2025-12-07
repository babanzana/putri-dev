"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import { onValue, ref, set } from "firebase/database";
import { admins } from "../lib/dummyData";
import { auth, db } from "../lib/firebase";

type AuthUser = {
  uid: string;
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
  login: (email: string, password: string) => Promise<LoginResult>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
  }) => Promise<LoginResult>;
  resetPassword: (email: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function mapFirebaseUser(fbUser: FirebaseUser): AuthUser {
  const email = fbUser.email || "";
  const adminMatch = admins.find((a) => a.email.toLowerCase() === email.toLowerCase());
  if (adminMatch) {
    return {
      uid: fbUser.uid,
      name: fbUser.displayName || adminMatch.name || email,
      email,
      role: "admin",
      label: adminMatch.role,
    };
  }

  return {
    uid: fbUser.uid,
    name: fbUser.displayName || email,
    email,
    role: "customer",
  };
}

function formatErrorMessage(error: unknown) {
  if (typeof error === "object" && error && "code" in error) {
    const code = String((error as { code?: string }).code || "");
    if (code.includes("auth/invalid-credential")) {
      return "Email atau password salah.";
    }
    if (code.includes("auth/email-already-in-use")) {
      return "Email sudah terdaftar, silakan login.";
    }
    if (code.includes("auth/weak-password")) {
      return "Password terlalu lemah (minimal 6 karakter).";
    }
    if (code.includes("auth/invalid-email")) {
      return "Format email tidak valid.";
    }
    if (code.includes("auth/user-not-found")) {
      return "Email tidak terdaftar.";
    }
  }
  return "Terjadi kesalahan, coba lagi.";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser ? mapFirebaseUser(fbUser) : null);
      setHydrated(true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    const userRef = ref(db, `users/${user.uid}`);
    const unsub = onValue(userRef, (snap) => {
      const val = snap.val() as { name?: string; email?: string } | null;
      if (val) {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                name: val.name || prev.name,
                email: val.email || prev.email,
              }
            : prev,
        );
      }
    });
    return () => unsub();
  }, [user?.uid]);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const cred = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      const authUser = mapFirebaseUser(cred.user);
      setUser(authUser);
      return { ok: true, user: authUser };
    } catch (err) {
      return { ok: false, error: formatErrorMessage(err) };
    }
  };

  const register = async ({
    name,
    email,
    password,
    phone,
    address,
  }: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
  }): Promise<LoginResult> => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const trimmedName = name.trim();
      const trimmedPhone = (phone || "").trim();
      const trimmedAddress = (address || "").trim();
      const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      if (trimmedName) {
        await updateProfile(cred.user, { displayName: trimmedName });
      }
      const authUser = mapFirebaseUser(cred.user);
      try {
        await set(ref(db, `users/${cred.user.uid}`), {
          uid: cred.user.uid,
          name: trimmedName || normalizedEmail,
          email: normalizedEmail,
          phone: trimmedPhone,
          address: trimmedAddress,
          role: authUser.role,
          label: authUser.label || null,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      } catch (writeErr) {
        await signOut(auth);
        throw writeErr;
      }
      setUser(authUser);
      return { ok: true, user: authUser };
    } catch (err) {
      return { ok: false, error: formatErrorMessage(err) };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      await sendPasswordResetEmail(auth, normalizedEmail);
      return { ok: true } as const;
    } catch (err) {
      return { ok: false, error: formatErrorMessage(err) };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      hydrated,
      login,
      register,
      resetPassword,
      logout,
    }),
    [hydrated, login, logout, register, resetPassword, user],
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
