"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowRight,
  BellRing,
  Boxes,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Factory,
  Info,
  Layers,
  Network,
  Package,
  PauseCircle,
  Scissors,
  Shirt,
  Sparkles,
  Truck,
  Workflow,
  ShieldCheck,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
import type { IUserProfile } from "@/types";
import {
  companyName,
  formatDate,
  formatQty,
  useDashboardData,
} from "@/hooks/useDashboardData";
import StatCard from "@/components/Dashboard/StatCard";
import FactoryPerformance from "@/components/Dashboard/FactoryPerformance";
import {
  DepartmentChart,
  LineStaffingChart,
  OrderStatusChart,
  VolumeTrendChart,
} from "@/components/Dashboard/DashboardCharts";
import "@/app/auth/login/login.css";

type DashboardProps = {
  userProfile: IUserProfile;
};

function getTimeGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return { greeting: "Morning", icon: "/saptha-syntara/images/morning.svg" };
  }
  if (hour < 15) {
    return {
      greeting: "Afternoon",
      icon: "/saptha-syntara/images/afternoon.svg",
    };
  }
  if (hour < 19) {
    return { greeting: "Evening", icon: "/saptha-syntara/images/evening-1.svg" };
  }
  return { greeting: "Night", icon: "/saptha-syntara/images/evening-2.svg" };
}

const PIPELINE_LOOK = {
  card: "bg-[linear-gradient(160deg,#f0f9ff_0%,#ffffff_45%,#e0f2fe_100%)] dark:bg-[linear-gradient(160deg,#0c1a2e_0%,#24303f_50%,#0c4a6e_100%)]",
  border: "border-primary/30 dark:border-primary/25",
  icon: "bg-sky-100 text-sky-900 shadow-none dark:bg-sky-900 dark:text-sky-100",
  number: "text-primary dark:text-sky-200",
  mark: "text-primary/20 dark:text-sky-300/15",
};

const PIPELINE_ICONS: Record<string, LucideIcon> = {
  Confirmed: CheckCircle2,
  "In Cutting": Scissors,
  "In Sewing": Shirt,
  "In Finishing": Sparkles,
  Packed: Package,
  Shipped: Truck,
};

function statusClass(status: string) {
  if (status === "Shipped" || status === "Packed") {
    return "bg-emerald-500/12 text-emerald-700 ring-1 ring-emerald-500/15 dark:bg-emerald-400/15 dark:text-emerald-200 dark:ring-emerald-400/20";
  }
  if (status === "Cancelled" || status === "On Hold") {
    return "bg-rose-500/12 text-rose-700 ring-1 ring-rose-500/15 dark:bg-rose-400/15 dark:text-rose-200 dark:ring-rose-400/20";
  }
  if (status === "Confirmed") {
    return "bg-sky-500/12 text-sky-700 ring-1 ring-sky-500/15 dark:bg-sky-400/15 dark:text-sky-200 dark:ring-sky-400/20";
  }
  return "bg-amber-500/12 text-amber-800 ring-1 ring-amber-500/15 dark:bg-amber-400/15 dark:text-amber-200 dark:ring-amber-400/20";
}

const ORDER_AVATARS = [
  "from-cyan-400 to-sky-600",
  "from-sky-400 to-blue-600",
  "from-teal-400 to-cyan-600",
  "from-indigo-400 to-sky-600",
  "from-blue-400 to-cyan-600",
  "from-sky-500 to-teal-600",
];

const BUYER_BARS = [
  "from-amber-400 to-orange-500",
  "from-orange-400 to-rose-400",
  "from-yellow-400 to-amber-500",
  "from-amber-500 to-orange-600",
  "from-orange-300 to-amber-500",
  "from-yellow-500 to-orange-500",
];

const ATTENTION_SHELL = {
  danger: {
    card: "bg-[linear-gradient(145deg,#fff1f2_0%,#ffffff_42%,#ffe4e6_100%)] dark:bg-[linear-gradient(145deg,#3f0d16_0%,#24303f_48%,#881337_100%)]",
    border: "border-rose-200/80 dark:border-rose-800/50",
    blob: "from-rose-300/70 to-pink-400/40 dark:from-rose-500/35 dark:to-pink-400/20",
    blobAlt:
      "from-orange-200/50 to-rose-300/30 dark:from-orange-400/20 dark:to-rose-300/10",
    icon: "bg-gradient-to-br from-rose-400 to-pink-600 text-white",
    badge:
      "bg-rose-500/12 text-rose-700 ring-rose-500/15 dark:bg-rose-400/15 dark:text-rose-200 dark:ring-rose-400/20",
    watermark: "fill-rose-400/25 text-rose-500/55 dark:fill-rose-300/20 dark:text-rose-200/50",
    spark: "bg-rose-500",
    pulse: "border-rose-400",
    subtitle: "Urgent items need a production follow-up",
  },
  warning: {
    card: "bg-[linear-gradient(145deg,#fffbeb_0%,#ffffff_42%,#fef3c7_100%)] dark:bg-[linear-gradient(145deg,#3b2508_0%,#24303f_48%,#78350f_100%)]",
    border: "border-amber-200/80 dark:border-amber-800/50",
    blob: "from-amber-300/70 to-orange-400/40 dark:from-amber-500/35 dark:to-orange-400/20",
    blobAlt:
      "from-yellow-200/50 to-amber-300/30 dark:from-yellow-400/20 dark:to-amber-300/10",
    icon: "bg-gradient-to-br from-amber-400 to-orange-600 text-white",
    badge:
      "bg-amber-500/12 text-amber-800 ring-amber-500/15 dark:bg-amber-400/15 dark:text-amber-200 dark:ring-amber-400/20",
    watermark: "fill-amber-400/30 text-amber-500/55 dark:fill-amber-300/20 dark:text-amber-200/50",
    spark: "bg-amber-500",
    pulse: "border-amber-400",
    subtitle: "A few items need a closer look today",
  },
  info: {
    card: "bg-[linear-gradient(145deg,#f0f9ff_0%,#ffffff_42%,#dbeafe_100%)] dark:bg-[linear-gradient(145deg,#0c1a2e_0%,#24303f_48%,#0c4a6e_100%)]",
    border: "border-sky-200/80 dark:border-sky-800/50",
    blob: "from-sky-300/70 to-blue-400/40 dark:from-sky-500/35 dark:to-blue-400/20",
    blobAlt:
      "from-cyan-200/50 to-sky-300/30 dark:from-cyan-400/20 dark:to-sky-300/10",
    icon: "bg-gradient-to-br from-sky-400 to-blue-600 text-white",
    badge:
      "bg-sky-500/12 text-sky-700 ring-sky-500/15 dark:bg-sky-400/15 dark:text-sky-200 dark:ring-sky-400/20",
    watermark: "fill-sky-400/25 text-sky-500/55 dark:fill-sky-300/20 dark:text-sky-200/50",
    spark: "bg-sky-500",
    pulse: "border-sky-400",
    subtitle: "Live notes from orders, lines and people",
  },
  ok: {
    card: "bg-[linear-gradient(145deg,#ecfdf5_0%,#ffffff_42%,#d1fae5_100%)] dark:bg-[linear-gradient(145deg,#052e1c_0%,#24303f_48%,#064e3b_100%)]",
    border: "border-emerald-200/80 dark:border-emerald-800/50",
    blob: "from-emerald-300/70 to-teal-400/40 dark:from-emerald-500/35 dark:to-teal-400/20",
    blobAlt:
      "from-lime-200/50 to-emerald-300/30 dark:from-lime-400/20 dark:to-emerald-300/10",
    icon: "bg-gradient-to-br from-emerald-400 to-teal-600 text-white",
    badge:
      "bg-emerald-500/12 text-emerald-700 ring-emerald-500/15 dark:bg-emerald-400/15 dark:text-emerald-200 dark:ring-emerald-400/20",
    watermark: "fill-emerald-400/25 text-emerald-500/55 dark:fill-emerald-300/20 dark:text-emerald-200/50",
    spark: "bg-emerald-500",
    pulse: "border-emerald-400",
    subtitle: "Order book and staffing look healthy",
  },
} as const;

