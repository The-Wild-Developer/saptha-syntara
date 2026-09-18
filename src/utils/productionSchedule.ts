import {
  CalendarConfig,
  calendarStore,
  isSkippedDate,
  OrderBook,
  PlanningSkipSettings,
  ProductionLine,
  ProductionPlanAssignment,
} from "@/utils/localStore";

function padDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export type LinePalette = {
  key: string;
  bar: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
};

export const LINE_PALETTE: LinePalette[] = [
  {
    key: "sky-400",
    bar: "bg-sky-400",
    bg: "bg-sky-100 dark:bg-sky-900/40",
    text: "text-sky-800 dark:text-sky-200",
    border: "border-sky-400",
    dot: "bg-sky-400",
  },
  {
    key: "sky-500",
    bar: "bg-sky-500",
    bg: "bg-sky-100 dark:bg-sky-900/40",
    text: "text-sky-800 dark:text-sky-200",
    border: "border-sky-500",
    dot: "bg-sky-500",
  },
  {
    key: "sky-600",
    bar: "bg-sky-600",
    bg: "bg-sky-100 dark:bg-sky-900/40",
    text: "text-sky-800 dark:text-sky-200",
    border: "border-sky-600",
    dot: "bg-sky-600",
  },
  {
    key: "blue-400",
    bar: "bg-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/40",
    text: "text-blue-800 dark:text-blue-200",
    border: "border-blue-400",
    dot: "bg-blue-400",
  },
  {
    key: "blue-500",
    bar: "bg-blue-500",
    bg: "bg-blue-100 dark:bg-blue-900/40",
    text: "text-blue-800 dark:text-blue-200",
    border: "border-blue-500",
    dot: "bg-blue-500",
  },
  {
    key: "blue-600",
    bar: "bg-blue-600",
    bg: "bg-blue-100 dark:bg-blue-900/40",
    text: "text-blue-800 dark:text-blue-200",
    border: "border-blue-600",
    dot: "bg-blue-600",
  },
  {
    key: "blue-700",
    bar: "bg-blue-700",
    bg: "bg-blue-100 dark:bg-blue-900/40",
    text: "text-blue-800 dark:text-blue-200",
    border: "border-blue-700",
    dot: "bg-blue-700",
  },
  {
    key: "indigo-400",
    bar: "bg-indigo-400",
    bg: "bg-indigo-100 dark:bg-indigo-900/40",
    text: "text-indigo-800 dark:text-indigo-200",
    border: "border-indigo-400",
    dot: "bg-indigo-400",
  },
  {
    key: "indigo-500",
    bar: "bg-indigo-500",
    bg: "bg-indigo-100 dark:bg-indigo-900/40",
    text: "text-indigo-800 dark:text-indigo-200",
    border: "border-indigo-500",
    dot: "bg-indigo-500",
  },
  {
    key: "indigo-600",
    bar: "bg-indigo-600",
    bg: "bg-indigo-100 dark:bg-indigo-900/40",
    text: "text-indigo-800 dark:text-indigo-200",
    border: "border-indigo-600",
    dot: "bg-indigo-600",
  },
  {
    key: "cyan-500",
    bar: "bg-cyan-500",
    bg: "bg-cyan-100 dark:bg-cyan-900/40",
    text: "text-cyan-800 dark:text-cyan-200",
    border: "border-cyan-500",
    dot: "bg-cyan-500",
  },
  {
    key: "cyan-600",
    bar: "bg-cyan-600",
    bg: "bg-cyan-100 dark:bg-cyan-900/40",
    text: "text-cyan-800 dark:text-cyan-200",
    border: "border-cyan-600",
    dot: "bg-cyan-600",
  },
];

