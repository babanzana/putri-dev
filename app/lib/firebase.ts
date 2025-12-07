import { getAnalytics, isSupported } from "firebase/analytics";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBNZ8EE4jZ45e1-HTcyLeFSWg-pYNwYD64",
  authDomain: "putri-b5a89.firebaseapp.com",
  projectId: "putri-b5a89",
  storageBucket: "putri-b5a89.firebasestorage.app",
  messagingSenderId: "464461939380",
  appId: "1:464461939380:web:60857b91085776fbbd4de1",
  measurementId: "G-KZ175ED7QH",
  databaseURL: "https://putri-b5a89-default-rtdb.firebaseio.com",
};

// Reuse app instance on the client to avoid re-init errors during hot reloads.
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth is used across login/register.
export const auth = getAuth(app);
// Realtime Database instance for user profile data.
export const db = getDatabase(app);

// Analytics only runs in supported browsers; ignore failures silently.
if (typeof window !== "undefined") {
  void isSupported()
    .then((supported) => {
      if (supported) {
        getAnalytics(app);
      }
    })
    .catch(() => {
      // no-op
    });
}
