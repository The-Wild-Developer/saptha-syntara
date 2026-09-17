"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import "@/app/auth/login/login.css";

const TONE: Record<
  string,
  {
    card: string;
    border: string;
    blob: string;
    blobAlt: string;
    icon: string;
    number: string;
    hint: string;
    watermark: string;
    accent: string;
    spark: string;
    shape: string;
  }
> = {
  sky: {
    card: "bg-[linear-gradient(145deg,#f0f9ff_0%,#ffffff_42%,#dbeafe_100%)] dark:bg-[linear-gradient(145deg,#0c1a2e_0%,#24303f_48%,#0c4a6e_100%)]",
    border: "border-sky-200/80 dark:border-sky-800/50",
    blob: "from-sky-300/70 to-blue-400/40 dark:from-sky-500/35 dark:to-blue-400/20",
    blobAlt:
      "from-cyan-200/50 to-sky-300/30 dark:from-cyan-400/20 dark:to-sky-300/10",
    icon: "bg-gradient-to-br from-sky-400 to-blue-600 text-white",
    number:
      "bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-600 dark:from-sky-200 dark:via-blue-200 dark:to-cyan-200",
    hint: "bg-sky-500/12 text-sky-700 ring-sky-500/15 dark:bg-sky-400/15 dark:text-sky-200 dark:ring-sky-400/20",
    watermark: "fill-sky-400/25 text-sky-500/55 dark:fill-sky-300/20 dark:text-sky-200/50",
    accent: "from-sky-400 via-blue-500 to-indigo-500",
    spark: "bg-sky-400",
    shape: "stroke-sky-400/40 dark:stroke-sky-300/30",
  },
  emerald: {
    card: "bg-[linear-gradient(145deg,#ecfdf5_0%,#ffffff_42%,#d1fae5_100%)] dark:bg-[linear-gradient(145deg,#052e1c_0%,#24303f_48%,#064e3b_100%)]",
    border: "border-emerald-200/80 dark:border-emerald-800/50",
    blob: "from-emerald-300/70 to-teal-400/40 dark:from-emerald-500/35 dark:to-teal-400/20",
    blobAlt:
      "from-lime-200/50 to-emerald-300/30 dark:from-lime-400/20 dark:to-emerald-300/10",
    icon: "bg-gradient-to-br from-emerald-400 to-teal-600 text-white",
    number:
      "bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700 dark:from-emerald-200 dark:via-teal-200 dark:to-green-200",
    hint: "bg-emerald-500/12 text-emerald-700 ring-emerald-500/15 dark:bg-emerald-400/15 dark:text-emerald-200 dark:ring-emerald-400/20",
    watermark: "fill-emerald-400/25 text-emerald-500/55 dark:fill-emerald-300/20 dark:text-emerald-200/50",
    accent: "from-emerald-400 via-teal-500 to-green-500",
    spark: "bg-emerald-400",
    shape: "stroke-emerald-400/40 dark:stroke-emerald-300/30",
  },
  amber: {
    card: "bg-[linear-gradient(145deg,#fffbeb_0%,#ffffff_42%,#fef3c7_100%)] dark:bg-[linear-gradient(145deg,#3b2508_0%,#24303f_48%,#78350f_100%)]",
    border: "border-amber-200/80 dark:border-amber-800/50",
    blob: "from-amber-300/70 to-orange-400/40 dark:from-amber-500/35 dark:to-orange-400/20",
    blobAlt:
      "from-yellow-200/50 to-amber-300/30 dark:from-yellow-400/20 dark:to-amber-300/10",
    icon: "bg-gradient-to-br from-amber-400 to-orange-600 text-white",
    number:
      "bg-gradient-to-br from-amber-600 via-orange-600 to-yellow-700 dark:from-amber-200 dark:via-orange-200 dark:to-yellow-200",
    hint: "bg-amber-500/12 text-amber-800 ring-amber-500/15 dark:bg-amber-400/15 dark:text-amber-200 dark:ring-amber-400/20",
    watermark: "fill-amber-400/30 text-amber-500/55 dark:fill-amber-300/20 dark:text-amber-200/50",
    accent: "from-amber-400 via-orange-500 to-yellow-500",
    spark: "bg-amber-400",
    shape: "stroke-amber-400/40 dark:stroke-amber-300/30",
  },
  rose: {
    card: "bg-[linear-gradient(145deg,#fff1f2_0%,#ffffff_42%,#ffe4e6_100%)] dark:bg-[linear-gradient(145deg,#3f0d16_0%,#24303f_48%,#881337_100%)]",
    border: "border-rose-200/80 dark:border-rose-800/50",
    blob: "from-rose-300/70 to-pink-400/40 dark:from-rose-500/35 dark:to-pink-400/20",
    blobAlt:
      "from-pink-200/50 to-rose-300/30 dark:from-pink-400/20 dark:to-rose-300/10",
    icon: "bg-gradient-to-br from-rose-400 to-pink-600 text-white",
    number:
      "bg-gradient-to-br from-rose-600 via-pink-600 to-fuchsia-600 dark:from-rose-200 dark:via-pink-200 dark:to-fuchsia-200",
    hint: "bg-rose-500/12 text-rose-700 ring-rose-500/15 dark:bg-rose-400/15 dark:text-rose-200 dark:ring-rose-400/20",
    watermark: "fill-rose-400/25 text-rose-500/55 dark:fill-rose-300/20 dark:text-rose-200/50",
    accent: "from-rose-400 via-pink-500 to-fuchsia-500",
    spark: "bg-rose-400",
    shape: "stroke-rose-400/40 dark:stroke-rose-300/30",
  },
  violet: {
    card: "bg-[linear-gradient(145deg,#f5f3ff_0%,#ffffff_42%,#ede9fe_100%)] dark:bg-[linear-gradient(145deg,#2e1065_0%,#24303f_48%,#4c1d95_100%)]",
    border: "border-violet-200/80 dark:border-violet-800/50",
    blob: "from-violet-300/70 to-fuchsia-400/40 dark:from-violet-500/35 dark:to-fuchsia-400/20",
    blobAlt:
      "from-indigo-200/50 to-violet-300/30 dark:from-indigo-400/20 dark:to-violet-300/10",
    icon: "bg-gradient-to-br from-violet-400 to-fuchsia-600 text-white",
    number:
      "bg-gradient-to-br from-violet-600 via-fuchsia-600 to-indigo-600 dark:from-violet-200 dark:via-fuchsia-200 dark:to-indigo-200",
    hint: "bg-violet-500/12 text-violet-700 ring-violet-500/15 dark:bg-violet-400/15 dark:text-violet-200 dark:ring-violet-400/20",
    watermark: "fill-violet-400/25 text-violet-500/55 dark:fill-violet-300/20 dark:text-violet-200/50",
    accent: "from-violet-400 via-fuchsia-500 to-indigo-500",
    spark: "bg-violet-400",
    shape: "stroke-violet-400/40 dark:stroke-violet-300/30",
  },
  cyan: {
    card: "bg-[linear-gradient(145deg,#ecfeff_0%,#ffffff_42%,#cffafe_100%)] dark:bg-[linear-gradient(145deg,#083344_0%,#24303f_48%,#155e75_100%)]",
    border: "border-cyan-200/80 dark:border-cyan-800/50",
    blob: "from-cyan-300/70 to-sky-400/40 dark:from-cyan-500/35 dark:to-sky-400/20",
    blobAlt:
      "from-teal-200/50 to-cyan-300/30 dark:from-teal-400/20 dark:to-cyan-300/10",
    icon: "bg-gradient-to-br from-cyan-400 to-sky-600 text-white",
    number:
      "bg-gradient-to-br from-cyan-600 via-sky-600 to-teal-600 dark:from-cyan-200 dark:via-sky-200 dark:to-teal-200",
    hint: "bg-cyan-500/12 text-cyan-700 ring-cyan-500/15 dark:bg-cyan-400/15 dark:text-cyan-200 dark:ring-cyan-400/20",
    watermark: "fill-cyan-400/25 text-cyan-500/55 dark:fill-cyan-300/20 dark:text-cyan-200/50",
    accent: "from-cyan-400 via-sky-500 to-teal-500",
    spark: "bg-cyan-400",
    shape: "stroke-cyan-400/40 dark:stroke-cyan-300/30",
  },
};