export const ORDER_PALETTE: LinePalette[] = [
  {
    key: "emerald",
    bar: "bg-emerald-500",
    bg: "bg-emerald-100 dark:bg-emerald-900/40",
    text: "text-emerald-800 dark:text-emerald-200",
    border: "border-emerald-400",
    dot: "bg-emerald-500",
  },
  {
    key: "violet",
    bar: "bg-violet-500",
    bg: "bg-violet-100 dark:bg-violet-900/40",
    text: "text-violet-800 dark:text-violet-200",
    border: "border-violet-400",
    dot: "bg-violet-500",
  },
  {
    key: "amber",
    bar: "bg-amber-500",
    bg: "bg-amber-100 dark:bg-amber-900/40",
    text: "text-amber-900 dark:text-amber-200",
    border: "border-amber-400",
    dot: "bg-amber-500",
  },
  {
    key: "rose",
    bar: "bg-rose-500",
    bg: "bg-rose-100 dark:bg-rose-900/40",
    text: "text-rose-800 dark:text-rose-200",
    border: "border-rose-400",
    dot: "bg-rose-500",
  },
  {
    key: "orange",
    bar: "bg-orange-500",
    bg: "bg-orange-100 dark:bg-orange-900/40",
    text: "text-orange-800 dark:text-orange-200",
    border: "border-orange-400",
    dot: "bg-orange-500",
  },
  {
    key: "fuchsia",
    bar: "bg-fuchsia-500",
    bg: "bg-fuchsia-100 dark:bg-fuchsia-900/40",
    text: "text-fuchsia-800 dark:text-fuchsia-200",
    border: "border-fuchsia-400",
    dot: "bg-fuchsia-500",
  },
  {
    key: "lime",
    bar: "bg-lime-600",
    bg: "bg-lime-100 dark:bg-lime-900/40",
    text: "text-lime-900 dark:text-lime-200",
    border: "border-lime-500",
    dot: "bg-lime-600",
  },
  {
    key: "purple",
    bar: "bg-purple-500",
    bg: "bg-purple-100 dark:bg-purple-900/40",
    text: "text-purple-800 dark:text-purple-200",
    border: "border-purple-400",
    dot: "bg-purple-500",
  },
  {
    key: "pink",
    bar: "bg-pink-500",
    bg: "bg-pink-100 dark:bg-pink-900/40",
    text: "text-pink-800 dark:text-pink-200",
    border: "border-pink-400",
    dot: "bg-pink-500",
  },
  {
    key: "red",
    bar: "bg-red-500",
    bg: "bg-red-100 dark:bg-red-900/40",
    text: "text-red-800 dark:text-red-200",
    border: "border-red-400",
    dot: "bg-red-500",
  },
  {
    key: "green",
    bar: "bg-green-600",
    bg: "bg-green-100 dark:bg-green-900/40",
    text: "text-green-800 dark:text-green-200",
    border: "border-green-500",
    dot: "bg-green-600",
  },
  {
    key: "yellow",
    bar: "bg-yellow-500",
    bg: "bg-yellow-100 dark:bg-yellow-900/40",
    text: "text-yellow-900 dark:text-yellow-200",
    border: "border-yellow-400",
    dot: "bg-yellow-500",
  },
];

export type PlannedJob = {
  assignment: ProductionPlanAssignment;
  order: OrderBook;
  line: ProductionLine;
  qty: number;
  dailyOutput: number;
  workingDays: number;
  dates: string[];
  startDate: string;
  endDate: string;
  lastDayQty: number;
  color: LinePalette;
};

function pickPalette(palette: LinePalette[], id: string, index?: number) {
  if (typeof index === "number") {
    return palette[((index % palette.length) + palette.length) % palette.length];
  }
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return palette[hash % palette.length];
}

export function colorForLine(lineId: string, index?: number) {
  return pickPalette(LINE_PALETTE, lineId, index);
}

export function colorForOrder(orderId: string, index?: number) {
  return pickPalette(ORDER_PALETTE, orderId, index);
}

export function parseISODate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return { year, month: month - 1, day };
}

export function addCalendarDays(date: string, days: number) {
  const { year, month, day } = parseISODate(date);
  const next = new Date(year, month, day + days);
  return padDate(next.getFullYear(), next.getMonth(), next.getDate());
}

export function weekdayOf(date: string) {
  const { year, month, day } = parseISODate(date);
  return new Date(year, month, day).getDay();
}

export function isWorkingDay(
  date: string,
  config: CalendarConfig,
  skip?: PlanningSkipSettings,
) {
  const weekday = weekdayOf(date);
  const dayHolidays = config.holidays.filter((holiday) => holiday.date === date);
  if (skip) return !isSkippedDate(weekday, dayHolidays, skip);
  if (config.weekendDays.includes(weekday)) return false;
  return dayHolidays.length === 0;
}

export function workingDaysNeeded(qty: number, dailyOutput: number) {
  if (qty <= 0 || dailyOutput <= 0) return 0;
  return Math.ceil(qty / dailyOutput);
}

export function lastDayQty(qty: number, dailyOutput: number) {
  if (qty <= 0 || dailyOutput <= 0) return 0;
  const remainder = qty % dailyOutput;
  return remainder === 0 ? dailyOutput : remainder;
}

