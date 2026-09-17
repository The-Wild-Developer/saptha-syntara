"use client";

import { useId, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Factory, TrendingUp, UsersRound, Workflow } from "lucide-react";
import type { NamedCount } from "@/hooks/useDashboardData";
import "@/app/auth/login/login.css";

const PURPLE_PALETTE = [
  "#7C3AED",
  "#A78BFA",
  "#6D28D9",
  "#C4B5FD",
  "#8B5CF6",
  "#5B21B6",
  "#DDD6FE",
  "#4C1D95",
];

const PALETTE = [
  "#0EA5E9",
  "#8B5CF6",
  "#F59E0B",
  "#10B981",
  "#F43F5E",
  "#06B6D4",
  "#6366F1",
  "#84CC16",
];

const CHART_TONE = {
  sky: {
    card: "bg-[linear-gradient(145deg,#f0f9ff_0%,#ffffff_42%,#dbeafe_100%)] dark:bg-[linear-gradient(145deg,#0c1a2e_0%,#24303f_48%,#0c4a6e_100%)]",
    border: "border-sky-200/80 dark:border-sky-800/50",
    blob: "from-sky-300/70 to-blue-400/40 dark:from-sky-500/35 dark:to-blue-400/20",
    blobAlt:
      "from-cyan-200/50 to-indigo-300/30 dark:from-cyan-400/20 dark:to-indigo-300/10",
    icon: "bg-gradient-to-br from-sky-400 to-blue-600 text-white",
    badge:
      "bg-sky-500/12 text-sky-700 ring-sky-500/15 dark:bg-sky-400/15 dark:text-sky-200 dark:ring-sky-400/20",
    spark: "bg-sky-400",
    empty:
      "border-sky-200/70 bg-white/50 text-sky-700/70 dark:border-sky-800/40 dark:bg-white/5 dark:text-sky-200/60",
  },
  violet: {
    card: "bg-[linear-gradient(145deg,#f5f3ff_0%,#ffffff_42%,#ede9fe_100%)] dark:bg-[linear-gradient(145deg,#2e1065_0%,#24303f_48%,#4c1d95_100%)]",
    border: "border-violet-200/80 dark:border-violet-800/50",
    blob: "from-violet-300/70 to-fuchsia-400/40 dark:from-violet-500/35 dark:to-fuchsia-400/20",
    blobAlt:
      "from-indigo-200/50 to-violet-300/30 dark:from-indigo-400/20 dark:to-violet-300/10",
    icon: "bg-gradient-to-br from-violet-400 to-fuchsia-600 text-white",
    badge:
      "bg-violet-500/12 text-violet-700 ring-violet-500/15 dark:bg-violet-400/15 dark:text-violet-200 dark:ring-violet-400/20",
    spark: "bg-violet-400",
    empty:
      "border-violet-200/70 bg-white/50 text-violet-700/70 dark:border-violet-800/40 dark:bg-white/5 dark:text-violet-200/60",
  },
  emerald: {
    card: "bg-[linear-gradient(145deg,#ecfdf5_0%,#ffffff_42%,#d1fae5_100%)] dark:bg-[linear-gradient(145deg,#052e1c_0%,#24303f_48%,#064e3b_100%)]",
    border: "border-emerald-200/80 dark:border-emerald-800/50",
    blob: "from-emerald-300/70 to-teal-400/40 dark:from-emerald-500/35 dark:to-teal-400/20",
    blobAlt:
      "from-lime-200/50 to-emerald-300/30 dark:from-lime-400/20 dark:to-emerald-300/10",
    icon: "bg-gradient-to-br from-emerald-400 to-teal-600 text-white",
    badge:
      "bg-emerald-500/12 text-emerald-700 ring-emerald-500/15 dark:bg-emerald-400/15 dark:text-emerald-200 dark:ring-emerald-400/20",
    spark: "bg-emerald-400",
    empty:
      "border-emerald-200/70 bg-white/50 text-emerald-700/70 dark:border-emerald-800/40 dark:bg-white/5 dark:text-emerald-200/60",
  },
  amber: {
    card: "bg-[linear-gradient(145deg,#fffbeb_0%,#ffffff_42%,#fef3c7_100%)] dark:bg-[linear-gradient(145deg,#3b2508_0%,#24303f_48%,#78350f_100%)]",
    border: "border-amber-200/80 dark:border-amber-800/50",
    blob: "from-amber-300/70 to-orange-400/40 dark:from-amber-500/35 dark:to-orange-400/20",
    blobAlt:
      "from-yellow-200/50 to-amber-300/30 dark:from-yellow-400/20 dark:to-amber-300/10",
    icon: "bg-gradient-to-br from-amber-400 to-orange-600 text-white",
    badge:
      "bg-amber-500/12 text-amber-800 ring-amber-500/15 dark:bg-amber-400/15 dark:text-amber-200 dark:ring-amber-400/20",
    spark: "bg-amber-400",
    empty:
      "border-amber-200/70 bg-white/50 text-amber-800/70 dark:border-amber-800/40 dark:bg-white/5 dark:text-amber-200/60",
  },
} as const;

