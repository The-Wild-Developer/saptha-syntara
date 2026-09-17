"use client";

import { useState, type DragEvent, type ReactNode } from "react";
import {
  CalendarHoliday,
  CalendarConfig,
  HolidayType,
  PlanningSkipSettings,
  isSkippedDate,
} from "@/utils/localStore";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const HOLIDAY_COLORS: Record<
  HolidayType,
  { bg: string; text: string; dot: string; border: string }
> = {
  Public: {
    bg: "bg-rose-100 dark:bg-rose-900/40",
    text: "text-rose-800 dark:text-rose-200",
    dot: "bg-rose-500",
    border: "border-rose-400",
  },
  Mercantile: {
    bg: "bg-amber-100 dark:bg-amber-900/40",
    text: "text-amber-900 dark:text-amber-200",
    dot: "bg-amber-500",
    border: "border-amber-400",
  },
  Bank: {
    bg: "bg-sky-100 dark:bg-sky-900/40",
    text: "text-sky-900 dark:text-sky-200",
    dot: "bg-sky-500",
    border: "border-sky-400",
  },
  Religious: {
    bg: "bg-violet-100 dark:bg-violet-900/40",
    text: "text-violet-900 dark:text-violet-200",
    dot: "bg-violet-500",
    border: "border-violet-400",
  },
  Company: {
    bg: "bg-emerald-100 dark:bg-emerald-900/40",
    text: "text-emerald-900 dark:text-emerald-200",
    dot: "bg-emerald-500",
    border: "border-emerald-400",
  },
  Optional: {
    bg: "bg-cyan-100 dark:bg-cyan-900/40",
    text: "text-cyan-900 dark:text-cyan-200",
    dot: "bg-cyan-500",
    border: "border-cyan-400",
  },
  Special: {
    bg: "bg-orange-100 dark:bg-orange-900/40",
    text: "text-orange-900 dark:text-orange-200",
    dot: "bg-orange-500",
    border: "border-orange-400",
  },
};

export function padDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

type CalendarCell = {
  day: number | null;
  date: string | null;
  weekday: number | null;
};

function buildMonthDays(
  year: number,
  month: number,
  weekStartsOn: 0 | 1,
): CalendarCell[] {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (first.getDay() - weekStartsOn + 7) % 7;
  const cells: CalendarCell[] = [];

  for (let i = 0; i < startOffset; i += 1) {
    cells.push({ day: null, date: null, weekday: null });
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      day,
      date: padDate(year, month, day),
      weekday: new Date(year, month, day).getDay(),
    });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: null, date: null, weekday: null });
  }
  return cells;
}

type CalendarMonthViewProps = {
  year: number;
  month: number;
  config: CalendarConfig;
  selectedDate: string;
  skipSettings?: PlanningSkipSettings;
  onSelectDate: (date: string) => void;
  onMonthChange: (year: number, month: number) => void;
  dayExtras?: Record<string, ReactNode>;
  compact?: boolean;
  showNav?: boolean;
  cellMinClass?: string;
  onDropDate?: (date: string, event: DragEvent<HTMLButtonElement>) => void;
};

