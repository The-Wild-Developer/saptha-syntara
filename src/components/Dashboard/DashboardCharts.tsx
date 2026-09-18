"use client";

import { useId, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Factory, TrendingUp, UsersRound, Workflow } from "lucide-react";
import type { NamedCount } from "@/hooks/useDashboardData";
import "@/app/auth/login/login.css";

const STATUS_COLORS: Record<string, string> = {
  Confirmed: "#0EA5E9",
  "In Cutting": "#F59E0B",
  "In Sewing": "#8B5CF6",
  "In Finishing": "#06B6D4",
  Packed: "#10B981",
  Shipped: "#14B8A6",
  "On Hold": "#F97316",
  Cancelled: "#F43F5E",
};

const FALLBACK_PALETTE = [
  "#6366F1",
  "#A78BFA",
  "#F472B6",
  "#38BDF8",
  "#34D399",
  "#FBBF24",
];

const DEPT_BARS = [
  "from-emerald-400 via-teal-500 to-cyan-500",
  "from-teal-400 via-emerald-500 to-green-500",
  "from-cyan-400 via-teal-500 to-emerald-600",
  "from-green-400 via-emerald-500 to-teal-600",
  "from-lime-400 via-emerald-500 to-teal-500",
  "from-teal-300 via-cyan-500 to-sky-500",
  "from-emerald-300 via-green-500 to-teal-600",
  "from-cyan-300 via-teal-400 to-emerald-500",
];

const CHART_TONE = {
  sky: {
    card: "bg-[linear-gradient(145deg,#f0f9ff_0%,#ffffff_42%,#dbeafe_100%)] dark:bg-[linear-gradient(145deg,#0c1a2e_0%,#24303f_48%,#0c4a6e_100%)]",
    border: "border-sky-200/80 dark:border-sky-800/50",
    blob: "from-sky-300/70 to-blue-400/40 dark:from-sky-500/35 dark:to-blue-400/20",
    blobAlt:
      "from-cyan-200/50 to-indigo-300/30 dark:from-cyan-400/20 dark:to-indigo-300/10",
    icon: "bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-sky-500/25",
    badge:
      "bg-sky-500/12 text-sky-700 ring-sky-500/15 dark:bg-sky-400/15 dark:text-sky-200 dark:ring-sky-400/20",
    spark: "bg-sky-400",
    empty:
      "border-sky-200/70 bg-white/50 text-sky-700/70 dark:border-sky-800/40 dark:bg-white/5 dark:text-sky-200/60",
    watermark: "fill-sky-400/25 text-sky-500/55 dark:fill-sky-300/20 dark:text-sky-200/50",
    well: "border-sky-100/80 dark:border-sky-900/40",
  },
  violet: {
    card: "bg-[linear-gradient(145deg,#f5f3ff_0%,#ffffff_42%,#ede9fe_100%)] dark:bg-[linear-gradient(145deg,#2e1065_0%,#24303f_48%,#4c1d95_100%)]",
    border: "border-violet-200/80 dark:border-violet-800/50",
    blob: "from-violet-300/70 to-fuchsia-400/40 dark:from-violet-500/35 dark:to-fuchsia-400/20",
    blobAlt:
      "from-indigo-200/50 to-violet-300/30 dark:from-indigo-400/20 dark:to-violet-300/10",
    icon: "bg-gradient-to-br from-violet-400 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25",
    badge:
      "bg-violet-500/12 text-violet-700 ring-violet-500/15 dark:bg-violet-400/15 dark:text-violet-200 dark:ring-violet-400/20",
    spark: "bg-violet-400",
    empty:
      "border-violet-200/70 bg-white/50 text-violet-700/70 dark:border-violet-800/40 dark:bg-white/5 dark:text-violet-200/60",
    watermark: "fill-violet-400/25 text-violet-500/55 dark:fill-violet-300/20 dark:text-violet-200/50",
    well: "border-violet-100/80 dark:border-violet-900/40",
  },
  emerald: {
    card: "bg-[linear-gradient(145deg,#ecfdf5_0%,#ffffff_42%,#d1fae5_100%)] dark:bg-[linear-gradient(145deg,#052e1c_0%,#24303f_48%,#064e3b_100%)]",
    border: "border-emerald-200/80 dark:border-emerald-800/50",
    blob: "from-emerald-300/70 to-teal-400/40 dark:from-emerald-500/35 dark:to-teal-400/20",
    blobAlt:
      "from-lime-200/50 to-emerald-300/30 dark:from-lime-400/20 dark:to-emerald-300/10",
    icon: "bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-lg shadow-emerald-500/25",
    badge:
      "bg-emerald-500/12 text-emerald-700 ring-emerald-500/15 dark:bg-emerald-400/15 dark:text-emerald-200 dark:ring-emerald-400/20",
    spark: "bg-emerald-400",
    empty:
      "border-emerald-200/70 bg-white/50 text-emerald-700/70 dark:border-emerald-800/40 dark:bg-white/5 dark:text-emerald-200/60",
    watermark: "fill-emerald-400/25 text-emerald-500/55 dark:fill-emerald-300/20 dark:text-emerald-200/50",
    well: "border-emerald-100/80 dark:border-emerald-900/40",
  },
  amber: {
    card: "bg-[linear-gradient(145deg,#fffbeb_0%,#ffffff_42%,#fef3c7_100%)] dark:bg-[linear-gradient(145deg,#3b2508_0%,#24303f_48%,#78350f_100%)]",
    border: "border-amber-200/80 dark:border-amber-800/50",
    blob: "from-amber-300/70 to-orange-400/40 dark:from-amber-500/35 dark:to-orange-400/20",
    blobAlt:
      "from-yellow-200/50 to-amber-300/30 dark:from-yellow-400/20 dark:to-amber-300/10",
    icon: "bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-lg shadow-amber-500/25",
    badge:
      "bg-amber-500/12 text-amber-800 ring-amber-500/15 dark:bg-amber-400/15 dark:text-amber-200 dark:ring-amber-400/20",
    spark: "bg-amber-400",
    empty:
      "border-amber-200/70 bg-white/50 text-amber-800/70 dark:border-amber-800/40 dark:bg-white/5 dark:text-amber-200/60",
    watermark: "fill-amber-400/30 text-amber-500/55 dark:fill-amber-300/20 dark:text-amber-200/50",
    well: "border-amber-100/80 dark:border-amber-900/40",
  },
} as const;