const configCache = new Map<number, CalendarConfig>();

export function configForYear(year: number) {
  const cached = configCache.get(year);
  if (cached) return cached;
  const config = calendarStore.getOrCreate(year);
  configCache.set(year, config);
  return config;
}

export function clearScheduleConfigCache() {
  configCache.clear();
}

export function buildWorkingDates(
  startDate: string,
  daysNeeded: number,
  skip?: PlanningSkipSettings,
) {
  const dates: string[] = [];
  if (daysNeeded <= 0) return dates;
  let current = startDate;
  let guard = 0;
  while (dates.length < daysNeeded && guard < 900) {
    const year = Number(current.slice(0, 4));
    if (isWorkingDay(current, configForYear(year), skip)) {
      dates.push(current);
    }
    current = addCalendarDays(current, 1);
    guard += 1;
  }
  return dates;
}

export function firstWorkingDate(date: string, skip?: PlanningSkipSettings) {
  const dates = buildWorkingDates(date, 1, skip);
  return dates[0] || date;
}

function datesOverlap(left: string[], right: string[]) {
  const lookup = new Set(left);
  return right.some((date) => lookup.has(date));
}

export function buildPlannedJobs(
  assignments: ProductionPlanAssignment[],
  orders: OrderBook[],
  lines: ProductionLine[],
  skip?: PlanningSkipSettings,
): PlannedJob[] {
  clearScheduleConfigCache();
  const orderIndex = new Map(orders.map((order, index) => [order.id, index]));
  return assignments
    .map((assignment) => {
      const order = orders.find((item) => item.id === assignment.orderId);
      const line = lines.find((item) => item.id === assignment.lineId);
      if (!order || !line) return null;
      const fullQty = Number(order.orderQty) || 0;
      const qty = Number(assignment.qty) > 0 ? Number(assignment.qty) : fullQty;
      const dailyOutput = Number(line.targetOutput) || 0;
      const days = workingDaysNeeded(qty, dailyOutput);
      const dates = buildWorkingDates(assignment.startDate, days, skip);
      return {
        assignment,
        order,
        line,
        qty,
        dailyOutput,
        workingDays: dates.length,
        dates,
        startDate: dates[0] || assignment.startDate,
        endDate: dates[dates.length - 1] || assignment.startDate,
        lastDayQty: lastDayQty(qty, dailyOutput),
        color: colorForOrder(order.id, orderIndex.get(order.id)),
      } satisfies PlannedJob;
    })
    .filter((job): job is PlannedJob => Boolean(job))
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export function nextQueueStart(
  lineId: string,
  jobs: PlannedJob[],
  preferredStart: string,
  excludeOrderId?: string,
  skip?: PlanningSkipSettings,
) {
  const start = firstWorkingDate(preferredStart, skip);
  const lastEnd = jobs
    .filter(
      (job) =>
        job.line.id === lineId && job.order.id !== excludeOrderId && job.endDate,
    )
    .map((job) => job.endDate)
    .sort()
    .at(-1);
  if (!lastEnd) return start;
  const afterLast = firstWorkingDate(addCalendarDays(lastEnd, 1), skip);
  return afterLast > start ? afterLast : start;
}

export function jobOverlapsLine(
  lineId: string,
  dates: string[],
  jobs: PlannedJob[],
  excludeOrderId?: string,
  excludeAssignmentId?: string,
) {
  return jobs.some(
    (job) =>
      job.line.id === lineId &&
      job.order.id !== excludeOrderId &&
      job.assignment.id !== excludeAssignmentId &&
      datesOverlap(job.dates, dates),
  );
}

export function jobsWithoutMovedSegment(
  jobs: PlannedJob[],
  assignmentId: string,
  remainingDates: string[],
  remainingQty: number,
): PlannedJob[] {
  return jobs.flatMap((job) => {
    if (job.assignment.id !== assignmentId) return [job];
    if (remainingQty <= 0 || remainingDates.length === 0) return [];
    return [
      {
        ...job,
        qty: remainingQty,
        dates: remainingDates,
        startDate: remainingDates[0],
        endDate: remainingDates[remainingDates.length - 1],
        workingDays: remainingDates.length,
      },
    ];
  });
}

export function qtyOnDate(job: PlannedJob, date: string) {
  if (!job.dates.includes(date)) return 0;
  if (date === job.endDate) return job.lastDayQty;
  return job.dailyOutput;
}

export const BLOCKED_PLAN_STATUSES = new Set(["Cancelled"]);