type ChartTone = keyof typeof CHART_TONE;

function formatCompact(value: number) {
  return value >= 1000
    ? `${Math.round(value / 1000)}k`
    : String(Math.round(value));
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
    <div
      className={`relative flex h-full flex-col overflow-hidden rounded-2xl border p-4 shadow-sm md:p-5 ${style.card} ${style.border}`}
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

      <div className="relative z-10 mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-2 ring-white/70 dark:ring-white/10 ${style.icon}`}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-black dark:text-white">
              {title}
            </h3>
            <p className="mt-0.5 text-xs text-bodydark2 dark:text-white/55">
              {subtitle}
            </p>
          </div>
        </div>
        {badge ? (
          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${style.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${style.spark}`} />
            {badge}
          </span>
        ) : null}
      </div>

      {empty ? (
        <div
          className={`relative z-10 flex min-h-[260px] flex-1 items-center justify-center rounded-xl border border-dashed text-sm ${style.empty}`}
        >
          No data yet. Add records to populate this chart.
        </div>
      ) : (
        <div className="relative z-10 min-h-[260px] flex-1 overflow-hidden rounded-xl border border-white/80 bg-white/65 p-3 shadow-inner backdrop-blur-sm dark:border-white/10 dark:bg-black/25">
          {children}
        </div>
      )}
    </div>
  );
}

export function VolumeTrendChart({
  labels,
  data,
}: {
  labels: string[];
  data: number[];
}) {
  const gradientId = useId().replace(/:/g, "");
  const fillId = `volume-fill-${gradientId}`;
  const empty = data.every((value) => value === 0);
  const total = data.reduce((sum, value) => sum + value, 0);
  const max = Math.max(...data, 1);
  const width = 100;
  const height = 70;
  const points = data.map((value, index) => {
    const x = data.length === 1 ? width / 2 : (index / (data.length - 1)) * width;
    const y = height - (value / max) * height;
    return { x, y, value, label: labels[index] || "" };
  });
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area =
    points.length === 0
      ? ""
      : `M${points[0].x} ${height} ${points
          .map((point) => `L${point.x} ${point.y}`)
          .join(" ")} L${points[points.length - 1].x} ${height} Z`;

  return (
    <ChartShell
      title="Order volume trend"
      subtitle="Booked quantity by order month (last 6 months)"
      empty={empty}
      tone="sky"
      icon={TrendingUp}
      badge={empty ? undefined : `${total.toLocaleString()} pcs`}
    >
      <div className="flex h-full min-h-[236px] flex-col">
        <div className="flex min-h-0 flex-1 gap-2">
          <div className="flex w-8 shrink-0 flex-col justify-between py-1 text-right text-[10px] font-semibold text-bodydark2">
            <span>{formatCompact(max)}</span>
            <span>{formatCompact(max / 2)}</span>
            <span>0</span>
          </div>
          <div className="relative min-w-0 flex-1">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="h-full w-full overflow-visible"
              preserveAspectRatio="none"
              role="img"
              aria-label="Order volume trend"
            >
              <defs>
                <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.5" />
                  <stop offset="55%" stopColor="#0EA5E9" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0.04" />
                </linearGradient>
              </defs>
              {[0.25, 0.5, 0.75].map((ratio) => (
                <line
                  key={ratio}
                  x1="0"
                  x2={width}
                  y1={height * ratio}
                  y2={height * ratio}
                  className="stroke-stroke dark:stroke-strokedark"
                  strokeDasharray="2 3"
                  strokeWidth="0.4"
                />
              ))}
              <path d={area} fill={`url(#${fillId})`} />
              <polyline
                points={line}
                fill="none"
                stroke="#0EA5E9"
                strokeWidth="1.6"
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              {points.map((point, index) => (
                <circle
                  key={`${point.label}-${index}`}
                  cx={point.x}
                  cy={point.y}
                  r="1.6"
                  fill="#fff"
                  stroke="#0EA5E9"
                  strokeWidth="0.8"
                >
                  <title>
                    {point.label}: {point.value.toLocaleString()} pcs
                  </title>
                </circle>
              ))}
            </svg>
          </div>
        </div>
        <div className="ml-10 mt-2 flex justify-between text-[10px] font-semibold text-bodydark2">
          {labels.map((label) => (
            <span key={label} className="truncate px-0.5">
              {label}
            </span>
          ))}
        </div>
      </div>
    </ChartShell>
  );
}

export function OrderStatusChart({ items }: { items: NamedCount[] }) {
  const rows = items.filter((item) => item.value > 0);
  const empty = rows.length === 0;
  const total = rows.reduce((sum, item) => sum + item.value, 0);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const segments = rows.map((item, index) => {
    const length = total === 0 ? 0 : (item.value / total) * circumference;
    const segment = {
      ...item,
      color: PURPLE_PALETTE[index % PURPLE_PALETTE.length],
      dash: length,
      gap: circumference - length,
      offset,
    };
    offset += length;
    return segment;
  });

  return (
    <ChartShell
      title="Order book status"
      subtitle="Live mix across cutting, sewing, packing and shipment"
      empty={empty}
      tone="violet"
      icon={Workflow}
      badge={empty ? undefined : `${total} live`}
    >
      <div className="flex h-full min-h-[236px] flex-col items-center justify-center gap-4 sm:flex-row">
        <div className="relative h-40 w-40 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              className="stroke-violet-100 dark:stroke-white/10"
              strokeWidth="14"
            />
            {segments.map((segment) => (
              <circle
                key={segment.name}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth="14"
                strokeDasharray={`${segment.dash} ${segment.gap}`}
                strokeDashoffset={-segment.offset}
                strokeLinecap="butt"
              >
                <title>
                  {segment.name}: {segment.value} orders
                </title>
              </circle>
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[10px] font-bold uppercase tracking-wide text-violet-600 dark:text-violet-200">
              Total
            </p>
            <p className="text-2xl font-extrabold text-violet-900 dark:text-violet-50">
              {total.toLocaleString()}
            </p>
          </div>
        </div>
        <ul className="grid w-full max-w-xs grid-cols-1 gap-1.5 text-xs font-semibold text-bodydark2 sm:flex-1">
          {segments.map((segment) => (
            <li key={segment.name} className="flex items-center justify-between gap-2">
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="truncate text-black dark:text-white">
                  {segment.name}
                </span>
              </span>
              <span>{segment.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </ChartShell>
  );
}

export function DepartmentChart({ items }: { items: NamedCount[] }) {
  const empty = items.length === 0;
  const rows = items.slice(0, 8);
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
      <div className="flex h-full min-h-[236px] items-end gap-2 px-1 pb-1 pt-4">
        {rows.map((item, index) => (
          <div
            key={item.name}
            className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
            title={`${item.name}: ${item.value} employees`}
          >
            <span className="text-[11px] font-bold text-black dark:text-white">
              {item.value}
            </span>
            <div
              className="w-full max-w-10 rounded-t-lg"
              style={{
                height: `${Math.max((item.value / max) * 100, 6)}%`,
                background: `linear-gradient(180deg, ${PALETTE[index % PALETTE.length]}, ${PALETTE[index % PALETTE.length]}cc)`,
              }}
            />
            <span className="w-full truncate text-center text-[10px] font-semibold text-bodydark2">
              {item.name}
            </span>
          </div>
        ))}
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
      <div className="flex h-full min-h-[236px] flex-col">
        <div className="mb-3 flex gap-3 text-[11px] font-bold text-bodydark2">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            Assigned
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
            Planned
          </span>
        </div>
        <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
          {items.map((item) => (
            <li key={item.name}>
              <p className="mb-1 truncate text-xs font-semibold text-black dark:text-white">
                {item.name}
              </p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-amber-100 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600"
                      style={{ width: `${(item.assigned / max) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-[10px] font-bold text-amber-700 dark:text-amber-200">
                    {item.assigned}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-violet-100 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-400 to-violet-600"
                      style={{ width: `${(item.planned / max) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-[10px] font-bold text-violet-700 dark:text-violet-200">
                    {item.planned}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </ChartShell>
  );
}
