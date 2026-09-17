"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarConfig,
  CalendarHoliday,
  Company,
  CompanyGroup,
  Employee,
  OrderBook,
  ProductionLine,
  Section,
  calendarStore,
  companyStore,
  employeeStore,
  groupStore,
  orderBookStore,
  productionLineStore,
  sectionStore,
} from "@/utils/localStore";

export type DashboardAlert = {
  id: string;
  tone: "warning" | "danger" | "info";
  title: string;
  detail: string;
  href: string;
};

export type NamedCount = {
  name: string;
  value: number;
};

export type FactoryRow = {
  id: string;
  name: string;
  code: string;
  location: string;
  employees: number;
  activeEmployees: number;
  lines: number;
  orders: number;
  orderQty: number;
};

export type DashboardAnalytics = {
  groups: CompanyGroup[];
  companies: Company[];
  sections: Section[];
  employees: Employee[];
  lines: ProductionLine[];
  orders: OrderBook[];
  calendar: CalendarConfig | null;
  counts: {
    groups: number;
    companies: number;
    sections: number;
    employees: number;
    activeEmployees: number;
    inactiveEmployees: number;
    lines: number;
    orders: number;
    orderQty: number;
    holidaysThisMonth: number;
  };
  pipeline: NamedCount[];
  statusCounts: NamedCount[];
  departmentCounts: NamedCount[];
  roleCounts: NamedCount[];
  monthlyVolume: { labels: string[]; data: number[] };
  lineStaffing: { name: string; assigned: number; planned: number }[];
  buyerVolume: NamedCount[];
  garmentMix: NamedCount[];
  factoryRows: FactoryRow[];
  recentOrders: OrderBook[];
  upcomingDeliveries: OrderBook[];
  overdueOrders: OrderBook[];
  upcomingHolidays: CalendarHoliday[];
  alerts: DashboardAlert[];
  health: {
    score: number;
    orderHealth: number;
    staffHealth: number;
    lineHealth: number;
  };
  unassignedEmployees: number;
};

const IN_PROGRESS_STATUSES = new Set([
  "In Cutting",
  "In Sewing",
  "In Finishing",
]);
const CLOSED_STATUSES = new Set(["Shipped", "Cancelled"]);
const PIPELINE_ORDER = [
  "Confirmed",
  "In Cutting",
  "In Sewing",
  "In Finishing",
  "Packed",
  "Shipped",
];

