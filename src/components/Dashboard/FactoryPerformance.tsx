"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Factory,
  MapPin,
  Shirt,
} from "lucide-react";
import type { FactoryRow, NamedCount } from "@/hooks/useDashboardData";
import { formatQty } from "@/hooks/useDashboardData";
import "@/app/auth/login/login.css";

const AVATAR_TONES = [
  "from-sky-400 to-blue-600",
  "from-blue-400 to-indigo-600",
  "from-cyan-400 to-sky-600",
  "from-indigo-400 to-blue-700",
  "from-sky-500 to-cyan-600",
  "from-blue-500 to-sky-700",
];

const MIX_TONES = [
  "bg-sky-100 text-sky-800 ring-sky-200/80 dark:bg-sky-400/15 dark:text-sky-100 dark:ring-sky-400/20",
  "bg-blue-100 text-blue-800 ring-blue-200/80 dark:bg-blue-400/15 dark:text-blue-100 dark:ring-blue-400/20",
  "bg-indigo-100 text-indigo-800 ring-indigo-200/80 dark:bg-indigo-400/15 dark:text-indigo-100 dark:ring-indigo-400/20",
  "bg-cyan-100 text-cyan-800 ring-cyan-200/80 dark:bg-cyan-400/15 dark:text-cyan-100 dark:ring-cyan-400/20",
  "bg-sky-50 text-sky-700 ring-sky-200/80 dark:bg-sky-400/10 dark:text-sky-200 dark:ring-sky-400/20",
  "bg-blue-50 text-blue-700 ring-blue-200/80 dark:bg-blue-400/10 dark:text-blue-200 dark:ring-blue-400/20",
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "F";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function rankLook(index: number) {
  if (index === 0) {
    return "bg-gradient-to-br from-amber-300 to-yellow-500 text-amber-950 shadow-sm";
  }
  if (index === 1) {
    return "bg-gradient-to-br from-slate-200 to-slate-400 text-slate-800 shadow-sm";
  }
  if (index === 2) {
    return "bg-gradient-to-br from-orange-300 to-amber-600 text-orange-950 shadow-sm";
  }
  if (index === 3) {
    return "bg-gradient-to-br from-sky-300 to-blue-500 text-sky-950 shadow-sm";
  }
  return "bg-white/80 text-bodydark2 ring-1 ring-sky-200/70 dark:bg-white/10 dark:text-sky-100/70 dark:ring-white/10";
}

function staffTone(ratio: number) {
  if (ratio >= 0.9) return "bg-blue-500";
  if (ratio >= 0.7) return "bg-sky-500";
  return "bg-amber-500";
}

export default function FactoryPerformance({
  rows,
  garmentMix,
}: {
  rows: FactoryRow[];
  garmentMix: NamedCount[];
}) {
  const ranked = [...rows].sort((a, b) => {
    if (b.orderQty !== a.orderQty) return b.orderQty - a.orderQty;
    if (b.employees !== a.employees) return b.employees - a.employees;
    return a.name.localeCompare(b.name);
  });
  const maxQty = Math.max(...ranked.map((row) => row.orderQty), 0);
  const totalStaff = ranked.reduce((sum, row) => sum + row.employees, 0);
  const totalLines = ranked.reduce((sum, row) => sum + row.lines, 0);
  const totalQty = ranked.reduce((sum, row) => sum + row.orderQty, 0);

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-sky-200/80 bg-[linear-gradient(145deg,#f0f9ff_0%,#ffffff_42%,#dbeafe_100%)] p-4 shadow-sm dark:border-sky-800/50 dark:bg-[linear-gradient(145deg,#0c1a2e_0%,#24303f_48%,#0c4a6e_100%)] md:p-5">
      <span
        aria-hidden
        className="login-animate-blob login-animate-float pointer-events-none absolute -right-12 -top-14 h-36 w-36 bg-gradient-to-br from-sky-300/60 to-blue-400/35 dark:from-sky-500/25 dark:to-blue-400/15"
      />
      <span
        aria-hidden
        className="login-animate-morph login-animate-float-reverse pointer-events-none absolute -bottom-16 -left-10 h-32 w-32 bg-gradient-to-br from-cyan-200/45 to-indigo-300/25 dark:from-cyan-400/15 dark:to-indigo-400/10"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent dark:via-white/25"
      />
      <Factory
        aria-hidden
        strokeWidth={1.15}
        className="pointer-events-none absolute -bottom-4 -right-3 h-28 w-28 rotate-[-12deg] fill-sky-400/25 text-sky-500/55 dark:fill-sky-300/20 dark:text-sky-200/50"
      />

      <div className="relative z-10 mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 text-white ring-2 ring-white/70 dark:ring-white/10">
            <Building2 className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-black dark:text-white">
              Factory performance
            </h3>
            <p className="text-xs text-bodydark2 dark:text-sky-100/60">
              People, lines and booked quantity by company
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/12 px-2.5 py-1 text-[11px] font-semibold text-sky-700 ring-1 ring-sky-500/15 dark:bg-sky-400/15 dark:text-sky-200 dark:ring-sky-400/20">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
            {ranked.length} {ranked.length === 1 ? "factory" : "factories"}
          </span>
          <Link
            href="/manage/view-company"
            className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
          >
            Manage <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {ranked.length > 0 ? (
        <div className="relative z-10 mb-4 grid grid-cols-3 gap-2">
          <SummaryChip label="Staff" value={String(totalStaff)} />
          <SummaryChip label="Lines" value={String(totalLines)} />
          <SummaryChip label="Qty" value={`${formatQty(totalQty)} pcs`} />
        </div>
      ) : null}

      {garmentMix.length > 0 ? (
        <div className="relative z-10 mb-4 flex flex-wrap gap-2">
          {garmentMix.map((item, index) => (
            <span
              key={item.name}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${MIX_TONES[index % MIX_TONES.length]}`}
            >
              <Shirt className="h-3 w-3" />
              {item.name}
              <span className="rounded-full bg-white/70 px-1.5 text-[10px] dark:bg-black/25">
                {item.value}
              </span>
            </span>
          ))}
        </div>
      ) : null}

      {ranked.length === 0 ? (
        <div className="relative z-10 flex min-h-28 flex-col items-center justify-center rounded-xl border border-dashed border-sky-200/70 bg-white/50 text-center dark:border-sky-800/40 dark:bg-white/5">
          <p className="text-sm text-sky-800/70 dark:text-sky-200/60">
            Nothing to analyse here yet.
          </p>
          <Link
            href="/manage/add-company"
            className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            Add a factory <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="relative z-10 overflow-hidden rounded-xl border border-white/80 bg-white/70 shadow-inner backdrop-blur-sm dark:border-white/10 dark:bg-black/25">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-sky-100 bg-sky-50/70 text-[11px] uppercase tracking-wide text-sky-800/70 dark:border-white/10 dark:bg-white/5 dark:text-sky-100/60">
                  <th className="px-4 py-3 font-semibold">Factory</th>
                  <th className="px-3 py-3 font-semibold">Location</th>
                  <th className="px-3 py-3 font-semibold">Staff</th>
                  <th className="px-3 py-3 font-semibold">Lines</th>
                  <th className="px-3 py-3 font-semibold">Orders</th>
                  <th className="px-4 py-3 font-semibold">Qty</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((row, index) => {
                  const staffRatio =
                    row.employees > 0 ? row.activeEmployees / row.employees : 0;
                  const qtyRatio = maxQty > 0 ? row.orderQty / maxQty : 0;

                  return (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, delay: index * 0.04 }}
                      className="border-b border-sky-100/80 transition-colors last:border-0 hover:bg-sky-50/80 dark:border-white/5 dark:hover:bg-white/[0.04]"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${rankLook(index)}`}
                          >
                            {index + 1}
                          </span>
                          <span
                            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold text-white shadow-sm ring-2 ring-white/80 dark:ring-white/10 ${AVATAR_TONES[index % AVATAR_TONES.length]}`}
                          >
                            {initials(row.name)}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-black dark:text-white">
                              {row.name}
                            </p>
                            <p className="mt-0.5 inline-flex rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-700 dark:bg-sky-400/15 dark:text-sky-200">
                              {row.code || "No code"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="inline-flex max-w-[180px] items-center gap-1.5 text-bodydark2 dark:text-sky-100/70">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-sky-500" />
                          <span className="truncate">
                            {row.location || "—"}
                          </span>
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-semibold text-black dark:text-white">
                          {row.activeEmployees}
                          <span className="font-medium text-bodydark2 dark:text-sky-100/50">
                            /{row.employees}
                          </span>
                        </p>
                        <div className="mt-1.5 h-1.5 w-24 overflow-hidden rounded-full bg-sky-100 dark:bg-white/10">
                          <div
                            className={`h-full rounded-full ${staffTone(staffRatio)}`}
                            style={{ width: `${Math.round(staffRatio * 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-400/15 dark:text-indigo-200">
                          {row.lines}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-bold text-sky-700 dark:bg-sky-400/15 dark:text-sky-200">
                          {row.orders}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-extrabold tabular-nums text-black dark:text-white">
                          {formatQty(row.orderQty)}
                        </p>
                        <div className="mt-1.5 h-1.5 w-28 overflow-hidden rounded-full bg-sky-100 dark:bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-600"
                            style={{
                              width: `${Math.max(Math.round(qtyRatio * 100), row.orderQty > 0 ? 8 : 0)}%`,
                            }}
                          />
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/70 bg-white/70 px-3 py-2 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-bodydark2 dark:text-sky-100/55">
        {label}
      </p>
      <p className="mt-0.5 truncate text-sm font-extrabold text-black dark:text-white">
        {value}
      </p>
    </div>
  );
}
