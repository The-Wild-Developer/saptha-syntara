"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { ApexOptions } from "apexcharts";
import type { LucideIcon } from "lucide-react";
import { Factory, TrendingUp, UsersRound, Workflow } from "lucide-react";
import useColorMode from "@/hooks/useColorMode";
import type { NamedCount } from "@/hooks/useDashboardData";
import "@/app/auth/login/login.css";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

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
        <div className="relative z-10 min-h-[260px] flex-1 overflow-hidden rounded-xl border border-white/80 bg-white/65 p-1 shadow-inner backdrop-blur-sm dark:border-white/10 dark:bg-black/25">
          {children}
        </div>
      )}
    </div>
  );
}

function useChartTheme() {
  const [colorMode] = useColorMode();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = colorMode === "dark";
  const foreColor = isDark ? "#AEB7C0" : "#64748B";
  const gridColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)";

  return { mounted, isDark, foreColor, gridColor };
}

export function VolumeTrendChart({
  labels,
  data,
}: {
  labels: string[];
  data: number[];
}) {
  const { mounted, isDark, foreColor, gridColor } = useChartTheme();
  const empty = data.every((value) => value === 0);
  const total = data.reduce((sum, value) => sum + value, 0);

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "area",
        toolbar: { show: false },
        fontFamily: "inherit",
        background: "transparent",
        sparkline: { enabled: false },
        dropShadow: {
          enabled: true,
          color: "#0EA5E9",
          top: 8,
          left: 0,
          blur: 12,
          opacity: 0.25,
        },
      },
      colors: ["#0EA5E9"],
      dataLabels: { enabled: false },
      markers: {
        size: 5,
        colors: ["#fff"],
        strokeColors: "#0EA5E9",
        strokeWidth: 3,
        hover: { size: 7 },
      },
      stroke: { curve: "smooth", width: 3 },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: isDark ? 0.55 : 0.45,
          opacityTo: 0.04,
          stops: [0, 70, 100],
          colorStops: [
            { offset: 0, color: "#38BDF8", opacity: isDark ? 0.55 : 0.5 },
            { offset: 55, color: "#0EA5E9", opacity: isDark ? 0.28 : 0.22 },
            { offset: 100, color: "#0284C7", opacity: 0.04 },
          ],
        },
      },
      grid: {
        borderColor: gridColor,
        strokeDashArray: 4,
        padding: { left: 8, right: 8 },
      },
      xaxis: {
        categories: labels,
        labels: { style: { colors: foreColor, fontWeight: 600 } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          style: { colors: foreColor },
          formatter: (value) =>
            value >= 1000
              ? `${Math.round(value / 1000)}k`
              : String(Math.round(value)),
        },
      },
      tooltip: {
        theme: isDark ? "dark" : "light",
        y: {
          formatter: (value) => `${value.toLocaleString()} pcs`,
        },
      },
    }),
    [foreColor, gridColor, isDark, labels],
  );

  return (
    <ChartShell
      title="Order volume trend"
      subtitle="Booked quantity by order month (last 6 months)"
      empty={empty}
      tone="sky"
      icon={TrendingUp}
      badge={empty ? undefined : `${total.toLocaleString()} pcs`}
    >
      {mounted ? (
        <ReactApexChart
          options={options}
          series={[{ name: "Order qty", data }]}
          type="area"
          height={260}
        />
      ) : null}
    </ChartShell>
  );
}

export function OrderStatusChart({ items }: { items: NamedCount[] }) {
  const { mounted, isDark, foreColor } = useChartTheme();
  const rows = items.filter((item) => item.value > 0);
  const empty = rows.length === 0;
  const total = rows.reduce((sum, item) => sum + item.value, 0);

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "donut",
        fontFamily: "inherit",
        background: "transparent",
        animations: { enabled: false },
      },
      labels: rows.map((item) => item.name),
      colors: PURPLE_PALETTE,
      stroke: {
        width: 3,
        colors: [isDark ? "#24303f" : "#ffffff"],
      },
      dataLabels: { enabled: false },
      legend: {
        position: "bottom",
        fontWeight: 600,
        fontSize: "13px",
        markers: { width: 12, height: 12, radius: 12, offsetX: -3 },
        labels: { colors: foreColor },
        itemMargin: { horizontal: 10, vertical: 4 },
      },
      plotOptions: {
        pie: {
          expandOnClick: false,
          donut: {
            size: "68%",
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: "11px",
                fontWeight: 600,
                color: isDark ? "#C4B5FD" : "#7C3AED",
                offsetY: -6,
              },
              value: {
                show: true,
                fontSize: "22px",
                fontWeight: 800,
                color: isDark ? "#F5F3FF" : "#5B21B6",
                offsetY: 2,
                formatter: (value) => String(value),
              },
              total: {
                show: true,
                showAlways: true,
                label: "TOTAL",
                fontSize: "11px",
                fontWeight: 700,
                color: isDark ? "#C4B5FD" : "#7C3AED",
                formatter: () => total.toLocaleString(),
              },
            },
          },
        },
      },
      tooltip: {
        theme: "dark",
        y: { formatter: (value) => `${value} orders` },
      },
    }),
    [foreColor, isDark, rows, total],
  );

  return (
    <ChartShell
      title="Order book status"
      subtitle="Live mix across cutting, sewing, packing and shipment"
      empty={empty}
      tone="violet"
      icon={Workflow}
      badge={empty ? undefined : `${total} live`}
    >
      {mounted ? (
        <div className="order-status-donut h-full">
          <style>{`
            .order-status-donut .apexcharts-tooltip,
            .order-status-donut .apexcharts-tooltip-text,
            .order-status-donut .apexcharts-tooltip-title,
            .order-status-donut .apexcharts-tooltip-y-group {
              color: #ffffff !important;
            }
          `}</style>
          <ReactApexChart
            options={options}
            series={rows.map((item) => item.value)}
            type="donut"
            height={260}
          />
        </div>
      ) : null}
    </ChartShell>
  );
}

