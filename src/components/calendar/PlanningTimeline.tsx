"use client";

import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type DragEvent,
  type MouseEvent,
} from "react";
import {
  CalendarConfig,
  PlanningSkipSettings,
  ProductionLine,
  isSkippedDate,
} from "@/utils/localStore";
import { HOLIDAY_COLORS, padDate } from "@/components/calendar/CalendarMonthView";
import {
  buildWorkingDates,
  colorForLine,
  firstWorkingDate,
  jobOverlapsLine,
  workingDaysNeeded,
  type PlannedJob,
} from "@/utils/productionSchedule";

export const DAYS_DRAG_TYPE = "application/x-plan-days";

export type DayMovePayload = {
  assignmentId: string;
  orderId: string;
  dates: string[];
};

type DragOverTarget = {
  lineId: string;
  date: string | null;
};

type PlanningTimelineProps = {
  year: number;
  month: number;
  config: CalendarConfig;
  lines: ProductionLine[];
  jobs: PlannedJob[];
  skipSettings?: PlanningSkipSettings;
  selectedDate: string;
  selectedLineId: string | null;
  selectedAssignmentId: string | null;
  selectedDays: string[];
  dragging: boolean;
  draggingOrderId?: string | null;
  draggingOrderQty?: number;
  draggingDayCount?: number;
  onSelectDate: (date: string) => void;
  onSelectLine: (lineId: string) => void;
  onToggleJobDay: (
    job: PlannedJob | null,
    date: string,
    event: MouseEvent<HTMLButtonElement>,
  ) => void;
  onDragDaysStart: (
    job: PlannedJob,
    date: string,
    event: DragEvent<HTMLButtonElement>,
  ) => void;
  onDropLine: (lineId: string, event: DragEvent) => void;
  onDropDate: (lineId: string, date: string, event: DragEvent) => void;
};

function clipJobToMonth(job: PlannedJob, year: number, month: number) {
  const monthStart = padDate(year, month, 1);
  const monthEnd = padDate(year, month, new Date(year, month + 1, 0).getDate());
  const dates = job.dates.filter(
    (date) => date >= monthStart && date <= monthEnd,
  );
  if (dates.length === 0) return null;
  return {
    dates,
    startDate: dates[0],
  };
}

function allowPlanDrop(event: DragEvent) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
}

function leftDragTarget(
  current: DragOverTarget | null,
  target: EventTarget | null,
  related: EventTarget | null,
  lineId: string,
  date: string | null,
) {
  if (
    related instanceof Node &&
    target instanceof Node &&
    target.contains(related)
  ) {
    return current;
  }
  if (current?.lineId === lineId && current.date === date) return null;
  return current;
}