export default function CalendarMonthView({
  year,
  month,
  config,
  selectedDate,
  skipSettings,
  onSelectDate,
  onMonthChange,
  dayExtras,
  compact = false,
  showNav = true,
  cellMinClass,
  onDropDate,
}: CalendarMonthViewProps) {
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);
  const now = new Date();
  const today = padDate(now.getFullYear(), now.getMonth(), now.getDate());
  const monthDays = buildMonthDays(year, month, config.weekStartsOn);
  const orderedWeekdays = [
    ...WEEKDAY_LABELS.slice(config.weekStartsOn),
    ...WEEKDAY_LABELS.slice(0, config.weekStartsOn),
  ];

  const holidaysByDate = new Map<string, CalendarHoliday[]>();
  config.holidays.forEach((holiday) => {
    const list = holidaysByDate.get(holiday.date) || [];
    list.push(holiday);
    holidaysByDate.set(holiday.date, list);
  });

  const goPrev = () => {
    if (month === 0) onMonthChange(year - 1, 11);
    else onMonthChange(year, month - 1);
  };

  const goNext = () => {
    if (month === 11) onMonthChange(year + 1, 0);
    else onMonthChange(year, month + 1);
  };

  const cellHeight = cellMinClass || (compact ? "min-h-16" : "min-h-20");

  return (
    <div className="flex flex-col">
      {showNav ? (
        <div className="mb-4 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stroke dark:border-strokedark"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h3 className="min-w-44 text-center text-base font-bold text-black dark:text-white">
            {MONTH_LABELS[month]} {year}
          </h3>
          <button
            type="button"
            onClick={goNext}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stroke dark:border-strokedark"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <div className="grid grid-cols-7 gap-1.5">
        {orderedWeekdays.map((label) => (
          <div
            key={label}
            className={`py-2 text-center text-xs font-bold uppercase tracking-wide ${
              label === "Sat" || label === "Sun"
                ? "text-gray-500 dark:text-bodydark2"
                : "text-bodydark2"
            }`}
          >
            {label}
          </div>
        ))}
        {monthDays.map((cell, index) => {
          if (!cell.date || cell.day === null || cell.weekday === null) {
            return (
              <div
                key={`empty-${index}`}
                className={`${cellHeight} rounded-xl`}
              />
            );
          }

          const dayHolidays = holidaysByDate.get(cell.date) || [];
          const extra = dayExtras?.[cell.date];
          const skipped = isSkippedDate(cell.weekday, dayHolidays, skipSettings);
          const isWeekend = cell.weekday === 0 || cell.weekday === 6;
          const holidayColors = dayHolidays[0]
            ? HOLIDAY_COLORS[dayHolidays[0].type]
            : null;
          const isSelected = selectedDate === cell.date;
          const isToday = cell.date === today;
          const isDropTarget = onDropDate && dragOverDate === cell.date;

          return (
            <button
              key={cell.date}
              type="button"
              onClick={() => onSelectDate(cell.date!)}
              onDragOver={(event) => {
                if (!onDropDate) return;
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                setDragOverDate(cell.date);
              }}
              onDragLeave={() => {
                setDragOverDate((current) =>
                  current === cell.date ? null : current,
                );
              }}
              onDrop={(event) => {
                if (!onDropDate) return;
                event.preventDefault();
                setDragOverDate(null);
                onDropDate(cell.date!, event);
              }}
              className={`flex flex-col rounded-xl border p-1.5 text-left transition ${cellHeight} ${
                isDropTarget
                  ? "border-primary bg-primary/10 shadow-sm"
                  : isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : holidayColors
                      ? `${holidayColors.border} ${holidayColors.bg}`
                      : isWeekend
                        ? "border-stroke bg-gray-2 dark:border-strokedark dark:bg-meta-4"
                        : "border-stroke bg-white hover:border-primary/40 dark:border-strokedark dark:bg-boxdark"
              }`}
            >
              <div className="mb-0.5 flex items-center justify-between">
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                    isToday
                      ? "bg-primary text-white"
                      : isWeekend
                        ? "text-gray-500 dark:text-bodydark2"
                        : "text-black dark:text-white"
                  }`}
                >
                  {cell.day}
                </span>
                {dayHolidays.length > 0 ? (
                  <span className="text-[10px] font-semibold text-bodydark2">
                    {dayHolidays.length}
                  </span>
                ) : null}
              </div>
              <div className="flex min-h-0 flex-1 flex-col gap-0.5">
                {dayHolidays.map((holiday) => {
                  const colors = HOLIDAY_COLORS[holiday.type];
                  return (
                    <div
                      key={holiday.id}
                      className={`w-full truncate rounded-md px-1 py-0.5 text-center text-[9px] font-semibold ${colors.bg} ${colors.text}`}
                      title={`${holiday.name} (${holiday.type})`}
                    >
                      {holiday.name}
                    </div>
                  );
                })}
                {skipped ? null : extra}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
