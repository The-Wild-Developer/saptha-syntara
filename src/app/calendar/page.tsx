"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import FormField from "@/components/common/FormField";
import withAuth from "@/utils/withAuth";
import {
  CalendarConfig,
  CalendarHoliday,
  HOLIDAY_TYPES,
  HolidayType,
  calendarStore,
} from "@/utils/localStore";
import { showErrorAlert, showSuccessAlert } from "@/utils/alert";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = [
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

const HOLIDAY_COLORS: Record<
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

function padDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function emptyHoliday(date = ""): Omit<CalendarHoliday, "id"> {
  return {
    date,
    name: "",
    type: "Public",
    description: "",
  };
}

function CalendarManagement() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [config, setConfig] = useState<CalendarConfig | null>(null);
  const [selectedDate, setSelectedDate] = useState(
    padDate(now.getFullYear(), now.getMonth(), now.getDate()),
  );
  const [editing, setEditing] = useState<CalendarHoliday | null>(null);
  const [draft, setDraft] = useState(emptyHoliday());
  const [showForm, setShowForm] = useState(false);
  const [typeFilter, setTypeFilter] = useState<"All" | HolidayType>("All");

  useEffect(() => {
    setConfig(calendarStore.getOrCreate(year));
  }, [year]);

  const holidaysByDate = useMemo(() => {
    const map = new Map<string, CalendarHoliday[]>();
    (config?.holidays || []).forEach((holiday) => {
      const list = map.get(holiday.date) || [];
      list.push(holiday);
      map.set(holiday.date, list);
    });
    return map;
  }, [config]);

  const monthDays = useMemo(() => {
    if (!config) return [];
    const first = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startOffset =
      (first.getDay() - config.weekStartsOn + 7) % 7;
    const cells: Array<{
      day: number | null;
      date: string | null;
      weekday: number | null;
    }> = [];

    for (let i = 0; i < startOffset; i += 1) {
      cells.push({ day: null, date: null, weekday: null });
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = padDate(year, month, day);
      const weekday = new Date(year, month, day).getDay();
      cells.push({ day, date, weekday });
    }
    while (cells.length % 7 !== 0) {
      cells.push({ day: null, date: null, weekday: null });
    }
    return cells;
  }, [config, month, year]);

  const orderedWeekdays = useMemo(() => {
    if (!config) return WEEKDAY_LABELS;
    const start = config.weekStartsOn;
    return [...WEEKDAY_LABELS.slice(start), ...WEEKDAY_LABELS.slice(0, start)];
  }, [config]);

  const filteredHolidays = useMemo(() => {
    const list = [...(config?.holidays || [])].sort((a, b) =>
      a.date.localeCompare(b.date),
    );
    if (typeFilter === "All") return list;
    return list.filter((item) => item.type === typeFilter);
  }, [config, typeFilter]);

  const selectedHolidays = selectedDate
    ? holidaysByDate.get(selectedDate) || []
    : [];

  const updateConfig = (patch: Partial<CalendarConfig>) => {
    setConfig((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const openAdd = (date = selectedDate) => {
    setEditing(null);
    setDraft(emptyHoliday(date));
    setShowForm(true);
  };

  const openEdit = (holiday: CalendarHoliday) => {
    setEditing(holiday);
    setDraft({
      date: holiday.date,
      name: holiday.name,
      type: holiday.type,
      description: holiday.description || "",
    });
    setSelectedDate(holiday.date);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setDraft(emptyHoliday());
  };

  const handleSaveHoliday = () => {
    if (!config) return;
    if (!draft.date || !draft.name.trim()) {
      showErrorAlert(
        "Missing details",
        "Holiday name and date are required.",
      );
      return;
    }
    if (!HOLIDAY_TYPES.includes(draft.type)) {
      showErrorAlert("Invalid type", "Select a valid holiday type.");
      return;
    }

    const nextHoliday: CalendarHoliday = editing
      ? { ...editing, ...draft, name: draft.name.trim() }
      : {
          id: `hol-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          ...draft,
          name: draft.name.trim(),
        };

    const holidays = editing
      ? config.holidays.map((item) =>
          item.id === editing.id ? nextHoliday : item,
        )
      : [...config.holidays, nextHoliday];

    updateConfig({ holidays });
    setSelectedDate(draft.date);
    closeForm();
    showSuccessAlert(
      editing ? "Holiday updated" : "Holiday added",
      "Remember to save the calendar to keep changes.",
    );
  };

  const handleDeleteHoliday = (id: string) => {
    if (!config) return;
    updateConfig({
      holidays: config.holidays.filter((item) => item.id !== id),
    });
    if (editing?.id === id) closeForm();
  };

  const handleSaveCalendar = () => {
    if (!config) return;
    const saved = calendarStore.save(config);
    setConfig(saved);
    showSuccessAlert(
      "Calendar saved",
      `${saved.name} has been saved for ${saved.year}.`,
    );
  };

  const handleReset = () => {
    const next = calendarStore.resetToStandard(year);
    setConfig(next);
    closeForm();
    showSuccessAlert(
      "Standard calendar loaded",
      "Public and mercantile holidays were restored for this year.",
    );
  };

  const toggleWeekend = (day: number) => {
    if (!config) return;
    const exists = config.weekendDays.includes(day);
    updateConfig({
      weekendDays: exists
        ? config.weekendDays.filter((item) => item !== day)
        : [...config.weekendDays, day].sort(),
    });
  };

  if (!config) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="Calendar Management" />
        <p className="mt-6 text-sm text-bodydark2">Loading calendar...</p>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Calendar Management" />

      <div className="mt-4 space-y-4">
        <div className="rounded-2xl border border-stroke bg-white p-4 shadow-sm dark:border-strokedark dark:bg-boxdark md:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CalendarDays className="h-5 w-5" />
                </span>
                <h2 className="text-lg font-bold text-black dark:text-white">
                  Calendar Management
                </h2>
              </div>
              <p className="text-sm text-bodydark2">
                Load the standard year calendar, customize weekends, and manage
                public, mercantile, and other holiday types.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-full border border-stroke bg-gray-2 px-4 py-2 text-sm font-semibold text-black transition hover:border-primary hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Standard
              </button>
              <button
                type="button"
                onClick={handleSaveCalendar}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-hover"
              >
                <Save className="h-4 w-4" />
                Save Calendar
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
            <FormField
              label="Calendar Name"
              name="name"
              value={config.name}
              onChange={(e) => updateConfig({ name: e.target.value })}
              required
              placeholder="Enter calendar name"
              fullWidth
            />
            <div className="w-full">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Year
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setYear((value) => value - 1)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-stroke dark:border-strokedark"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  value={String(year)}
                  onChange={(e) => {
                    const next = Number(e.target.value.replace(/\D/g, ""));
                    if (next >= 2000 && next <= 2100) setYear(next);
                  }}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-4 py-2 text-center font-semibold text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setYear((value) => value + 1)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-stroke dark:border-strokedark"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <FormField
              label="Week Starts On"
              name="weekStartsOn"
              value={String(config.weekStartsOn)}
              onChange={(e) =>
                updateConfig({
                  weekStartsOn: Number(e.target.value) as 0 | 1,
                })
              }
              as="select"
              fullWidth
              options={[
                { value: "1", label: "Monday" },
                { value: "0", label: "Sunday" },
              ]}
            />
            <div className="w-full">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Weekend Days
              </label>
              <div className="flex flex-wrap gap-1.5">
                {WEEKDAY_LABELS.map((label, day) => {
                  const active = config.weekendDays.includes(day);
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => toggleWeekend(day)}
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                        active
                          ? "bg-primary text-white"
                          : "bg-gray-2 text-bodydark2 dark:bg-meta-4"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {HOLIDAY_TYPES.map((type) => {
              const colors = HOLIDAY_COLORS[type];
              const count = config.holidays.filter((h) => h.type === type).length;
              return (
                <span
                  key={type}
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${colors.bg} ${colors.text}`}
                >
                  <span className={`h-2 w-2 rounded-full ${colors.dot}`} />
                  {type} ({count})
                </span>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_1fr]">
          <div className="rounded-2xl border border-stroke bg-white p-4 shadow-sm dark:border-strokedark dark:bg-boxdark md:p-5">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (month === 0) {
                      setMonth(11);
                      setYear((value) => value - 1);
                    } else {
                      setMonth((value) => value - 1);
                    }
                  }}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stroke dark:border-strokedark"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <h3 className="min-w-40 text-center text-base font-bold text-black dark:text-white">
                  {MONTH_LABELS[month]} {year}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    if (month === 11) {
                      setMonth(0);
                      setYear((value) => value + 1);
                    } else {
                      setMonth((value) => value + 1);
                    }
                  }}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stroke dark:border-strokedark"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => openAdd(selectedDate)}
                className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white"
              >
                <Plus className="h-4 w-4" />
                Add Holiday
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {orderedWeekdays.map((label) => (
                <div
                  key={label}
                  className="py-2 text-center text-xs font-bold uppercase tracking-wide text-bodydark2"
                >
                  {label}
                </div>
              ))}
              {monthDays.map((cell, index) => {
                if (!cell.date || cell.day === null || cell.weekday === null) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="min-h-20 rounded-xl bg-transparent"
                    />
                  );
                }
                const dayHolidays = holidaysByDate.get(cell.date) || [];
                const isWeekend = config.weekendDays.includes(cell.weekday);
                const isSelected = selectedDate === cell.date;
                const isToday =
                  cell.date ===
                  padDate(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate(),
                  );

                return (
                  <button
                    key={cell.date}
                    type="button"
                    onClick={() => setSelectedDate(cell.date!)}
                    onDoubleClick={() => openAdd(cell.date!)}
                    className={`min-h-20 rounded-xl border p-2 text-left transition ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : isWeekend
                          ? "border-stroke bg-gray-2/80 dark:border-strokedark dark:bg-meta-4/60"
                          : "border-stroke bg-white hover:border-primary/40 dark:border-strokedark dark:bg-boxdark"
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                          isToday
                            ? "bg-primary text-white"
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
                    <div className="space-y-1">
                      {dayHolidays.slice(0, 2).map((holiday) => {
                        const colors = HOLIDAY_COLORS[holiday.type];
                        return (
                          <div
                            key={holiday.id}
                            className={`truncate rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${colors.bg} ${colors.text}`}
                            title={`${holiday.name} (${holiday.type})`}
                          >
                            {holiday.name}
                          </div>
                        );
                      })}
                      {dayHolidays.length > 2 ? (
                        <p className="text-[10px] text-bodydark2">
                          +{dayHolidays.length - 2} more
                        </p>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-stroke bg-white p-4 shadow-sm dark:border-strokedark dark:bg-boxdark">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-black dark:text-white">
                    Selected Day
                  </h3>
                  <p className="text-xs text-bodydark2">{selectedDate}</p>
                </div>
                <button
                  type="button"
                  onClick={() => openAdd(selectedDate)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white"
                  title="Add holiday"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {selectedHolidays.length === 0 ? (
                <p className="rounded-xl border border-dashed border-stroke px-3 py-6 text-center text-sm text-bodydark2 dark:border-strokedark">
                  No holidays on this date. Double-click a day or use Add
                  Holiday.
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedHolidays.map((holiday) => {
                    const colors = HOLIDAY_COLORS[holiday.type];
                    return (
                      <div
                        key={holiday.id}
                        className={`rounded-xl border px-3 py-2 ${colors.border} ${colors.bg}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className={`text-sm font-bold ${colors.text}`}>
                              {holiday.name}
                            </p>
                            <p className="text-xs text-bodydark2">
                              {holiday.type}
                              {holiday.description
                                ? ` · ${holiday.description}`
                                : ""}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => openEdit(holiday)}
                              className="rounded-lg bg-white/70 px-2 py-1 text-[11px] font-semibold text-black dark:bg-boxdark dark:text-white"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteHoliday(holiday.id)}
                              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-danger/10 text-danger"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-stroke bg-white p-4 shadow-sm dark:border-strokedark dark:bg-boxdark">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-black dark:text-white">
                  All Holidays ({filteredHolidays.length})
                </h3>
                <div className="relative min-w-40">
                  <select
                    value={typeFilter}
                    onChange={(e) =>
                      setTypeFilter(e.target.value as "All" | HolidayType)
                    }
                    className="w-full cursor-pointer appearance-none rounded-lg border-[1.5px] border-stroke bg-transparent py-2 pl-4 pr-10 text-sm font-medium text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="All">All types</option>
                    {HOLIDAY_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bodydark2" />
                </div>
              </div>
              <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                {filteredHolidays.length === 0 ? (
                  <p className="py-6 text-center text-sm text-bodydark2">
                    No holidays found for this filter.
                  </p>
                ) : (
                  filteredHolidays.map((holiday) => {
                    const colors = HOLIDAY_COLORS[holiday.type];
                    return (
                      <button
                        key={holiday.id}
                        type="button"
                        onClick={() => {
                          setSelectedDate(holiday.date);
                          const [y, m] = holiday.date.split("-").map(Number);
                          setYear(y);
                          setMonth(m - 1);
                        }}
                        className="flex w-full items-center gap-3 rounded-xl border border-stroke px-3 py-2 text-left transition hover:border-primary/40 dark:border-strokedark"
                      >
                        <span
                          className={`h-2.5 w-2.5 shrink-0 rounded-full ${colors.dot}`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-black dark:text-white">
                            {holiday.name}
                          </p>
                          <p className="truncate text-xs text-bodydark2">
                            {holiday.date} · {holiday.type}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showForm ? (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-stroke bg-white p-5 shadow-xl dark:border-strokedark dark:bg-boxdark">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-black dark:text-white">
                {editing ? "Edit Holiday" : "Add Holiday"}
              </h3>
              <button
                type="button"
                onClick={closeForm}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-2 dark:bg-meta-4"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <FormField
                label="Holiday Name"
                name="name"
                value={draft.name}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                placeholder="Enter holiday name"
                fullWidth
              />
              <FormField
                label="Date"
                name="date"
                type="date"
                value={draft.date}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, date: e.target.value }))
                }
                required
                fullWidth
              />
              <FormField
                label="Holiday Type"
                name="type"
                value={draft.type}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    type: e.target.value as HolidayType,
                  }))
                }
                as="select"
                required
                fullWidth
                options={HOLIDAY_TYPES.map((type) => ({
                  value: type,
                  label: `${type} Holiday`,
                }))}
              />
              <FormField
                label="Description"
                name="description"
                value={draft.description}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                as="textarea"
                placeholder="Optional notes"
                fullWidth
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg bg-gray-500 px-4 py-2 text-sm text-white hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveHoliday}
                className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-hover"
              >
                {editing ? "Update Holiday" : "Add Holiday"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </DefaultLayout>
  );
}

export default withAuth(CalendarManagement);