export default function PlanningTimeline({
  year,
  month,
  config,
  lines,
  jobs,
  skipSettings,
  selectedDate,
  selectedLineId,
  selectedAssignmentId,
  selectedDays,
  dragging,
  draggingOrderId = null,
  draggingOrderQty = 0,
  draggingDayCount = 0,
  onSelectDate,
  onSelectLine,
  onToggleJobDay,
  onDragDaysStart,
  onDropLine,
  onDropDate,
}: PlanningTimelineProps) {
  const [dragOver, setDragOver] = useState<DragOverTarget | null>(null);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  const selectedDaySet = new Set(selectedDays);
  const jobsByLine = new Map<string, PlannedJob[]>();
  jobs.forEach((job) => {
    const list = jobsByLine.get(job.line.id) || [];
    list.push(job);
    jobsByLine.set(job.line.id, list);
  });
  const holidaysByDate = new Map<string, typeof config.holidays>();
  config.holidays.forEach((holiday) => {
    if (!holiday.date.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`)) {
      return;
    }
    const list = holidaysByDate.get(holiday.date) || [];
    list.push(holiday);
    holidaysByDate.set(holiday.date, list);
  });
  const monthHolidays = Array.from(holidaysByDate.values())
    .flat()
    .sort((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name));

  useEffect(() => {
    if (!dragging) setDragOver(null);
  }, [dragging]);

  const preview = useMemo(() => {
    if (!dragging || !dragOver?.date) return null;
    const line = lines.find((item) => item.id === dragOver.lineId);
    if (!line) return null;
    const dailyOutput = Number(line.targetOutput) || 0;
    const daysNeeded =
      draggingOrderQty > 0
        ? workingDaysNeeded(draggingOrderQty, dailyOutput)
        : draggingDayCount;
    const hoverDate = dragOver.date;
    if (daysNeeded <= 0) {
      return {
        lineId: line.id,
        hoverDate,
        startDate: hoverDate,
        dates: new Set([hoverDate]),
        conflict: false,
      };
    }
    const startDate = firstWorkingDate(hoverDate, skipSettings);
    const dates = buildWorkingDates(startDate, daysNeeded, skipSettings);
    return {
      lineId: line.id,
      hoverDate,
      startDate,
      dates: new Set(dates),
      conflict: jobOverlapsLine(
        line.id,
        dates,
        jobs,
        draggingOrderId || undefined,
      ),
    };
  }, [
    dragging,
    dragOver,
    lines,
    draggingOrderQty,
    draggingDayCount,
    skipSettings,
    jobs,
    draggingOrderId,
  ]);

  return (
    <div>
      {monthHolidays.length > 0 ? (
        <div className="mb-1.5 flex flex-wrap gap-1.5">
          {monthHolidays.map((holiday) => {
            const colors = HOLIDAY_COLORS[holiday.type];
            return (
              <span
                key={holiday.id}
                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${colors.bg} ${colors.text}`}
                title={`${holiday.date} · ${holiday.type}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
                {holiday.date.slice(8, 10)} {holiday.name}
              </span>
            );
          })}
        </div>
      ) : null}
      <div className="overflow-x-auto rounded-xl border border-stroke dark:border-strokedark">
      <div className="min-w-[680px]">
        <div className="flex border-b border-stroke dark:border-strokedark">
          <div className="sticky left-0 z-10 flex w-28 shrink-0 items-center bg-white px-2 py-1.5 text-[10px] font-bold uppercase tracking-wide text-bodydark2 dark:bg-boxdark">
            Line
          </div>
          <div
            className="grid min-w-0 flex-1"
            style={{ gridTemplateColumns: `repeat(${daysInMonth}, minmax(16px, 1fr))` }}
          >
            {days.map((day) => {
              const date = padDate(year, month, day);
              const weekday = new Date(year, month, day).getDay();
              const dayHolidays = holidaysByDate.get(date) || [];
              const isWeekend = weekday === 0 || weekday === 6;
              const isSelected = selectedDate === date;
              const holidayColors = dayHolidays[0]
                ? HOLIDAY_COLORS[dayHolidays[0].type]
                : null;
              const isDropColumn =
                dragOver?.date === date || preview?.hoverDate === date;
              return (
                <button
                  key={date}
                  type="button"
                  title={
                    dayHolidays.length > 0
                      ? dayHolidays
                          .map((holiday) => `${holiday.name} (${holiday.type})`)
                          .join(", ")
                      : date
                  }
                  onClick={() => onSelectDate(date)}
                  className={`py-1.5 text-center text-[10px] font-semibold ${
                    isDropColumn
                      ? "bg-primary text-white"
                      : holidayColors
                        ? `${holidayColors.bg} ${holidayColors.text}`
                      : isSelected
                        ? "bg-primary/10 text-primary"
                        : isWeekend
                          ? "bg-gray-2 text-gray-500 dark:bg-meta-4 dark:text-bodydark2"
                          : "text-black dark:text-white"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {lines.length === 0 ? (
          <p className="px-3 py-6 text-center text-xs text-bodydark2">
            No production lines to plot.
          </p>
        ) : (
          lines.map((line, index) => {
            const lineColor = colorForLine(line.id, index);
            const lineJobs = jobsByLine.get(line.id) || [];
            const active = selectedLineId === line.id;
            const isLineDrop =
              dragOver?.lineId === line.id && dragOver.date === null;
            const isLineHover = dragOver?.lineId === line.id;
            return (
              <div
                key={line.id}
                className={`flex border-b border-stroke last:border-b-0 dark:border-strokedark ${
                  isLineHover
                    ? "bg-primary/10"
                    : active
                      ? "bg-primary/5"
                      : "bg-white dark:bg-boxdark"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectLine(line.id)}
                  onDragOver={(event) => {
                    allowPlanDrop(event);
                    setDragOver({ lineId: line.id, date: null });
                  }}
                  onDragLeave={(event) => {
                    const target = event.currentTarget;
                    const related = event.relatedTarget;
                    setDragOver((current) =>
                      leftDragTarget(current, target, related, line.id, null),
                    );
                  }}
                  onDrop={(event) => {
                    setDragOver(null);
                    onDropLine(line.id, event);
                  }}
                  className={`sticky left-0 z-10 flex h-8 w-28 shrink-0 items-center overflow-hidden px-2 text-left ${lineColor.bar} ${
                    isLineDrop ? "ring-2 ring-inset ring-white" : ""
                  }`}
                  title={`${line.name || line.code} · drop here to queue`}
                >
                  <span className="plan-bar-glass pointer-events-none" aria-hidden />
                  <span className="relative z-10 truncate text-[11px] font-semibold text-white">
                    {line.code || line.name}
                  </span>
                </button>
                <div
                  className="relative min-w-0 flex-1"
                  onDragOver={(event) => {
                    allowPlanDrop(event);
                    setDragOver((current) =>
                      current?.lineId === line.id
                        ? current
                        : { lineId: line.id, date: null },
                    );
                  }}
                  onDrop={(event) => {
                    setDragOver(null);
                    onDropLine(line.id, event);
                  }}
                >
                  <div
                    className="grid h-8"
                    style={{
                      gridTemplateColumns: `repeat(${daysInMonth}, minmax(16px, 1fr))`,
                    }}
                  >
                    {days.map((day) => {
                      const date = padDate(year, month, day);
                      const weekday = new Date(year, month, day).getDay();
                      const isDateSelected = selectedDate === date;
                      const dayHolidays = holidaysByDate.get(date) || [];
                      const skipped = isSkippedDate(
                        weekday,
                        dayHolidays,
                        skipSettings,
                      );
                      const isWeekend = weekday === 0 || weekday === 6;
                      const holidayColors = dayHolidays[0]
                        ? HOLIDAY_COLORS[dayHolidays[0].type]
                        : null;
                      const holidayTitle =
                        dayHolidays.length > 0
                          ? dayHolidays
                              .map((item) => `${item.name} (${item.type})`)
                              .join(", ")
                          : "";
                      const coveringJob = skipped
                        ? undefined
                        : lineJobs.find((job) => job.dates.includes(date));
                      const jobOnDay = coveringJob;
                      const prevDate =
                        day > 1 ? padDate(year, month, day - 1) : null;
                      const nextDate =
                        day < daysInMonth
                          ? padDate(year, month, day + 1)
                          : null;
                      const continuesLeft = Boolean(
                        jobOnDay &&
                          prevDate &&
                          jobOnDay.dates.includes(prevDate),
                      );
                      const continuesRight = Boolean(
                        jobOnDay &&
                          nextDate &&
                          jobOnDay.dates.includes(nextDate),
                      );
                      const span = jobOnDay
                        ? clipJobToMonth(jobOnDay, year, month)
                        : null;
                      const isStart = span?.startDate === date;
                      const isPicked =
                        Boolean(jobOnDay) &&
                        selectedAssignmentId === jobOnDay?.assignment.id &&
                        selectedDaySet.has(date);
                      const isLate = Boolean(
                        jobOnDay?.order.deliveryDate &&
                          date > jobOnDay.order.deliveryDate,
                      );
                      const isHoverBox =
                        dragOver?.lineId === line.id && dragOver.date === date;
                      const isPreviewStart =
                        preview?.lineId === line.id && preview.startDate === date;
                      const isPreviewDay =
                        preview?.lineId === line.id && preview.dates.has(date);
                      const dropHint = isHoverBox
                        ? preview?.conflict
                          ? "Line already booked on those days"
                          : `Start from ${preview?.startDate || date}`
                        : "";
                      return (
                        <button
                          key={`${line.id}-${date}`}
                          type="button"
                          draggable={Boolean(
                            jobOnDay && jobOnDay.dates.includes(date),
                          )}
                          title={
                            [
                              dropHint,
                              jobOnDay
                                ? `${jobOnDay.order.orderNo} · ${jobOnDay.startDate} → ${jobOnDay.endDate}`
                                : "Drop an order to start from this date",
                              isLate ? "After delivery date" : "",
                              holidayTitle,
                              date,
                            ]
                              .filter(Boolean)
                              .join(" · ")
                          }
                          onClick={(event) => {
                            onSelectLine(line.id);
                            onSelectDate(date);
                            if (jobOnDay && jobOnDay.dates.includes(date)) {
                              onToggleJobDay(jobOnDay, date, event);
                              return;
                            }
                            onToggleJobDay(null, date, event);
                          }}
                          onDragStart={(event) => {
                            if (!jobOnDay || !jobOnDay.dates.includes(date)) {
                              event.preventDefault();
                              return;
                            }
                            event.stopPropagation();
                            onDragDaysStart(jobOnDay, date, event);
                          }}
                          onDragOver={(event) => {
                            allowPlanDrop(event);
                            event.stopPropagation();
                            setDragOver({ lineId: line.id, date });
                          }}
                          onDragLeave={(event) => {
                            const target = event.currentTarget;
                            const related = event.relatedTarget;
                            setDragOver((current) =>
                              leftDragTarget(
                                current,
                                target,
                                related,
                                line.id,
                                date,
                              ),
                            );
                          }}
                          onDrop={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            setDragOver(null);
                            onDropDate(line.id, date, event);
                          }}
                          className={`relative overflow-hidden px-0.5 text-[9px] font-bold ${
                            jobOnDay
                              ? `border-0 ${jobOnDay.color.bar} text-white ${
                                  continuesLeft ? "" : "rounded-l-sm"
                                } ${continuesRight ? "" : "rounded-r-sm"} ${
                                  isPicked
                                    ? "ring-inset ring-2 ring-white"
                                    : ""
                                }`
                              : `border-l border-stroke/70 dark:border-strokedark/70 ${
                                  holidayColors
                                    ? `${holidayColors.bg} ${holidayColors.text}`
                                    : isDateSelected
                                      ? "bg-primary/10 text-primary"
                                      : isWeekend
                                        ? "bg-gray-2 text-gray-500 dark:bg-meta-4 dark:text-bodydark2"
                                        : "text-bodydark2"
                                }`
                          }`}
                          style={
                            jobOnDay
                              ? ({
                                  "--plan-bar-delay": `${(day - 1) * 0.08}s`,
                                } as CSSProperties)
                              : undefined
                          }
                        >
                          {jobOnDay ? (
                            <>
                              <span
                                className="plan-bar-glass pointer-events-none"
                                aria-hidden
                              />
                              <span
                                className="plan-bar-sweep pointer-events-none"
                                aria-hidden
                              />
                            </>
                          ) : null}
                          {isStart ? (
                            <span className="relative z-10 flex min-w-0 items-center gap-0.5">
                              <span className="plan-bar-pulse-dot" aria-hidden />
                              <span className="truncate">
                                {jobOnDay?.order.orderNo}
                              </span>
                            </span>
                          ) : null}
                          {isHoverBox || isPreviewDay ? (
                            <span
                              className={`pointer-events-none absolute inset-0 z-20 ${
                                isHoverBox || isPreviewStart
                                  ? preview?.conflict
                                    ? "bg-danger/35 ring-2 ring-inset ring-danger"
                                    : "bg-primary/40 ring-2 ring-inset ring-primary"
                                  : preview?.conflict
                                    ? "bg-danger/15 ring-1 ring-inset ring-danger/70"
                                    : "bg-primary/20 ring-1 ring-inset ring-primary/70"
                              }`}
                              aria-hidden
                            />
                          ) : dragging && !jobOnDay ? (
                            <span
                              className="pointer-events-none absolute inset-0 z-10 ring-1 ring-inset ring-primary/25"
                              aria-hidden
                            />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      </div>
    </div>
  );
}
