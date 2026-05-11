import { get, ref } from "firebase/database";
import { db } from "./firebase";

export async function generateOrderId(): Promise<string> {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  const dateStr = `${y}${m}${d}`;
  const prefix = `ORD-${dateStr}-`;

  const snap = await get(ref(db, "orders"));
  const val = snap.val() as Record<string, unknown> | null;
  const count = val
    ? Object.keys(val).filter((id) => id.startsWith(prefix)).length
    : 0;

  const seq = String(count + 1).padStart(3, "0");
  return `${prefix}${seq}`;
}
