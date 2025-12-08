"use client";

// Normalize image path to public URL (Supabase or placeholder)
export const normalizeImage = (src?: string) => {
  if (!src) return "https://placehold.co/120x120/png?text=No+Image";
  if (src.startsWith("http")) return src;
  const cleaned = src.startsWith("/") ? src.slice(1) : src;
  return `https://mouisdjwiiirvxnyhora.supabase.co/storage/v1/object/public/putridev/${cleaned}`;
};