type ChartTone = keyof typeof CHART_TONE;

function formatCompact(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}m`;
  if (value >= 1000) return `${Math.round(value / 100) / 10}k`;
  return String(Math.round(value));
}

function formatPct(value: number, total: number) {
  if (total <= 0) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}

function statusColor(name: string, index: number) {
  return STATUS_COLORS[name] || FALLBACK_PALETTE[index % FALLBACK_PALETTE.length];
}

function polar(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polar(cx, cy, r, endAngle);
  const end = polar(cx, cy, r, startAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`;
}

function linePath(points: { x: number; y: number }[]) {
  if (points.length === 0) return "";
  return points
    .map((point, index) =>
      `${index === 0 ? "M" : "L"} ${point.x.toFixed(3)} ${point.y.toFixed(3)}`,
    )
    .join(" ");
}

function ChartShell({
  title,
  subtitle,
  empty,
  tone,
  icon: Icon,
  badge,
  children,
}: {
  title: string;
  subtitle: string;
  empty?: boolean;
  tone: ChartTone;
  icon: LucideIcon;
  badge?: string;
  children: ReactNode;
}) {
  const style = CHART_TONE[tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`relative flex h-[500px] flex-col overflow-hidden rounded-xl border p-3 shadow-sm ${style.card} ${style.border}`}
    >
      <span
        aria-hidden
        className={`login-animate-blob login-animate-float pointer-events-none absolute -right-10 -top-12 h-32 w-32 bg-gradient-to-br opacity-70 ${style.blob}`}
      />
      <span
        aria-hidden
        className={`login-animate-morph login-animate-float-reverse pointer-events-none absolute -bottom-14 -left-10 h-28 w-28 bg-gradient-to-br opacity-50 ${style.blobAlt}`}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent dark:via-white/30"
      />
      <Icon
        aria-hidden
        strokeWidth={1.15}
        className={`pointer-events-none absolute -bottom-3 -right-2 h-20 w-20 rotate-[-12deg] ${style.watermark}`}
      />

      <div className="relative z-10 mb-2 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-2 ring-white/70 dark:ring-white/10 ${style.icon}`}
          >
            <Icon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-black dark:text-white">
              {title}
            </h3>
            <p className="truncate text-[11px] text-bodydark2 dark:text-white/55">
              {subtitle}
            </p>
          </div>
        </div>
        {badge ? (
          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${style.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${style.spark}`} />
            {badge}
          </span>
        ) : null}
      </div>

      {empty ? (
        <div
          className={`relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-xs ${style.empty}`}
        >
          <Icon className="h-6 w-6 opacity-40" />
          <p className="font-semibold">No data yet</p>
        </div>
      ) : (
        <div
          className={`relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border bg-white/75 p-2 shadow-inner backdrop-blur-sm dark:bg-black/30 ${style.well}`}
        >
          <div className="h-full min-h-0">{children}</div>
        </div>
      )}
    </motion.div>
  );
}

export function VolumeTrendChart({
  labels,
  data,
}: {
  labels: string[];
  data: number[];
}) {
  const uid = useId().replace(/:/g, "");
  const fillId = `volume-fill-${uid}`;
  const [active, setActive] = useState<number | null>(null);

  const empty = data.every((value) => value === 0);
  const total = data.reduce((sum, value) => sum + value, 0);
  const max = Math.max(...data, 1);
  const avg = data.length ? total / data.length : 0;
  const width = 100;
  const height = 72;
  const last = data[data.length - 1] || 0;
  const prev = data[data.length - 2] || 0;
  const delta = prev === 0 ? (last > 0 ? 100 : 0) : ((last - prev) / prev) * 100;
  const peakIndex = data.reduce(
    (best, value, index) => (value > data[best] ? index : best),
    0,
  );

  const points = data.map((value, index) => {
    const x = data.length === 1 ? width / 2 : (index / (data.length - 1)) * width;
    const y = height - (value / max) * (height - 8) - 4;
    return { x, y, value, label: labels[index] || "" };
  });
  const line = linePath(points);
  const area =
    points.length === 0
      ? ""
      : `${line} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;
  const avgY = height - (avg / max) * (height - 8) - 4;
  const hover = active === null ? null : points[active];

  return (
    <ChartShell
      title="Order volume trend"
      subtitle="Booked quantity by order month (last 6 months)"
      empty={empty}
      tone="sky"
      icon={TrendingUp}
      badge={empty ? undefined : `${total.toLocaleString()} pcs`}
    >
      <div className="flex h-full min-h-0 flex-col">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold text-bodydark2 dark:text-white/55">
            Latest {labels[labels.length - 1]} · {last.toLocaleString()} pcs
          </p>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
              delta >= 0
                ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-200"
                : "bg-rose-500/12 text-rose-700 dark:text-rose-200"
            }`}
          >
            {delta >= 0 ? "↑" : "↓"} {Math.abs(Math.round(delta))}% vs prior
          </span>
        </div>

        <div className="flex min-h-0 flex-1 gap-2">
          <div className="flex w-9 shrink-0 flex-col justify-between py-1 text-right text-[10px] font-semibold text-bodydark2">
            <span>{formatCompact(max)}</span>
            <span>{formatCompact(max / 2)}</span>
            <span>0</span>
          </div>
          <div
            className="relative min-w-0 flex-1 cursor-crosshair"
            onMouseLeave={() => setActive(null)}
            onMouseMove={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              const x = ((event.clientX - rect.left) / rect.width) * width;
              let nearest = 0;
              let best = Infinity;
              points.forEach((point, index) => {
                const distance = Math.abs(point.x - x);
                if (distance < best) {
                  best = distance;
                  nearest = index;
                }
              });
              setActive(nearest);
            }}
          >
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="h-full w-full overflow-visible"
              preserveAspectRatio="none"
              role="img"
              aria-label="Order volume trend"
            >
              <defs>
                <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              {[0.25, 0.5, 0.75].map((ratio) => (
                <line
                  key={ratio}
                  x1="0"
                  x2={width}
                  y1={height * ratio}
                  y2={height * ratio}
                  className="stroke-slate-300/70 dark:stroke-white/15"
                  strokeDasharray="1.6 2.4"
                  strokeWidth="0.35"
                />
              ))}
              <line
                x1="0"
                x2={width}
                y1={avgY}
                y2={avgY}
                stroke="#0EA5E9"
                strokeWidth="0.45"
                strokeDasharray="1.8 1.8"
                opacity="0.45"
              />
              <path d={area} fill={`url(#${fillId})`} />
              <path
                d={line}
                fill="none"
                stroke="#0EA5E9"
                strokeWidth="2.4"
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              {hover ? (
                <line
                  x1={hover.x}
                  x2={hover.x}
                  y1="0"
                  y2={height}
                  stroke="#0EA5E9"
                  strokeWidth="0.45"
                  strokeDasharray="1.4 1.6"
                  opacity="0.85"
                />
              ) : null}
            </svg>

            {points.map((point, index) => {
              const isPeak = index === peakIndex;
              const isActive = index === active;
              return (
                <span
                  key={`${point.label}-${index}`}
                  className="pointer-events-none absolute h-3 w-3"
                  style={{
                    left: `${point.x}%`,
                    top: `${(point.y / height) * 100}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {isPeak ? (
                    <span className="chart-pulse-dot absolute inset-0 rounded-full bg-primary" />
                  ) : null}
                  <span
                    className={`absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-white shadow-sm transition-all ${
                      isActive || isPeak ? "h-3 w-3" : "h-2.5 w-2.5"
                    }`}
                  />
                </span>
              );
            })}

            {hover ? (
              <div
                className="pointer-events-none absolute z-10 rounded-xl border border-sky-200/80 bg-white/95 px-2.5 py-1.5 text-[11px] shadow-lg backdrop-blur dark:border-sky-800/60 dark:bg-slate-900/95"
                style={{
                  left: `${hover.x}%`,
                  top: `${Math.min(Math.max((hover.y / height) * 100 - 22, 2), 68)}%`,
                  transform:
                    hover.x < 18
                      ? "translate(8px, -50%)"
                      : hover.x > 82
                        ? "translate(calc(-100% - 8px), -50%)"
                        : "translate(-50%, -110%)",
                }}
              >
                <p className="font-bold text-sky-800 dark:text-sky-100">
                  {hover.label}
                </p>
                <p className="font-semibold text-bodydark2 dark:text-white/70">
                  {hover.value.toLocaleString()} pcs
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="ml-11 mt-2 flex justify-between text-[10px] font-semibold text-bodydark2">
          {labels.map((label, index) => (
            <span
              key={label}
              className={`truncate px-0.5 ${
                index === active
                  ? "text-sky-700 dark:text-sky-200"
                  : index === labels.length - 1
                    ? "text-black dark:text-white"
                    : ""
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </ChartShell>
  );
}

export function OrderStatusChart({ items }: { items: NamedCount[] }) {
  const [active, setActive] = useState<string | null>(null);
  const rows = items.filter((item) => item.value > 0);
  const empty = rows.length === 0;
  const total = rows.reduce((sum, item) => sum + item.value, 0);
  const cx = 50;
  const cy = 50;
  const radius = 34;
  const gap = rows.length > 1 ? 7 : 0;

  let cursor = 0;
  const segments = rows.map((item, index) => {
    const sweep = total === 0 ? 0 : (item.value / total) * 360;
    const start = cursor + gap / 2;
    const end = cursor + sweep - gap / 2;
    cursor += sweep;
    return {
      ...item,
      color: statusColor(item.name, index),
      start,
      end: Math.max(end, start + 0.6),
      pct: formatPct(item.value, total),
    };
  });

  const focused =
    segments.find((segment) => segment.name === active) || null;

  return (
    <ChartShell
      title="Order book status"
      subtitle="Live mix across cutting, sewing, packing and shipment"
      empty={empty}
      tone="violet"
      icon={Workflow}
      badge={empty ? undefined : `${total} live`}
    >
      <div className="flex h-full min-h-0 items-center justify-center gap-5">
        <div className="relative h-72 w-72 shrink-0">
          <div className="absolute inset-[22%] rounded-full bg-violet-400/20 blur-xl dark:bg-violet-300/15" />
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              className="stroke-violet-100 dark:stroke-white/10"
              strokeWidth="13"
            />
            {segments.map((segment) => {
              const isActive = active === segment.name;
              const full = segment.end - segment.start >= 350;
              return (
                <path
                  key={segment.name}
                  d={
                    full
                      ? `M ${cx} ${cy - radius} A ${radius} ${radius} 0 1 1 ${cx - 0.01} ${cy - radius}`
                      : arcPath(cx, cy, radius, segment.start, segment.end)
                  }
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={isActive ? 16 : 12}
                  strokeLinecap="round"
                  className="cursor-pointer transition-all duration-200"
                  opacity={active && !isActive ? 0.35 : 1}
                  onMouseEnter={() => setActive(segment.name)}
                  onMouseLeave={() => setActive(null)}
                >
                  <title>
                    {segment.name}: {segment.value} orders
                  </title>
                </path>
              );
            })}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="max-w-[8rem] truncate text-[11px] font-bold uppercase tracking-[0.16em] text-violet-500 dark:text-violet-200">
              {focused ? focused.name : "Total"}
            </p>
            <p className="text-4xl font-extrabold leading-none text-violet-900 dark:text-violet-50">
              {(focused ? focused.value : total).toLocaleString()}
            </p>
            <p className="mt-1 text-xs font-semibold text-violet-600/80 dark:text-violet-200/70">
              {focused ? focused.pct : "orders"}
            </p>
          </div>
        </div>

        <ul className="min-h-0 flex-1 space-y-0.5 overflow-y-auto text-[11px]">
          {segments.map((segment) => {
            const isActive = active === segment.name;
            return (
              <li key={segment.name}>
                <button
                  type="button"
                  className={`flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-left transition ${
                    isActive
                      ? "bg-white/80 shadow-sm dark:bg-white/10"
                      : "hover:bg-white/50 dark:hover:bg-white/5"
                  }`}
                  onMouseEnter={() => setActive(segment.name)}
                  onMouseLeave={() => setActive(null)}
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full ring-2 ring-white dark:ring-white/10"
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className="min-w-0 flex-1 truncate font-semibold text-black dark:text-white">
                    {segment.name}
                  </span>
                  <span className="shrink-0 font-bold text-bodydark2 dark:text-white/70">
                    {segment.value}
                  </span>
                  <span className="w-8 shrink-0 text-right text-[10px] font-bold text-bodydark2">
                    {segment.pct}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </ChartShell>
  );
}

export function DepartmentChart({ items }: { items: NamedCount[] }) {
  const empty = items.length === 0;
  const rows = [...items]
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
  const total = rows.reduce((sum, item) => sum + item.value, 0);
  const max = Math.max(...rows.map((item) => item.value), 1);

  return (
    <ChartShell
      title="Workforce by department"
      subtitle="Headcount across production, quality, stores and support"
      empty={empty}
      tone="emerald"
      icon={UsersRound}
      badge={empty ? undefined : `${total} people`}
    >
      <div className="flex h-full min-h-0 flex-col justify-center gap-1.5 overflow-y-auto">
        {rows.map((item, index) => {
          const width = Math.max((item.value / max) * 100, 8);
          const share = formatPct(item.value, total);
          return (
            <div key={item.name} className="group">
              <div className="mb-0.5 flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-1.5">
                  <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-[9px] font-bold text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-100">
                    {index + 1}
                  </span>
                  <p className="truncate text-[11px] font-semibold text-black dark:text-white">
                    {item.name}
                  </p>
                </div>
                <p className="shrink-0 text-[10px] font-bold text-emerald-800 dark:text-emerald-100">
                  {item.value}
                  <span className="ml-1 font-semibold text-bodydark2 dark:text-white/50">
                    {share}
                  </span>
                </p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-emerald-100/80 dark:bg-white/10">
                <motion.div
                  className={`chart-bar-sheen h-full rounded-full bg-gradient-to-r shadow-[0_0_12px_rgba(16,185,129,0.28)] ${DEPT_BARS[index % DEPT_BARS.length]}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${width}%` }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.07,
                    ease: "easeOut",
                  }}
                  title={`${item.name}: ${item.value} employees`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </ChartShell>
  );
}

export function LineStaffingChart({
  items,
}: {
  items: { name: string; assigned: number; planned: number }[];
}) {
  const empty = items.length === 0;
  const assigned = items.reduce((sum, item) => sum + item.assigned, 0);
  const planned = items.reduce((sum, item) => sum + item.planned, 0);
  const overall = planned <= 0 ? 0 : Math.round((assigned / planned) * 100);
  const max = Math.max(
    ...items.flatMap((item) => [item.assigned, item.planned]),
    1,
  );

  return (
    <ChartShell
      title="Line staffing"
      subtitle="Assigned operators versus planned headcount"
      empty={empty}
      tone="amber"
      icon={Factory}
      badge={empty ? undefined : `${assigned}/${planned}`}
    >
      <div className="flex h-full min-h-0 flex-col">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex gap-3 text-[10px] font-bold text-bodydark2">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-gradient-to-b from-amber-400 to-orange-500" />
              Assigned
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-gradient-to-b from-violet-400 to-violet-600" />
              Planned
            </span>
          </div>
          <span className="rounded-full bg-amber-500/12 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-200">
            {overall}% filled
          </span>
        </div>

        <div className="flex min-h-0 flex-1 gap-2">
          <div className="flex w-7 shrink-0 flex-col justify-between py-1 pb-6 text-right text-[9px] font-semibold text-bodydark2">
            <span>{formatCompact(max)}</span>
            <span>{formatCompact(max / 2)}</span>
            <span>0</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="relative min-h-0 flex-1">
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                <span className="block h-px w-full border-t border-dashed border-amber-200/80 dark:border-white/15" />
                <span className="block h-px w-full border-t border-dashed border-amber-200/80 dark:border-white/15" />
                <span className="block h-px w-full bg-amber-300/80 dark:bg-white/20" />
              </div>
              <div className="absolute inset-0 flex items-end gap-2 px-1">
                {items.map((item, index) => {
                  const assignedH = (item.assigned / max) * 100;
                  const plannedH = (item.planned / max) * 100;
                  return (
                    <div
                      key={item.name}
                      className="flex h-full min-w-0 flex-1 items-end justify-center gap-1"
                    >
                      <motion.div
                        className="chart-bar-sheen w-1/2 max-w-8 rounded-t-md bg-gradient-to-t from-orange-600 to-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.28)]"
                        title={`${item.name} assigned: ${item.assigned}`}
                        initial={{ height: 0 }}
                        animate={{ height: `${assignedH}%` }}
                        transition={{
                          duration: 0.7,
                          delay: index * 0.05,
                          ease: "easeOut",
                        }}
                      />
                      <motion.div
                        className="chart-bar-sheen w-1/2 max-w-8 rounded-t-md bg-gradient-to-t from-violet-700 to-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.28)]"
                        title={`${item.name} planned: ${item.planned}`}
                        initial={{ height: 0 }}
                        animate={{ height: `${plannedH}%` }}
                        transition={{
                          duration: 0.7,
                          delay: index * 0.05 + 0.05,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-1 flex gap-2 px-1">
              {items.map((item) => (
                <span
                  key={item.name}
                  className="min-w-0 flex-1 truncate text-center text-[9px] font-semibold text-bodydark2"
                >
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ChartShell>
  );
}
