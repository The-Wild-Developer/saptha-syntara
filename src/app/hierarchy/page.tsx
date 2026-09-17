"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Boxes,
  Building2,
  Factory,
  Layers,
  Network,
  RefreshCw,
  User,
} from "lucide-react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import withAuth from "@/utils/withAuth";
import {
  Company,
  CompanyGroup,
  Employee,
  ProductionLine,
  Section,
  companyStore,
  employeeStore,
  groupStore,
  productionLineStore,
  sectionStore,
} from "@/utils/localStore";

type HierarchyLevel =
  | "group"
  | "company"
  | "section"
  | "line"
  | "employee";

type HierarchyNode = {
  id: string;
  level: HierarchyLevel;
  title: string;
  subtitle?: string;
  meta?: string;
  children: HierarchyNode[];
};

type HierarchySnapshot = {
  groups: CompanyGroup[];
  companies: Company[];
  sections: Section[];
  lines: ProductionLine[];
  employees: Employee[];
};

const LEVEL_STYLE: Record<
  HierarchyLevel,
  {
    label: string;
    shortLabel: string;
    icon: typeof Layers;
    chip: string;
    node: string;
    accent: string;
    iconBox: string;
    surface: string;
    pattern: string;
  }
> = {
  group: {
    label: "Group",
    shortLabel: "Group",
    icon: Layers,
    chip: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200",
    node: "border-sky-300 bg-gradient-to-br from-sky-50 to-white dark:border-sky-700 dark:from-sky-950/50 dark:to-boxdark",
    accent: "bg-sky-500",
    iconBox: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
    surface:
      "border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/40",
    pattern: "text-sky-500 dark:text-sky-400",
  },
  company: {
    label: "Company",
    shortLabel: "Company",
    icon: Building2,
    chip: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
    node: "border-emerald-300 bg-gradient-to-br from-emerald-50 to-white dark:border-emerald-700 dark:from-emerald-950/50 dark:to-boxdark",
    accent: "bg-emerald-500",
    iconBox: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
    surface:
      "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40",
    pattern: "text-emerald-500 dark:text-emerald-400",
  },
  section: {
    label: "Section",
    shortLabel: "Section",
    icon: Boxes,
    chip: "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
    node: "border-amber-300 bg-gradient-to-br from-amber-50 to-white dark:border-amber-700 dark:from-amber-950/50 dark:to-boxdark",
    accent: "bg-amber-500",
    iconBox: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
    surface:
      "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40",
    pattern: "text-amber-500 dark:text-amber-400",
  },
  line: {
    label: "Production Line",
    shortLabel: "Line",
    icon: Factory,
    chip: "bg-violet-100 text-violet-900 dark:bg-violet-900/40 dark:text-violet-200",
    node: "border-violet-300 bg-gradient-to-br from-violet-50 to-white dark:border-violet-700 dark:from-violet-950/50 dark:to-boxdark",
    accent: "bg-violet-500",
    iconBox: "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-200",
    surface:
      "border-violet-200 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/40",
    pattern: "text-violet-500 dark:text-violet-400",
  },
  employee: {
    label: "Employee",
    shortLabel: "Staff",
    icon: User,
    chip: "bg-rose-100 text-rose-900 dark:bg-rose-900/40 dark:text-rose-200",
    node: "border-rose-300 bg-gradient-to-br from-rose-50 to-white dark:border-rose-700 dark:from-rose-950/50 dark:to-boxdark",
    accent: "bg-rose-500",
    iconBox: "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200",
    surface:
      "border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/40",
    pattern: "text-rose-500 dark:text-rose-400",
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

function employeeLabel(employee: Employee) {
  return `${employee.title ? `${employee.title}. ` : ""}${employee.firstName} ${employee.lastName}`.trim();
}

function readSnapshot(): HierarchySnapshot {
  return {
    groups: groupStore.getAll(),
    companies: companyStore.getAll(),
    sections: sectionStore.getAll(),
    lines: productionLineStore.getAll(),
    employees: employeeStore.getAll(),
  };
}

function buildHierarchy(data: HierarchySnapshot): HierarchyNode[] {
  const employeeMap = new Map(data.employees.map((employee) => [employee.id, employee]));

  const buildLineNode = (line: ProductionLine): HierarchyNode => {
    const lineEmployees = (line.employeeIds || [])
      .map((id) => employeeMap.get(id))
      .filter((employee): employee is Employee => Boolean(employee));

    return {
      id: `line-${line.id}`,
      level: "line",
      title: line.name || "Untitled Line",
      subtitle: line.code || undefined,
      meta: `${lineEmployees.length}${line.employeeCount ? `/${line.employeeCount}` : ""}`,
      children: lineEmployees.map((employee) => ({
        id: `employee-${line.id}-${employee.id}`,
        level: "employee" as const,
        title: employeeLabel(employee) || "Unavailable",
        subtitle: [employee.employeeNo, employee.role].filter(Boolean).join(" · ") || undefined,
        meta: employee.status || undefined,
        children: [],
      })),
    };
  };

  const buildCompanyNode = (company: Company): HierarchyNode => {
    const companySections = data.sections.filter(
      (section) => section.companyId === company.id,
    );
    const sectionNodes = companySections.map((section) => {
      const sectionLines = data.lines.filter(
        (line) => line.sectionId === section.id,
      );
      return {
        id: `section-${section.id}`,
        level: "section" as const,
        title: section.name || "Untitled Section",
        subtitle: section.code || undefined,
        meta: `${sectionLines.length} line${sectionLines.length === 1 ? "" : "s"}`,
        children: sectionLines.map(buildLineNode),
      };
    });

    const orphanLines = data.lines.filter(
      (line) =>
        line.companyId === company.id &&
        !companySections.some((section) => section.id === line.sectionId),
    );

    if (orphanLines.length > 0) {
      sectionNodes.push({
        id: `section-orphan-${company.id}`,
        level: "section",
        title: "Unassigned Section",
        subtitle: "No section linked",
        meta: `${orphanLines.length} line${orphanLines.length === 1 ? "" : "s"}`,
        children: orphanLines.map(buildLineNode),
      });
    }

    return {
      id: `company-${company.id}`,
      level: "company",
      title: company.name || "Untitled Company",
      subtitle: [company.code, company.location].filter(Boolean).join(" · ") || undefined,
      meta: undefined,
      children: sectionNodes,
    };
  };

  const groupNodes = data.groups.map((group) => {
    const groupCompanies = data.companies.filter(
      (company) => company.groupId === group.id,
    );
    return {
      id: `group-${group.id}`,
      level: "group" as const,
      title: group.name || "Untitled Group",
      subtitle: group.code || undefined,
      meta: `${groupCompanies.length}`,
      children: groupCompanies.map(buildCompanyNode),
    };
  });

  const ungroupedCompanies = data.companies.filter(
    (company) => !data.groups.some((group) => group.id === company.groupId),
  );

  if (ungroupedCompanies.length > 0) {
    groupNodes.push({
      id: "group-ungrouped",
      level: "group",
      title: "Ungrouped",
      subtitle: "No group linked",
      meta: `${ungroupedCompanies.length}`,
      children: ungroupedCompanies.map(buildCompanyNode),
    });
  }

  return groupNodes;
}

function HierarchyCard({ node, depth = 0 }: { node: HierarchyNode; depth?: number }) {
  const style = LEVEL_STYLE[node.level];
  const Icon = style.icon;
  const hasChildren = node.children.length > 0;
  const stackChildren = node.level === "line";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, delay: Math.min(depth * 0.04, 0.3) }}
      className="flex flex-col items-center"
    >
      <div
        className={`relative z-10 flex h-[96px] w-[220px] shrink-0 flex-col overflow-hidden rounded-2xl border-2 pl-4 pr-3 shadow-md ${style.node}`}
        title={[node.title, node.subtitle, node.meta].filter(Boolean).join(" · ")}
      >
        <div className={`absolute inset-y-0 left-0 w-1.5 ${style.accent}`} />
        <div className="relative flex h-full flex-col justify-between py-2.5">
          <div className="flex items-center justify-between gap-2">
            <span
              className={`inline-flex max-w-[70%] items-center gap-1 truncate rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${style.chip}`}
              title={style.label}
            >
              <Icon className="h-3 w-3 shrink-0" />
              <span className="truncate">{style.shortLabel}</span>
            </span>
            {node.meta ? (
              <span className="shrink-0 rounded-md bg-black/5 px-1.5 py-0.5 text-[10px] font-semibold text-bodydark2 dark:bg-white/10">
                {node.meta}
              </span>
            ) : (
              <span className="h-4 w-4 shrink-0" />
            )}
          </div>

          <p className="line-clamp-2 text-[13px] font-bold leading-snug text-black dark:text-white">
            {node.title}
          </p>

          <p className="truncate text-[11px] leading-none text-bodydark2">
            {node.subtitle || "—"}
          </p>
        </div>
      </div>

      {hasChildren ? (
        stackChildren ? (
          <div className="org-stack">
            {node.children.map((child) => (
              <div key={child.id} className="org-stack-child">
                <HierarchyCard node={child} depth={depth + 1} />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="org-stem" />
            <ul className="org-children">
              {node.children.map((child) => (
                <li key={child.id} className="org-child">
                  <HierarchyCard node={child} depth={depth + 1} />
                </li>
              ))}
            </ul>
          </>
        )
      ) : null}
    </motion.div>
  );
}

function HierarchyStatCard({
  label,
  level,
  value,
  index,
}: {
  label: string;
  level: HierarchyLevel;
  value: number;
  index: number;
}) {
  const style = LEVEL_STYLE[level];
  const Icon = style.icon;
  const display = useCountUp(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: index * 0.05, ease: "easeOut" }}
      className={`relative flex items-center gap-3 overflow-hidden rounded-2xl border p-3.5 ${style.surface}`}
    >
      <div className={`absolute inset-y-0 left-0 w-1 ${style.accent}`} />
      <Icon
        aria-hidden
        className={`pointer-events-none absolute -bottom-2 -right-1 h-16 w-16 opacity-[0.18] ${style.pattern}`}
      />
      <span
        className={`relative z-10 ml-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.iconBox}`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="relative z-10 min-w-0">
        <p className="text-2xl font-extrabold leading-none tracking-tight text-black dark:text-white">
          {display}
        </p>
        <p className="mt-1 truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-bodydark2">
          {label}
        </p>
      </div>
    </motion.div>
  );
}

function HierarchyManagement() {
  const [snapshot, setSnapshot] = useState<HierarchySnapshot>({
    groups: [],
    companies: [],
    sections: [],
    lines: [],
    employees: [],
  });
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const refresh = useCallback((animate = false) => {
    setSnapshot(readSnapshot());
    setUpdatedAt(
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    );

    if (!animate) return;

    setRefreshing(true);
    setAnimationKey((key) => key + 1);
    window.setTimeout(() => setRefreshing(false), 700);
  }, []);

  useEffect(() => {
    refresh();

    const interval = window.setInterval(() => refresh(), 1500);
    const onFocus = () => refresh();
    const onStorage = () => refresh();
    const onVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };

    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [refresh]);

  const tree = useMemo(() => buildHierarchy(snapshot), [snapshot]);

  const counts = {
    groups: snapshot.groups.length,
    companies: snapshot.companies.length,
    sections: snapshot.sections.length,
    lines: snapshot.lines.length,
    employees: snapshot.employees.length,
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Hierarchy Management" />

      <div className="mt-4 space-y-4">
        <div className="rounded-2xl border border-stroke bg-white p-4 shadow-sm dark:border-strokedark dark:bg-boxdark md:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Network className="h-5 w-5" />
                </span>
                <h2 className="text-lg font-bold text-black dark:text-white">
                  Organization Hierarchy
                </h2>
              </div>
              <p className="text-sm text-bodydark2">
                Live view from Group → Company → Section → Production Line →
                Employees.
              </p>
            </div>
            <motion.button
              type="button"
              onClick={() => refresh(true)}
              disabled={refreshing}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 rounded-full border border-stroke bg-gray-2 px-4 py-2 text-sm font-semibold text-black transition hover:border-primary hover:text-primary disabled:cursor-wait dark:border-strokedark dark:bg-meta-4 dark:text-white"
            >
              <motion.span
                animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
                transition={
                  refreshing
                    ? { duration: 0.7, ease: "linear", repeat: Infinity }
                    : { duration: 0.2 }
                }
                className="inline-flex"
              >
                <RefreshCw className="h-4 w-4" />
              </motion.span>
              {refreshing ? "Refreshing..." : "Refresh"}
              {updatedAt ? (
                <span className="text-xs font-normal text-bodydark2">
                  {updatedAt}
                </span>
              ) : null}
            </motion.button>
          </div>

          <motion.div
            key={`stats-${animationKey}`}
            initial={{ opacity: 0.35, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5"
          >
            {(
              [
                ["groups", "Groups", "group", counts.groups] as const,
                ["companies", "Companies", "company", counts.companies] as const,
                ["sections", "Sections", "section", counts.sections] as const,
                ["lines", "Lines", "line", counts.lines] as const,
                ["employees", "Employees", "employee", counts.employees] as const,
              ]
            ).map(([key, label, level, value], index) => (
              <HierarchyStatCard
                key={key}
                label={label}
                level={level}
                value={value}
                index={index}
              />
            ))}
          </motion.div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(Object.keys(LEVEL_STYLE) as HierarchyLevel[]).map((level) => {
              const style = LEVEL_STYLE[level];
              const Icon = style.icon;
              return (
                <span
                  key={level}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${style.chip}`}
                >
                  <Icon className="h-3 w-3" />
                  {style.label}
                </span>
              );
            })}
          </div>
        </div>

        <motion.div
          key={`chart-${animationKey}`}
          initial={{ opacity: 0.4, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full min-w-0 overflow-hidden rounded-2xl border border-stroke bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_45%),linear-gradient(180deg,#f8fafc_0%,#ffffff_40%)] shadow-sm dark:border-strokedark dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_40%),linear-gradient(180deg,#1a222c_0%,#24303f_50%)]"
        >
          <div className="overflow-x-auto p-6 md:p-8">
            {tree.length === 0 ? (
              <div className="flex min-h-80 flex-col items-center justify-center text-center">
                <Network className="mb-3 h-10 w-10 text-bodydark2" />
                <p className="text-base font-semibold text-black dark:text-white">
                  No hierarchy data yet
                </p>
                <p className="mt-1 max-w-md text-sm text-bodydark2">
                  Add groups, companies, sections, production lines, and assign
                  employees to see the live chart.
                </p>
              </div>
            ) : (
              <div className="flex min-w-max items-start justify-center gap-12 pb-4">
                {tree.map((node) => (
                  <HierarchyCard key={node.id} node={node} />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </DefaultLayout>
  );
}

export default withAuth(HierarchyManagement);