function attentionLevel(
  alerts: { tone: "warning" | "danger" | "info" }[],
): keyof typeof ATTENTION_SHELL {
  if (alerts.some((alert) => alert.tone === "danger")) return "danger";
  if (alerts.some((alert) => alert.tone === "warning")) return "warning";
  if (alerts.length) return "info";
  return "ok";
}

function alertLook(tone: "warning" | "danger" | "info") {
  if (tone === "danger") {
    return {
      row: "border-rose-200/70 bg-white/80 text-rose-950 hover:border-rose-300 hover:bg-white hover:shadow-md dark:border-rose-800/40 dark:bg-rose-950/35 dark:text-rose-100 dark:hover:border-rose-700 dark:hover:bg-rose-950/55",
      icon: "bg-gradient-to-br from-rose-400 to-pink-600 text-white shadow-sm shadow-rose-500/25",
      bar: "bg-gradient-to-b from-rose-500 to-pink-500",
      Icon: AlertTriangle,
    };
  }
  if (tone === "warning") {
    return {
      row: "border-amber-200/70 bg-white/80 text-amber-950 hover:border-amber-300 hover:bg-white hover:shadow-md dark:border-amber-800/40 dark:bg-amber-950/35 dark:text-amber-100 dark:hover:border-amber-700 dark:hover:bg-amber-950/55",
      icon: "bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-sm shadow-amber-500/25",
      bar: "bg-gradient-to-b from-amber-400 to-orange-500",
      Icon: PauseCircle,
    };
  }
  return {
    row: "border-sky-200/70 bg-white/80 text-sky-950 hover:border-sky-300 hover:bg-white hover:shadow-md dark:border-sky-800/40 dark:bg-sky-950/35 dark:text-sky-100 dark:hover:border-sky-700 dark:hover:bg-sky-950/55",
    icon: "bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-sm shadow-sky-500/25",
    bar: "bg-gradient-to-b from-sky-400 to-blue-500",
    Icon: Info,
  };
}

const HOLIDAY_TYPE_LOOK: Record<
  string,
  { chip: string; bar: string; ink: string }
> = {
  Public: {
    chip: "bg-rose-100 text-rose-800 ring-rose-200/80 dark:bg-rose-400/15 dark:text-rose-100 dark:ring-rose-400/20",
    bar: "bg-rose-500",
    ink: "text-rose-600 dark:text-rose-300",
  },
  Mercantile: {
    chip: "bg-amber-100 text-amber-800 ring-amber-200/80 dark:bg-amber-400/15 dark:text-amber-100 dark:ring-amber-400/20",
    bar: "bg-amber-500",
    ink: "text-amber-600 dark:text-amber-300",
  },
  Bank: {
    chip: "bg-sky-100 text-sky-800 ring-sky-200/80 dark:bg-sky-400/15 dark:text-sky-100 dark:ring-sky-400/20",
    bar: "bg-sky-500",
    ink: "text-sky-600 dark:text-sky-300",
  },
  Religious: {
    chip: "bg-violet-100 text-violet-800 ring-violet-200/80 dark:bg-violet-400/15 dark:text-violet-100 dark:ring-violet-400/20",
    bar: "bg-violet-500",
    ink: "text-violet-600 dark:text-violet-300",
  },
  Company: {
    chip: "bg-emerald-100 text-emerald-800 ring-emerald-200/80 dark:bg-emerald-400/15 dark:text-emerald-100 dark:ring-emerald-400/20",
    bar: "bg-emerald-500",
    ink: "text-emerald-600 dark:text-emerald-300",
  },
  Optional: {
    chip: "bg-cyan-100 text-cyan-800 ring-cyan-200/80 dark:bg-cyan-400/15 dark:text-cyan-100 dark:ring-cyan-400/20",
    bar: "bg-cyan-500",
    ink: "text-cyan-600 dark:text-cyan-300",
  },
  Special: {
    chip: "bg-orange-100 text-orange-800 ring-orange-200/80 dark:bg-orange-400/15 dark:text-orange-100 dark:ring-orange-400/20",
    bar: "bg-orange-500",
    ink: "text-orange-600 dark:text-orange-300",
  },
};