function todayISO() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function addDays(iso: string, days: number) {
  const date = new Date(`${iso}T00:00:00`);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function countBy<T>(items: T[], keyFn: (item: T) => string): NamedCount[] {
  const map = new Map<string, number>();
  items.forEach((item) => {
    const key = keyFn(item).trim() || "Unspecified";
    map.set(key, (map.get(key) || 0) + 1);
  });
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function sumBy<T>(items: T[], keyFn: (item: T) => string, valueFn: (item: T) => number): NamedCount[] {
  const map = new Map<string, number>();
  items.forEach((item) => {
    const key = keyFn(item).trim() || "Unspecified";
    map.set(key, (map.get(key) || 0) + valueFn(item));
  });
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function orderQty(order: OrderBook) {
  return Number(order.orderQty) || 0;
}

function readSnapshot() {
  const year = new Date().getFullYear();
  return {
    groups: groupStore.getAll(),
    companies: companyStore.getAll(),
    sections: sectionStore.getAll(),
    employees: employeeStore.getAll(),
    lines: productionLineStore.getAll(),
    orders: orderBookStore.getAll(),
    calendar: calendarStore.getOrCreate(year),
  };
}

function buildAnalytics(snapshot: ReturnType<typeof readSnapshot>): DashboardAnalytics {
  const {
    groups,
    companies,
    sections,
    employees,
    lines,
    orders,
    calendar,
  } = snapshot;

  const today = todayISO();
  const horizon = addDays(today, 14);
  const monthPrefix = today.slice(0, 7);

  const activeEmployees = employees.filter((employee) => employee.status === "Active").length;
  const inactiveEmployees = employees.length - activeEmployees;
  const totalQty = orders.reduce((sum, order) => sum + orderQty(order), 0);

  const assignedEmployeeIds = new Set(
    lines.flatMap((line) => line.employeeIds || []),
  );
  const assignedExisting = employees.filter((employee) =>
    assignedEmployeeIds.has(employee.id),
  ).length;
  const unassignedEmployees = Math.max(employees.length - assignedExisting, 0);

  const statusCounts = PIPELINE_ORDER.map((name) => ({
    name,
    value: orders.filter((order) => order.status === name).length,
  })).concat(
    countBy(
      orders.filter((order) => !PIPELINE_ORDER.includes(order.status || "")),
      (order) => order.status || "Unspecified",
    ),
  ).filter((item, index, list) => list.findIndex((row) => row.name === item.name) === index);

  const pipeline = PIPELINE_ORDER.map((name) => ({
    name,
    value: orders.filter((order) => order.status === name).length,
  }));

  const now = new Date();
  const monthlyLabels: string[] = [];
  const monthlyData: number[] = [];
  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    monthlyLabels.push(
      date.toLocaleString("en-US", { month: "short" }),
    );
    monthlyData.push(
      orders
        .filter((order) => (order.orderDate || order.createdAt || "").slice(0, 7) === key)
        .reduce((sum, order) => sum + orderQty(order), 0),
    );
  }

  const lineStaffing = lines
    .map((line) => ({
      name: line.name || line.code || "Untitled line",
      assigned: (line.employeeIds || []).length,
      planned: Number(line.employeeCount) || (line.employeeIds || []).length,
    }))
    .sort((a, b) => b.assigned - a.assigned)
    .slice(0, 8);

  const factoryRows: FactoryRow[] = companies.map((company) => {
    const companyEmployees = employees.filter((employee) => employee.companyId === company.id);
    const companyOrders = orders.filter((order) => order.companyId === company.id);
    return {
      id: company.id,
      name: company.name || "Untitled factory",
      code: company.code || "",
      location: company.location || "",
      employees: companyEmployees.length,
      activeEmployees: companyEmployees.filter((employee) => employee.status === "Active").length,
      lines: lines.filter((line) => line.companyId === company.id).length,
      orders: companyOrders.length,
      orderQty: companyOrders.reduce((sum, order) => sum + orderQty(order), 0),
    };
  });

  const overdueOrders = orders.filter((order) => {
    if (!order.deliveryDate || CLOSED_STATUSES.has(order.status || "")) return false;
    return order.deliveryDate < today;
  });

  const upcomingDeliveries = orders
    .filter((order) => {
      if (!order.deliveryDate || CLOSED_STATUSES.has(order.status || "")) return false;
      return order.deliveryDate >= today && order.deliveryDate <= horizon;
    })
    .sort((a, b) => (a.deliveryDate || "").localeCompare(b.deliveryDate || ""))
    .slice(0, 6);

  const recentOrders = [...orders]
    .sort((a, b) => (b.createdAt || b.orderDate || "").localeCompare(a.createdAt || a.orderDate || ""))
    .slice(0, 8);

  const upcomingHolidays = (calendar?.holidays || [])
    .filter((holiday) => holiday.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  const holidaysThisMonth = (calendar?.holidays || []).filter((holiday) =>
    holiday.date.startsWith(monthPrefix),
  ).length;

  const understaffed = lines.filter((line) => {
    const planned = Number(line.employeeCount) || 0;
    if (planned <= 0) return false;
    return (line.employeeIds || []).length < planned;
  });

  const onHold = orders.filter((order) => order.status === "On Hold");
  const inProgress = orders.filter((order) => IN_PROGRESS_STATUSES.has(order.status || ""));
  const healthyOrders = orders.filter(
    (order) => order.status !== "On Hold" && order.status !== "Cancelled",
  );

  const staffedLines = lines.filter((line) => {
    const planned = Number(line.employeeCount) || (line.employeeIds || []).length;
    if (planned <= 0) return (line.employeeIds || []).length > 0;
    return (line.employeeIds || []).length >= planned;
  });

  const orderHealth = orders.length ? healthyOrders.length / orders.length : 1;
  const staffHealth = employees.length ? activeEmployees / employees.length : 1;
  const lineHealth = lines.length ? staffedLines.length / lines.length : 1;
  const score = Math.round(((orderHealth + staffHealth + lineHealth) / 3) * 100);

  const alerts: DashboardAlert[] = [];
  if (overdueOrders.length) {
    alerts.push({
      id: "overdue",
      tone: "danger",
      title: `${overdueOrders.length} overdue order${overdueOrders.length === 1 ? "" : "s"}`,
      detail: "Ex-factory date has passed and the style is still open.",
      href: "/order-book/view",
    });
  }
  if (onHold.length) {
    alerts.push({
      id: "hold",
      tone: "warning",
      title: `${onHold.length} order${onHold.length === 1 ? "" : "s"} on hold`,
      detail: "Held styles need merchandising or production follow-up.",
      href: "/order-book/view",
    });
  }
  if (understaffed.length) {
    alerts.push({
      id: "staffing",
      tone: "warning",
      title: `${understaffed.length} understaffed line${understaffed.length === 1 ? "" : "s"}`,
      detail: "Assigned operators are below the planned headcount.",
      href: "/production-line/view",
    });
  }
  if (inactiveEmployees > 0) {
    alerts.push({
      id: "inactive",
      tone: "info",
      title: `${inactiveEmployees} inactive employee${inactiveEmployees === 1 ? "" : "s"}`,
      detail: "Review inactive records in employee management.",
      href: "/employees/view",
    });
  }
  if (inProgress.length) {
    alerts.push({
      id: "progress",
      tone: "info",
      title: `${inProgress.length} style${inProgress.length === 1 ? "" : "s"} in production`,
      detail: "Currently in cutting, sewing, or finishing.",
      href: "/order-book/view",
    });
  }

  return {
    groups,
    companies,
    sections,
    employees,
    lines,
    orders,
    calendar,
    counts: {
      groups: groups.length,
      companies: companies.length,
      sections: sections.length,
      employees: employees.length,
      activeEmployees,
      inactiveEmployees,
      lines: lines.length,
      orders: orders.length,
      orderQty: totalQty,
      holidaysThisMonth,
    },
    pipeline,
    statusCounts: statusCounts.filter((item) => item.value > 0),
    departmentCounts: countBy(employees, (employee) => employee.department || "Unspecified"),
    roleCounts: countBy(employees, (employee) => employee.role || "Unspecified").slice(0, 6),
    monthlyVolume: { labels: monthlyLabels, data: monthlyData },
    lineStaffing,
    buyerVolume: sumBy(orders, (order) => order.buyer || "Unspecified", orderQty).slice(0, 6),
    garmentMix: countBy(orders, (order) => order.garmentType || "Unspecified").slice(0, 6),
    factoryRows,
    recentOrders,
    upcomingDeliveries,
    overdueOrders,
    upcomingHolidays,
    alerts: alerts.slice(0, 5),
    health: {
      score,
      orderHealth: Math.round(orderHealth * 100),
      staffHealth: Math.round(staffHealth * 100),
      lineHealth: Math.round(lineHealth * 100),
    },
    unassignedEmployees,
  };
}

export function useDashboardData() {
  const [snapshot, setSnapshot] = useState<ReturnType<typeof readSnapshot> | null>(null);
  const [updatedAt, setUpdatedAt] = useState("");

  const refresh = useCallback(() => {
    const next = readSnapshot();
    setSnapshot((prev) => {
      if (prev && JSON.stringify(prev) === JSON.stringify(next)) {
        return prev;
      }
      return next;
    });
    setUpdatedAt(
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    );
  }, []);

  useEffect(() => {
    refresh();
    const interval = window.setInterval(refresh, 2500);
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

  const analytics = useMemo(
    () => (snapshot ? buildAnalytics(snapshot) : null),
    [snapshot],
  );

  return { analytics, updatedAt, refresh };
}

export function companyName(
  companies: Company[],
  companyId: string,
) {
  return companies.find((company) => company.id === companyId)?.name || "Unavailable";
}

export function formatQty(value: number) {
  return value.toLocaleString();
}

export function formatDate(value?: string) {
  if (!value) return "Unavailable";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
