"use client";

import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "./firebase";

export type BankAccount = {
  bank: string;
  number: string;
  holder: string;
};

export type StoreSettings = {
  storeInfo: {
    name: string;
    address: string;
  };
  bankAccounts: BankAccount[];
  contact: {
    whatsapp: string;
    email: string;
  };
  socialMedia: {
    facebook: string;
    instagram: string;
  };
  status?: {
    storeOpen: boolean;
    courierAvailable: boolean;
  };
};

const defaultSettings: StoreSettings = {
  storeInfo: {
    name: "Ponti Pratama",
    address: "Alamat belum diatur",
  },
  bankAccounts: [],
  contact: {
    whatsapp: "-",
    email: "-",
  },
  socialMedia: {
    facebook: "-",
    instagram: "-",
  },
  status: {
    storeOpen: true,
    courierAvailable: true,
  },
};

export function useStoreSettings() {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const settingsRef = ref(db, "settings");
    const unsub = onValue(settingsRef, (snap) => {
      const val = snap.val() as StoreSettings | null;
      if (val) {
        setSettings({
          ...defaultSettings,
          ...val,
          storeInfo: { ...defaultSettings.storeInfo, ...(val.storeInfo || {}) },
          contact: { ...defaultSettings.contact, ...(val.contact || {}) },
          socialMedia: { ...defaultSettings.socialMedia, ...(val.socialMedia || {}) },
          status: { ...defaultSettings.status, ...(val.status || {}) },
          bankAccounts: Array.isArray(val.bankAccounts) ? val.bankAccounts : [],
        });
      } else {
        setSettings(defaultSettings);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { settings, loading };
}