function holidayParts(date: string) {
  const value = new Date(`${date}T00:00:00`);
  return {
    day: value.getDate(),
    month: value.toLocaleDateString("en-GB", { month: "short" }),
    weekday: value.toLocaleDateString("en-GB", { weekday: "short" }),
  };
}

function holidayCountdown(date: string) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const target = new Date(`${date}T00:00:00`);
  const days = Math.round((target.getTime() - start.getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}

const QUICK_TONE = {
  cyan: "bg-gradient-to-r from-cyan-400 to-sky-600 hover:from-cyan-300 hover:to-sky-500",
  rose: "bg-gradient-to-r from-rose-400 to-pink-600 hover:from-rose-300 hover:to-pink-500",
  violet:
    "bg-gradient-to-r from-violet-400 to-fuchsia-600 hover:from-violet-300 hover:to-fuchsia-500",
  sky: "bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500",
  amber:
    "bg-gradient-to-r from-amber-400 to-orange-600 hover:from-amber-300 hover:to-orange-500",
  emerald:
    "bg-gradient-to-r from-emerald-400 to-teal-600 hover:from-emerald-300 hover:to-teal-500",
} as const;

const QUICK_ACTIONS = [
  {
    href: "/order-book/add",
    label: "Add order",
    hint: "Book a new style",
    icon: ClipboardList,
    tone: "cyan",
  },
  {
    href: "/employees/add",
    label: "Add employee",
    hint: "Register staff",
    icon: UserPlus,
    tone: "rose",
  },
  {
    href: "/production-line/create",
    label: "Create line",
    hint: "Set up sewing line",
    icon: Factory,
    tone: "violet",
  },
  {
    href: "/hierarchy",
    label: "Hierarchy",
    hint: "Org structure",
    icon: Network,
    tone: "sky",
  },
  {
    href: "/calendar",
    label: "Calendar",
    hint: "Holidays & weekends",
    icon: CalendarDays,
    tone: "amber",
  },
  {
    href: "/manage/view-company",
    label: "Factories",
    hint: "Company directory",
    icon: Building2,
    tone: "emerald",
  },
] as const;

export default function Dashboard({ userProfile }: DashboardProps) {
  const { analytics } = useDashboardData();
  const { greeting, icon } = getTimeGreeting();

  if (!analytics) {
    return (
      <div className="rounded-3xl border border-stroke bg-white p-8 shadow-default dark:border-strokedark dark:bg-boxdark">
        <p className="text-sm text-bodydark2">Loading operations overview...</p>
      </div>
    );
  }

  const pipelineTotal = analytics.pipeline.reduce(
    (sum, item) => sum + item.value,
    0,
  );
  const attentionTone = attentionLevel(analytics.alerts);
  const attention = ATTENTION_SHELL[attentionTone];
  const todayLabel = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-5">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-stroke shadow-default bg-[linear-gradient(135deg,#eff6ff_0%,#dbeafe_25%,#e0f2fe_50%,#f0f9ff_75%,#e0e7ff_100%)] dark:border-strokedark dark:bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_25%,#0c4a6e_50%,#1e293b_75%,#312e81_100%)]"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="login-animate-blob login-animate-float absolute -left-16 -top-16 h-48 w-48 bg-gradient-to-br from-blue-200 to-sky-200 opacity-50 dark:from-blue-500/40 dark:to-sky-400/30"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="login-animate-blob login-animate-float-reverse absolute -right-12 top-0 h-40 w-40 bg-gradient-to-br from-sky-200 to-cyan-200 opacity-40 dark:from-cyan-400/30 dark:to-sky-300/20"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="login-animate-blob absolute -bottom-16 left-1/4 h-44 w-44 bg-gradient-to-br from-indigo-200 to-blue-200 opacity-40 dark:from-indigo-500/30 dark:to-blue-400/20"
            style={{ animationDelay: "4s" }}
          />
          <div
            className="login-animate-morph login-animate-float absolute right-1/3 top-6 h-32 w-32 bg-gradient-to-br from-sky-200 to-cyan-200 opacity-40 dark:from-sky-400/25 dark:to-cyan-300/20"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="login-animate-blob login-animate-float-reverse absolute bottom-2 right-8 h-36 w-36 bg-gradient-to-br from-blue-100 to-sky-100 opacity-30 dark:from-blue-400/25 dark:to-sky-300/15"
            style={{ animationDelay: "3s" }}
          />
          <div
            className="absolute left-[10%] top-[18%] hidden login-animate-float sm:block"
            style={{ animationDelay: "0.5s" }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 40 40"
              className="login-animate-rotate-slow"
            >
              <circle
                cx="20"
                cy="20"
                r="15"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="2"
                opacity="0.3"
              />
            </svg>
          </div>
          <div
            className="absolute right-[18%] top-[22%] hidden login-animate-float-reverse sm:block"
            style={{ animationDelay: "1.2s" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 30 30"
              className="login-animate-wiggle"
            >
              <rect
                x="5"
                y="5"
                width="20"
                height="20"
                rx="4"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="2"
                opacity="0.3"
                transform="rotate(45 15 15)"
              />
            </svg>
          </div>
          <div
            className="absolute bottom-[22%] left-[8%] hidden login-animate-float sm:block"
            style={{ animationDelay: "2s" }}
          >
            <svg width="28" height="28" viewBox="0 0 35 35">
              <polygon
                points="17.5,2 33,30 2,30"
                fill="none"
                stroke="var(--color-hover)"
                strokeWidth="2"
                opacity="0.3"
              />
            </svg>
          </div>
          <div
            className="absolute bottom-[18%] right-[10%] hidden login-animate-float-reverse sm:block"
            style={{ animationDelay: "0.8s" }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 25 25"
              className="login-animate-rotate-slow"
              style={{ animationDuration: "15s" }}
            >
              <path
                d="M12.5 2 L15.5 9.5 L23 12.5 L15.5 15.5 L12.5 23 L9.5 15.5 L2 12.5 L9.5 9.5 Z"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="1.5"
                opacity="0.4"
              />
            </svg>
          </div>
        </div>

        <div className="relative z-10 p-3 sm:p-5 md:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-bodydark2 dark:text-sky-200/80 sm:text-xs sm:tracking-[0.18em]">
                Operations overview
              </p>
              <div className="mt-1 flex flex-wrap items-end gap-x-2 text-xl font-semibold sm:text-2xl md:text-3xl">
                <motion.span
                  className="bg-clip-text font-bold text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, var(--color-primary), var(--color-hover), var(--color-primary))",
                    backgroundSize: "200% auto",
                  }}
                  animate={{ backgroundPosition: ["-100% 0", "100% 0"] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                >
                  Hello,
                </motion.span>
                <span className="capitalize text-gray-500 dark:text-sky-100/80">
                  {userProfile.firstName}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-sm sm:mt-2 sm:gap-2 sm:text-[22px]">
                <motion.span
                  className="bg-clip-text font-bold text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, var(--color-primary), var(--color-hover), var(--color-primary))",
                    backgroundSize: "200% auto",
                  }}
                  animate={{ backgroundPosition: ["-100% 0", "100% 0"] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                >
                  Good
                </motion.span>
                <span className="font-semibold text-black dark:text-white">
                  {greeting}
                </span>
                <img
                  src={icon}
                  alt={greeting}
                  className="h-5 w-5 object-contain sm:h-8 sm:w-8"
                />
              </div>
              <p className="mt-2 hidden max-w-xl text-sm text-bodydark2 dark:text-sky-100/70 sm:block">
                Live analysis across groups, factories, sections, people, lines,
                order book and the holiday calendar.
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:mt-3 sm:gap-2">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary dark:bg-white/15 dark:text-sky-100 sm:px-3 sm:py-1 sm:text-xs">
                  {userProfile.userRole?.description ||
                    userProfile.userRole?.code ||
                    "User"}
                </span>
                <span className="rounded-full bg-white/70 px-2.5 py-0.5 text-[10px] font-medium text-bodydark2 dark:bg-white/10 dark:text-sky-100/80 sm:px-3 sm:py-1 sm:text-xs">
                  {todayLabel}
                </span>
              </div>
            </div>

            <HeroArt />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-1.5 sm:mt-4 sm:grid-cols-4 sm:gap-2">
            <HealthRing score={analytics.health.score} />
            <MiniMetric
              label="Active staff"
              value={`${analytics.counts.activeEmployees}/${analytics.counts.employees}`}
              hint={`${analytics.health.staffHealth}% active`}
              icon={Users}
            />
            <MiniMetric
              label="Open order qty"
              value={`${formatQty(analytics.counts.orderQty)} pcs`}
              hint={`${analytics.counts.orders} styles booked`}
              icon={ClipboardList}
            />
            <MiniMetric
              label="Unassigned staff"
              value={String(analytics.unassignedEmployees)}
              hint="Not yet on a production line"
              icon={UserMinus}
            />
          </div>
        </div>
      </motion.section>

      <section className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Groups"
          value={analytics.counts.groups}
          href="/manage/view-group"
          icon={Layers}
          tone="sky"
          index={0}
        />
        <StatCard
          label="Factories"
          value={analytics.counts.companies}
          href="/manage/view-company"
          icon={Building2}
          tone="emerald"
          index={1}
        />
        <StatCard
          label="Sections"
          value={analytics.counts.sections}
          href="/manage/view-section"
          icon={Boxes}
          tone="amber"
          index={2}
        />
        <StatCard
          label="Employees"
          value={analytics.counts.employees}
          href="/employees/view"
          icon={Users}
          tone="rose"
          index={3}
        />
        <StatCard
          label="Production lines"
          value={analytics.counts.lines}
          href="/production-line/view"
          icon={Factory}
          tone="violet"
          index={4}
        />
        <StatCard
          label="Orders"
          value={analytics.counts.orders}
          href="/order-book/view"
          icon={ClipboardList}
          tone="cyan"
          index={5}
        />
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-sky-200/70 bg-[linear-gradient(145deg,#f8fbff_0%,#ffffff_42%,#eef6ff_100%)] p-4 shadow-sm dark:border-sky-800/40 dark:bg-[linear-gradient(145deg,#0c1a2e_0%,#24303f_48%,#0c4a6e_100%)] md:p-5">
        <span
          aria-hidden
          className="login-animate-blob login-animate-float pointer-events-none absolute -right-12 -top-14 h-36 w-36 bg-gradient-to-br from-sky-300/50 to-blue-400/30 dark:from-sky-500/25 dark:to-blue-400/15"
        />
        <span
          aria-hidden
          className="login-animate-morph login-animate-float-reverse pointer-events-none absolute -bottom-16 -left-10 h-32 w-32 bg-gradient-to-br from-cyan-200/40 to-indigo-300/25 dark:from-cyan-400/15 dark:to-indigo-400/10"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent dark:via-white/25"
        />

        <div className="relative z-10 mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-900 ring-2 ring-white/70 dark:bg-sky-900 dark:text-sky-100 dark:ring-white/10">
              <Workflow className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-black dark:text-white">
                Production pipeline
              </h3>
              <p className="text-xs text-bodydark2 dark:text-sky-100/60">
                Confirmed styles moving through cutting, sewing, finishing and
                shipment
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-sky-700 ring-1 ring-sky-200/80 dark:bg-white/10 dark:text-sky-200 dark:ring-sky-500/20">
              {pipelineTotal} styles
            </span>
            <Link
              href="/order-book/view"
              className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
            >
              View orders <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {pipelineTotal === 0 ? (
          <div className="relative z-10">
            <EmptyHint href="/order-book/add" label="Book the first order" />
          </div>
        ) : (
          <div className="relative z-10 grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 xl:grid-cols-6">
            {analytics.pipeline.map((step, index) => {
                const StepIcon = PIPELINE_ICONS[step.name] || ClipboardList;
                const stepNo = String(index + 1).padStart(2, "0");
                return (
                  <motion.div
                    key={step.name}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    className={`relative overflow-hidden rounded-2xl border p-3 shadow-sm ${PIPELINE_LOOK.card} ${PIPELINE_LOOK.border}`}
                  >
                    <span
                      aria-hidden
                      className={`pointer-events-none absolute -bottom-3 right-1 text-[52px] font-black leading-none ${PIPELINE_LOOK.mark}`}
                    >
                      {stepNo}
                    </span>
                    <div className="relative z-10 flex items-center gap-2">
                      <span
                        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-md ${PIPELINE_LOOK.icon}`}
                      >
                        <StepIcon className="h-4 w-4" />
                      </span>
                      <p className="min-w-0 truncate text-[11px] font-semibold uppercase tracking-wide text-black/70 dark:text-white/70">
                        {step.name}
                      </p>
                    </div>
                    <p
                      className={`relative z-10 mt-3 text-[32px] font-extrabold leading-none tracking-tight ${PIPELINE_LOOK.number}`}
                    >
                      {step.value}
                    </p>
                  </motion.div>
                );
              })}
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        <VolumeTrendChart
          labels={analytics.monthlyVolume.labels}
          data={analytics.monthlyVolume.data}
        />
        <OrderStatusChart items={analytics.statusCounts} />
        <DepartmentChart items={analytics.departmentCounts} />
        <LineStaffingChart items={analytics.lineStaffing} />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <FactoryPerformance
            rows={analytics.factoryRows}
            garmentMix={analytics.garmentMix}
          />
        </div>

        <div className="space-y-4">
          <div
            className={`relative overflow-hidden rounded-2xl border p-4 shadow-sm ${attention.card} ${attention.border}`}
          >
            <span
              aria-hidden
              className={`login-animate-blob login-animate-float pointer-events-none absolute -right-10 -top-12 h-28 w-28 bg-gradient-to-br opacity-70 ${attention.blob}`}
            />
            <span
              aria-hidden
              className={`login-animate-morph login-animate-float-reverse pointer-events-none absolute -bottom-12 -left-10 h-24 w-24 bg-gradient-to-br opacity-50 ${attention.blobAlt}`}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent dark:via-white/30"
            />
            {attentionTone === "ok" ? (
              <ShieldCheck
                aria-hidden
                strokeWidth={1.15}
                className={`pointer-events-none absolute -bottom-3 -right-2 h-24 w-24 rotate-[-12deg] ${attention.watermark}`}
              />
            ) : (
              <BellRing
                aria-hidden
                strokeWidth={1.15}
                className={`pointer-events-none absolute -bottom-3 -right-2 h-24 w-24 rotate-[-12deg] ${attention.watermark}`}
              />
            )}

            <div className="relative z-10 mb-4 flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center">
                  {attentionTone !== "ok" ? (
                    <span
                      aria-hidden
                      className={`login-animate-pulse-ring absolute inset-0 rounded-xl border-2 ${attention.pulse}`}
                    />
                  ) : null}
                  <span
                    className={`relative inline-flex h-10 w-10 items-center justify-center rounded-xl ring-2 ring-white/70 dark:ring-white/10 ${attention.icon}`}
                  >
                    {attentionTone === "ok" ? (
                      <ShieldCheck className="h-5 w-5" />
                    ) : (
                      <BellRing className="h-5 w-5" />
                    )}
                  </span>
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-black dark:text-white">
                    Attention
                  </h3>
                  <p className="mt-0.5 text-xs text-bodydark2 dark:text-white/60">
                    {attention.subtitle}
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${attention.badge}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${attention.spark}`}
                />
                {analytics.alerts.length === 0
                  ? "All clear"
                  : `${analytics.alerts.length} item${analytics.alerts.length === 1 ? "" : "s"}`}
              </span>
            </div>

            {analytics.alerts.length === 0 ? (
              <div className="relative z-10 overflow-hidden rounded-2xl border border-emerald-200/70 bg-white/75 px-4 py-6 text-center dark:border-emerald-800/40 dark:bg-white/5">
                <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-md shadow-emerald-500/25">
                  <CheckCircle2 className="h-6 w-6" />
                </span>
                <p className="mt-3 text-sm font-semibold text-emerald-800 dark:text-emerald-100">
                  Operations look healthy
                </p>
                <p className="mt-1 text-xs text-bodydark2 dark:text-white/55">
                  No overdue orders, holds, or staffing gaps right now.
                </p>
              </div>
            ) : (
              <div className="relative z-10 space-y-2">
                {analytics.alerts.map((alert, index) => {
                  const look = alertLook(alert.tone);
                  const AlertIcon = look.Icon;
                  return (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.06 }}
                    >
                      <Link
                        href={alert.href}
                        className={`group relative flex items-start gap-3 overflow-hidden rounded-2xl border p-3 text-sm transition ${look.row}`}
                      >
                        <span
                          aria-hidden
                          className={`absolute inset-y-2 left-0 w-1 rounded-full ${look.bar}`}
                        />
                        <span
                          className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${look.icon}`}
                        >
                          <AlertIcon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1 pr-5">
                          <span className="block font-semibold leading-snug">
                            {alert.title}
                          </span>
                          <span className="mt-0.5 block text-xs opacity-75">
                            {alert.detail}
                          </span>
                        </span>
                        <ArrowRight className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-40 transition group-hover:translate-x-0.5 group-hover:opacity-80" />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-violet-200/80 bg-[linear-gradient(145deg,#f5f3ff_0%,#ffffff_42%,#ede9fe_100%)] p-4 shadow-sm dark:border-violet-800/50 dark:bg-[linear-gradient(145deg,#2e1065_0%,#24303f_48%,#4c1d95_100%)]">
            <span
              aria-hidden
              className="login-animate-blob login-animate-float pointer-events-none absolute -right-10 -top-12 h-28 w-28 bg-gradient-to-br from-violet-300/70 to-fuchsia-400/40 opacity-70 dark:from-violet-500/35 dark:to-fuchsia-400/20"
            />
            <span
              aria-hidden
              className="login-animate-morph login-animate-float-reverse pointer-events-none absolute -bottom-12 -left-10 h-24 w-24 bg-gradient-to-br from-indigo-200/50 to-violet-300/30 opacity-50 dark:from-indigo-400/20 dark:to-violet-300/10"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent dark:via-white/30"
            />
            <CalendarDays
              aria-hidden
              strokeWidth={1.15}
              className="pointer-events-none absolute -bottom-3 -right-2 h-24 w-24 rotate-[-12deg] fill-violet-400/25 text-violet-500/55 dark:fill-violet-300/20 dark:text-violet-200/50"
            />

            <div className="relative z-10 mb-4 flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-fuchsia-600 text-white ring-2 ring-white/70 dark:ring-white/10">
                  <CalendarDays className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-black dark:text-white">
                    Upcoming holidays
                  </h3>
                  <p className="mt-0.5 text-xs text-bodydark2 dark:text-white/60">
                    Next dates that affect factory planning
                  </p>
                </div>
              </div>
              <Link
                href="/calendar"
                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-violet-700 ring-1 ring-violet-200/80 transition hover:bg-white dark:bg-white/10 dark:text-violet-200 dark:ring-violet-500/20 dark:hover:bg-white/15"
              >
                Calendar <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {analytics.upcomingHolidays.length === 0 ? (
              <div className="relative z-10 overflow-hidden rounded-2xl border border-violet-200/70 bg-white/75 px-4 py-6 text-center dark:border-violet-800/40 dark:bg-white/5">
                <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-fuchsia-600 text-white shadow-md shadow-violet-500/25">
                  <CalendarDays className="h-6 w-6" />
                </span>
                <p className="mt-3 text-sm font-semibold text-violet-800 dark:text-violet-100">
                  No holidays ahead
                </p>
                <p className="mt-1 text-xs text-bodydark2 dark:text-white/55">
                  Add dates on the calendar so planning stays in sync.
                </p>
              </div>
            ) : (
              <ul className="relative z-10 space-y-2">
                {analytics.upcomingHolidays.map((holiday, index) => {
                  const look =
                    HOLIDAY_TYPE_LOOK[holiday.type] || HOLIDAY_TYPE_LOOK.Special;
                  const parts = holidayParts(holiday.date);
                  return (
                    <motion.li
                      key={holiday.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.06 }}
                      className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-violet-200/60 bg-white/80 p-2.5 dark:border-violet-800/40 dark:bg-white/5"
                    >
                      <span
                        aria-hidden
                        className={`absolute inset-y-2 left-0 w-1 rounded-full ${look.bar}`}
                      />
                      <div className="ml-1 flex h-12 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-violet-200/80 dark:bg-violet-950/50 dark:ring-violet-500/20">
                        <span className={`text-[10px] font-semibold uppercase tracking-wide ${look.ink}`}>
                          {parts.month}
                        </span>
                        <span className="text-lg font-extrabold leading-none text-black dark:text-white">
                          {parts.day}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-black dark:text-white">
                          {holiday.name}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          <span
                            className={`inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-semibold ring-1 ${look.chip}`}
                          >
                            {holiday.type}
                          </span>
                          <span className="text-[10px] font-medium text-bodydark2 dark:text-white/50">
                            {parts.weekday}
                          </span>
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full bg-violet-500/10 px-2 py-1 text-[10px] font-semibold text-violet-700 dark:bg-violet-400/15 dark:text-violet-200">
                        {holidayCountdown(holiday.date)}
                      </span>
                    </motion.li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border border-cyan-200/80 bg-[linear-gradient(145deg,#ecfeff_0%,#ffffff_42%,#cffafe_100%)] p-4 shadow-sm dark:border-cyan-800/50 dark:bg-[linear-gradient(145deg,#083344_0%,#24303f_48%,#155e75_100%)] md:p-5 xl:col-span-2">
          <span
            aria-hidden
            className="login-animate-blob login-animate-float pointer-events-none absolute -right-12 -top-14 h-36 w-36 bg-gradient-to-br from-cyan-300/70 to-sky-400/40 opacity-70 dark:from-cyan-500/35 dark:to-sky-400/20"
          />
          <span
            aria-hidden
            className="login-animate-morph login-animate-float-reverse pointer-events-none absolute -bottom-16 -left-10 h-32 w-32 bg-gradient-to-br from-teal-200/50 to-cyan-300/30 opacity-50 dark:from-teal-400/20 dark:to-cyan-300/10"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent dark:via-white/30"
          />
          <ClipboardList
            aria-hidden
            strokeWidth={1.15}
            className="pointer-events-none absolute -bottom-3 -right-2 h-28 w-28 rotate-[-12deg] fill-cyan-400/25 text-cyan-500/55 dark:fill-cyan-300/20 dark:text-cyan-200/50"
          />

          <div className="relative z-10 mb-4 flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-sky-600 text-white ring-2 ring-white/70 dark:ring-white/10">
                <ClipboardList className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-black dark:text-white">
                  Recent orders
                </h3>
                <p className="text-xs text-bodydark2 dark:text-white/60">
                  Latest styles from the order book
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/12 px-2.5 py-1 text-[11px] font-semibold text-cyan-700 ring-1 ring-cyan-500/15 dark:bg-cyan-400/15 dark:text-cyan-200 dark:ring-cyan-400/20">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                {analytics.recentOrders.length}{" "}
                {analytics.recentOrders.length === 1 ? "style" : "styles"}
              </span>
              <Link
                href="/order-book/view"
                className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {analytics.recentOrders.length === 0 ? (
            <div className="relative z-10 overflow-hidden rounded-2xl border border-cyan-200/70 bg-white/75 px-4 py-8 text-center dark:border-cyan-800/40 dark:bg-white/5">
              <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-600 text-white shadow-md shadow-cyan-500/25">
                <ClipboardList className="h-6 w-6" />
              </span>
              <p className="mt-3 text-sm font-semibold text-cyan-800 dark:text-cyan-100">
                No recent orders
              </p>
              <p className="mt-1 text-xs text-bodydark2 dark:text-white/55">
                Book a style to start filling the order book.
              </p>
              <Link
                href="/order-book/add"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                Add an order <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="relative z-10 overflow-hidden rounded-xl border border-white/80 bg-white/70 shadow-inner backdrop-blur-sm dark:border-white/10 dark:bg-black/25">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-cyan-100 bg-cyan-50/70 text-[11px] uppercase tracking-wide text-cyan-800/70 dark:border-white/10 dark:bg-white/5 dark:text-cyan-100/60">
                      <th className="px-4 py-3 font-semibold">PO / Style</th>
                      <th className="px-3 py-3 font-semibold">Buyer</th>
                      <th className="px-3 py-3 font-semibold">Factory</th>
                      <th className="px-3 py-3 font-semibold">Qty</th>
                      <th className="px-3 py-3 font-semibold">Ex-factory</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.recentOrders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.28, delay: index * 0.04 }}
                        className="border-b border-cyan-100/80 transition-colors last:border-0 hover:bg-cyan-50/80 dark:border-white/5 dark:hover:bg-white/[0.04]"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-[11px] font-bold text-white shadow-sm ring-2 ring-white/80 dark:ring-white/10 ${ORDER_AVATARS[index % ORDER_AVATARS.length]}`}>
                              {(order.orderNo || "OR").slice(0, 2).toUpperCase()}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-black dark:text-white">
                                {order.orderNo || "Unavailable"}
                              </p>
                              <p className="truncate text-xs text-bodydark2 dark:text-cyan-100/55">
                                {order.styleNo || order.styleName || "—"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-bodydark2 dark:text-cyan-100/70">
                          {order.buyer || "—"}
                        </td>
                        <td className="px-3 py-3 text-bodydark2 dark:text-cyan-100/70">
                          {companyName(analytics.companies, order.companyId)}
                        </td>
                        <td className="px-3 py-3 font-semibold text-black dark:text-white">
                          {order.orderQty
                            ? formatQty(Number(order.orderQty))
                            : "—"}
                        </td>
                        <td className="px-3 py-3 text-bodydark2 dark:text-cyan-100/70">
                          {formatDate(order.deliveryDate)}
                        </td>
                        <td className="px-4 py-3">
                          {order.status ? (
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass(order.status)}`}
                            >
                              {order.status}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-amber-200/80 bg-[linear-gradient(145deg,#fffbeb_0%,#ffffff_42%,#fef3c7_100%)] p-4 shadow-sm dark:border-amber-800/50 dark:bg-[linear-gradient(145deg,#3b2508_0%,#24303f_48%,#78350f_100%)]">
          <span
            aria-hidden
            className="login-animate-blob login-animate-float pointer-events-none absolute -right-10 -top-12 h-28 w-28 bg-gradient-to-br from-amber-300/70 to-orange-400/40 opacity-70 dark:from-amber-500/35 dark:to-orange-400/20"
          />
          <span
            aria-hidden
            className="login-animate-morph login-animate-float-reverse pointer-events-none absolute -bottom-12 -left-10 h-24 w-24 bg-gradient-to-br from-yellow-200/50 to-amber-300/30 opacity-50 dark:from-yellow-400/20 dark:to-amber-300/10"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent dark:via-white/30"
          />
          <Truck
            aria-hidden
            strokeWidth={1.15}
            className="pointer-events-none absolute -bottom-3 -right-2 h-24 w-24 rotate-[-12deg] fill-amber-400/30 text-amber-500/55 dark:fill-amber-300/20 dark:text-amber-200/50"
          />

          <div className="relative z-10 mb-4 flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-white ring-2 ring-white/70 dark:ring-white/10">
                <Truck className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-black dark:text-white">
                  Upcoming deliveries
                </h3>
                <p className="mt-0.5 text-xs text-bodydark2 dark:text-white/60">
                  Ex-factory dates in the next 14 days
                </p>
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-500/12 px-2.5 py-1 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-500/15 dark:bg-amber-400/15 dark:text-amber-200 dark:ring-amber-400/20">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              {analytics.upcomingDeliveries.length}
            </span>
          </div>

          {analytics.upcomingDeliveries.length === 0 ? (
            <div className="relative z-10 overflow-hidden rounded-2xl border border-amber-200/70 bg-white/75 px-4 py-6 text-center dark:border-amber-800/40 dark:bg-white/5">
              <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-md shadow-amber-500/25">
                <Truck className="h-6 w-6" />
              </span>
              <p className="mt-3 text-sm font-semibold text-amber-800 dark:text-amber-100">
                Quiet shipping window
              </p>
              <p className="mt-1 text-xs text-bodydark2 dark:text-white/55">
                No ex-factory dates in the next two weeks.
              </p>
            </div>
          ) : (
            <ul className="relative z-10 space-y-2">
              {analytics.upcomingDeliveries.map((order, index) => {
                const parts = holidayParts(order.deliveryDate);
                const when = holidayCountdown(order.deliveryDate);
                const urgent = when === "Today" || when === "Tomorrow";
                return (
                  <motion.li
                    key={order.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.06 }}
                    className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-amber-200/60 bg-white/80 p-2.5 dark:border-amber-800/40 dark:bg-white/5"
                  >
                    <span
                      aria-hidden
                      className={`absolute inset-y-2 left-0 w-1 rounded-full ${urgent ? "bg-rose-500" : "bg-amber-500"}`}
                    />
                    <div className="ml-1 flex h-12 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-amber-200/80 dark:bg-amber-950/50 dark:ring-amber-500/20">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-300">
                        {parts.month}
                      </span>
                      <span className="text-lg font-extrabold leading-none text-black dark:text-white">
                        {parts.day}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-black dark:text-white">
                        {order.styleName || order.styleNo || order.orderNo}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-bodydark2 dark:text-white/55">
                        {order.buyer || "Buyer unavailable"}
                        {order.orderQty
                          ? ` · ${formatQty(Number(order.orderQty))} pcs`
                          : ""}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${
                        urgent
                          ? "bg-rose-500/12 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200"
                          : "bg-amber-500/10 text-amber-800 dark:bg-amber-400/15 dark:text-amber-200"
                      }`}
                    >
                      {when}
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          )}

          <div className="relative z-10 mt-5 border-t border-amber-200/70 pt-4 dark:border-amber-800/40">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-black dark:text-white">
                Top buyers
              </h4>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-700/80 dark:text-amber-200/70">
                By quantity
              </span>
            </div>
            {analytics.buyerVolume.length === 0 ? (
              <p className="text-sm text-bodydark2 dark:text-white/55">
                No buyer volume yet.
              </p>
            ) : (
              <ul className="space-y-2.5">
                {analytics.buyerVolume.map((buyer, index) => {
                  const max = analytics.buyerVolume[0]?.value || 1;
                  return (
                    <li key={buyer.name}>
                      <div className="mb-1 flex justify-between gap-2 text-xs">
                        <span className="flex min-w-0 items-center gap-2 font-medium text-black dark:text-white">
                          <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-[10px] font-bold text-white">
                            {index + 1}
                          </span>
                          <span className="truncate">{buyer.name}</span>
                        </span>
                        <span className="shrink-0 font-semibold text-amber-800 dark:text-amber-200">
                          {formatQty(buyer.value)} pcs
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-amber-100 dark:bg-white/10">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${BUYER_BARS[index % BUYER_BARS.length]}`}
                          style={{ width: `${(buyer.value / max) * 100}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-indigo-200/80 bg-[linear-gradient(145deg,#eef2ff_0%,#ffffff_42%,#e0e7ff_100%)] p-4 shadow-sm dark:border-indigo-800/50 dark:bg-[linear-gradient(145deg,#1e1b4b_0%,#24303f_48%,#312e81_100%)] md:p-5">
        <span
          aria-hidden
          className="login-animate-blob login-animate-float pointer-events-none absolute -right-12 -top-14 h-36 w-36 bg-gradient-to-br from-indigo-300/70 to-sky-400/40 opacity-70 dark:from-indigo-500/35 dark:to-sky-400/20"
        />
        <span
          aria-hidden
          className="login-animate-morph login-animate-float-reverse pointer-events-none absolute -bottom-16 -left-10 h-32 w-32 bg-gradient-to-br from-violet-200/50 to-indigo-300/30 opacity-50 dark:from-violet-400/20 dark:to-indigo-300/10"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent dark:via-white/30"
        />
        <Sparkles
          aria-hidden
          strokeWidth={1.15}
          className="pointer-events-none absolute -bottom-3 -right-2 h-28 w-28 rotate-[-12deg] fill-indigo-400/25 text-indigo-500/55 dark:fill-indigo-300/20 dark:text-indigo-200/50"
        />

        <div className="relative z-10 mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-sky-600 text-white ring-2 ring-white/70 dark:ring-white/10">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-black dark:text-white">
                Quick actions
              </h3>
              <p className="text-xs text-bodydark2 dark:text-white/60">
                Jump into the modules used across the operation
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/12 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 ring-1 ring-indigo-500/15 dark:bg-indigo-400/15 dark:text-indigo-200 dark:ring-indigo-400/20">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            {QUICK_ACTIONS.length} shortcuts
          </span>
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-6">
          {QUICK_ACTIONS.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.href}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: index * 0.04 }}
              >
                <Link
                  href={action.href}
                  className={`group inline-flex w-full items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-white transition hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ${QUICK_TONE[action.tone]}`}
                >
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/20 ring-1 ring-white/30">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block truncate text-sm font-bold leading-tight">
                      {action.label}
                    </span>
                    <span className="block truncate text-[10px] font-medium text-white/80">
                      {action.hint}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 opacity-80 transition group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

const glassCard =
  "rounded-xl border border-white/60 bg-white/70 px-2 py-1.5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/10 sm:rounded-2xl sm:px-2.5 sm:py-2";

function MiniMetric({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
}) {
  return (
    <div className={`flex min-w-0 items-center gap-1.5 sm:gap-2 ${glassCard}`}>
      <Icon className="h-7 w-7 shrink-0 text-primary sm:h-8 sm:w-8" />
      <div className="min-w-0">
        <p className="truncate text-[9px] font-semibold uppercase tracking-wide text-bodydark2 dark:text-sky-200/70 sm:text-[10px]">
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm font-extrabold leading-tight text-black dark:text-white sm:text-base">
          {value}
        </p>
        <p className="truncate text-[10px] text-bodydark2 dark:text-sky-100/60 sm:text-[11px]">
          {hint}
        </p>
      </div>
    </div>
  );
}

function HealthRing({ score }: { score: number }) {
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`flex min-w-0 items-center gap-1.5 sm:gap-2 ${glassCard}`}>
      <svg
        className="h-7 w-7 shrink-0 -rotate-90 sm:h-8 sm:w-8"
        viewBox="0 0 40 40"
      >
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-stroke dark:text-white/20"
          strokeWidth="4"
        />
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-primary"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="min-w-0">
        <p className="truncate text-[9px] font-semibold uppercase tracking-wide text-bodydark2 dark:text-sky-200/70 sm:text-[10px]">
          Health score
        </p>
        <p className="text-sm font-extrabold leading-tight text-black dark:text-white sm:text-base">
          {score}%
        </p>
        <p className="truncate text-[10px] text-bodydark2 dark:text-sky-100/60 sm:text-[11px]">
          Orders · staff · lines
        </p>
      </div>
    </div>
  );
}

function HeroArt() {
  const [failed, setFailed] = useState(false);

  return (
    <div className="pointer-events-none flex w-full items-center justify-center sm:w-44 sm:shrink-0 sm:justify-end sm:self-start md:w-56 lg:w-72">
      {failed ? (
        <span className="inline-flex h-28 w-28 items-center justify-center rounded-full border border-white/70 bg-white/60 shadow-md backdrop-blur-md dark:border-white/15 dark:bg-white/10 sm:h-32 sm:w-32 lg:h-40 lg:w-40">
          <Factory className="h-12 w-12 text-primary sm:h-14 sm:w-14 lg:h-16 lg:w-16" />
        </span>
      ) : (
        <img
          src="/saptha-syntara/images/dashboard.png"
          alt="Dashboard"
          onError={() => setFailed(true)}
          className="h-36 w-auto max-w-full object-contain sm:h-40 sm:object-right md:h-44 lg:h-52"
        />
      )}
    </div>
  );
}

function EmptyHint({ href, label }: { href: string; label: string }) {
  return (
    <div className="flex min-h-28 flex-col items-center justify-center rounded-xl border border-dashed border-stroke bg-gray-2/50 text-center dark:border-strokedark dark:bg-meta-4/30">
      <p className="text-sm text-bodydark2">Nothing to analyse here yet.</p>
      <Link
        href={href}
        className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
      >
        {label} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