export function DepartmentChart({ items }: { items: NamedCount[] }) {
  const { mounted, isDark, foreColor, gridColor } = useChartTheme();
  const empty = items.length === 0;
  const rows = items.slice(0, 8);
  const total = rows.reduce((sum, item) => sum + item.value, 0);

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        toolbar: { show: false },
        fontFamily: "inherit",
        background: "transparent",
      },
      colors: PALETTE,
      plotOptions: {
        bar: {
          borderRadius: 8,
          borderRadiusApplication: "end",
          columnWidth: "46%",
          distributed: true,
        },
      },
      dataLabels: { enabled: false },
      grid: {
        borderColor: gridColor,
        strokeDashArray: 4,
      },
      xaxis: {
        categories: rows.map((item) => item.name),
        labels: {
          style: { colors: foreColor, fontWeight: 600 },
          rotate: -18,
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: { style: { colors: foreColor } },
      },
      legend: { show: false },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.35,
          opacityFrom: 1,
          opacityTo: 0.75,
          stops: [0, 100],
        },
      },
      tooltip: {
        theme: isDark ? "dark" : "light",
        y: { formatter: (value) => `${value} employees` },
      },
    }),
    [foreColor, gridColor, isDark, rows],
  );

  return (
    <ChartShell
      title="Workforce by department"
      subtitle="Headcount across production, quality, stores and support"
      empty={empty}
      tone="emerald"
      icon={UsersRound}
      badge={empty ? undefined : `${total} people`}
    >
      {mounted ? (
        <ReactApexChart
          options={options}
          series={[{ name: "Employees", data: rows.map((item) => item.value) }]}
          type="bar"
          height={260}
        />
      ) : null}
    </ChartShell>
  );
}

function roundHorizontalBarEnds(chartEl: HTMLElement, radius = 8) {
  const paths = chartEl.querySelectorAll<SVGPathElement>(
    ".apexcharts-bar-series path",
  );

  paths.forEach((path) => {
    let box: DOMRect;
    try {
      box = path.getBBox();
    } catch {
      return;
    }

    if (box.width < 0.5 || box.height < 0.5) return;

    const r = Math.min(radius, box.height / 2, box.width / 2);
    if (r <= 0) return;

    const x = box.x;
    const y = box.y;
    const w = box.width;
    const h = box.height;

    path.setAttribute(
      "d",
      `M${x} ${y} H${x + w - r} A${r} ${r} 0 0 1 ${x + w} ${y + r} V${y + h - r} A${r} ${r} 0 0 1 ${x + w - r} ${y + h} H${x} Z`,
    );
  });
}

export function LineStaffingChart({
  items,
}: {
  items: { name: string; assigned: number; planned: number }[];
}) {
  const { mounted, isDark, foreColor, gridColor } = useChartTheme();
  const empty = items.length === 0;
  const assigned = items.reduce((sum, item) => sum + item.assigned, 0);
  const planned = items.reduce((sum, item) => sum + item.planned, 0);

  const applyRoundedEnds = (chart: { el?: HTMLElement }) => {
    if (!chart.el) return;
    requestAnimationFrame(() => roundHorizontalBarEnds(chart.el, 6));
  };

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        stacked: false,
        toolbar: { show: false },
        fontFamily: "inherit",
        background: "transparent",
        animations: { enabled: false },
        events: {
          mounted: applyRoundedEnds,
          updated: applyRoundedEnds,
        },
      },
      colors: ["#F59E0B", "#8B5CF6"],
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 0,
          barHeight: "42%",
        },
      },
      dataLabels: { enabled: false },
      grid: {
        borderColor: gridColor,
        strokeDashArray: 4,
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: false } },
      },
      xaxis: {
        categories: items.map((item) => item.name),
        labels: {
          style: { colors: foreColor, fontWeight: 600 },
        },
      },
      yaxis: {
        labels: {
          style: { colors: foreColor, fontWeight: 600 },
          maxWidth: 110,
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        fontWeight: 700,
        markers: { width: 10, height: 10, radius: 12, offsetX: -2 },
        labels: { colors: foreColor },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.28,
          opacityFrom: 1,
          opacityTo: 0.82,
          stops: [0, 100],
        },
      },
      tooltip: {
        theme: isDark ? "dark" : "light",
        shared: true,
        intersect: false,
        y: { formatter: (value) => `${value} people` },
      },
    }),
    [foreColor, gridColor, isDark, items],
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
      {mounted ? (
        <ReactApexChart
          options={options}
          series={[
            { name: "Assigned", data: items.map((item) => item.assigned) },
            { name: "Planned", data: items.map((item) => item.planned) },
          ]}
          type="bar"
          height={260}
        />
      ) : null}
    </ChartShell>
  );
}