function useCountUp(target: number, duration = 700) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

type StatCardProps = {
  label: string;
  value: number;
  hint?: string;
  href: string;
  icon: LucideIcon;
  tone?: keyof typeof TONE;
  index?: number;
  formatter?: (value: number) => string;
};

function CardShape({
  index,
  className,
}: {
  index: number;
  className: string;
}) {
  if (index % 3 === 0) {
    return (
      <svg width="28" height="28" viewBox="0 0 40 40" className="login-animate-rotate-slow">
        <circle
          cx="20"
          cy="20"
          r="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={className}
        />
      </svg>
    );
  }

  if (index % 3 === 1) {
    return (
      <svg width="22" height="22" viewBox="0 0 30 30" className="login-animate-wiggle">
        <rect
          x="5"
          y="5"
          width="20"
          height="20"
          rx="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={className}
          transform="rotate(45 15 15)"
        />
      </svg>
    );
  }

  return (
    <svg width="24" height="24" viewBox="0 0 35 35">
      <polygon
        points="17.5,2 33,30 2,30"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={className}
      />
    </svg>
  );
}

export default function StatCard({
  label,
  value,
  hint,
  href,
  icon: Icon,
  tone = "sky",
  index = 0,
  formatter = (next) => next.toLocaleString(),
}: StatCardProps) {
  const style = TONE[tone];
  const display = useCountUp(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
    >
      <Link
        href={href}
        className={`relative flex min-h-[108px] flex-col overflow-hidden rounded-2xl border p-3 shadow-sm ${style.card} ${style.border} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
      >
        <span
          aria-hidden
          className={`login-animate-blob login-animate-float pointer-events-none absolute -right-8 -top-10 h-20 w-20 bg-gradient-to-br opacity-70 ${style.blob}`}
          style={{ animationDelay: `${index * 0.4}s` }}
        />
        <span
          aria-hidden
          className={`login-animate-morph login-animate-float-reverse pointer-events-none absolute -bottom-10 -left-8 h-16 w-16 bg-gradient-to-br opacity-50 ${style.blobAlt}`}
          style={{ animationDelay: `${index * 0.3 + 1}s` }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent dark:via-white/30"
        />
        <Icon
          aria-hidden
          strokeWidth={1.15}
          className={`pointer-events-none absolute -bottom-1.5 -right-1.5 h-16 w-16 rotate-[-12deg] ${style.watermark}`}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-8 left-2 hidden opacity-80 sm:block"
          style={{ animationDelay: `${index * 0.2}s` }}
        >
          <CardShape index={index} className={style.shape} />
        </span>

        <div className="relative z-10 flex items-start">
          <span
            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ring-2 ring-white/70 dark:ring-white/10 ${style.icon}`}
          >
            <Icon className="h-4 w-4" />
          </span>
        </div>

        <div className="relative z-10 mt-auto pt-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-bodydark2 dark:text-white/55">
            {label}
          </p>
          <p
            className={`mt-0.5 bg-clip-text text-[32px] font-extrabold leading-none tracking-tight text-transparent ${style.number}`}
          >
            {formatter(display)}
          </p>
          {hint ? (
            <div className="mt-1.5 flex min-h-[18px] items-center justify-between gap-2">
              <span
                className={`inline-flex max-w-[85%] items-center gap-1 truncate rounded-full px-1.5 py-0.5 text-[10px] font-semibold ring-1 ${style.hint}`}
              >
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.spark}`}
                />
                {hint}
              </span>
            </div>
          ) : null}
        </div>
      </Link>
    </motion.div>
  );
}
