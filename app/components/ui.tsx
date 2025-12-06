import React from "react";

export function StatCard({
  label,
  value,
  accent = "from-amber-500 to-orange-600",
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur">
      <p className="text-sm text-slate-500">{label}</p>
      <p
        className={`mt-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${accent} px-3 py-2 text-lg font-semibold text-white`}
      >
        {value}
      </p>
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "danger" | "warning";
}) {
  const map: Record<typeof tone, string> = {
    neutral: "bg-slate-100 text-slate-700 ring-slate-200",
    success: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    danger: "bg-rose-50 text-rose-700 ring-rose-100",
    warning: "bg-amber-50 text-amber-700 ring-amber-100",
  };
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${map[tone]}`}
    >
      {children}
    </span>
  );
}
