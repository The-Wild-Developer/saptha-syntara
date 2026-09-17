"use client";

import { useState, type ReactNode } from "react";
import { Settings } from "lucide-react";
import ClickOutside from "@/components/ClickOutside";
import { HOLIDAY_COLORS } from "@/components/calendar/CalendarMonthView";
import {
  HOLIDAY_TYPES,
  HolidayType,
  PlanningSkipSettings,
  normalizePlanningSkip,
} from "@/utils/localStore";

const HOLIDAY_EXCLUSION_LABELS: Record<HolidayType, string> = {
  Public: "Public Holidays",
  Mercantile: "Mercantile Holidays",
  Bank: "Bank Holidays",
  Religious: "Religious Holidays",
  Company: "Company Holidays",
  Optional: "Optional Holidays",
  Special: "Special Holidays",
};

type CalendarSkipSettingsProps = {
  value: PlanningSkipSettings;
  onChange: (next: PlanningSkipSettings) => void;
};

function SkipSwitch({
  id,
  checked,
  label,
  onChange,
}: {
  id: string;
  checked: boolean;
  label: ReactNode;
  onChange: (next: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center justify-between gap-3 py-1.5"
    >
      <span className="min-w-0 text-xs font-medium text-black dark:text-white">
        {label}
      </span>
      <span className="relative inline-flex shrink-0">
        <input
          id={id}
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span className="block h-5 w-9 rounded-full bg-meta-9 transition peer-checked:bg-primary dark:bg-[#5A616B]" />
        <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition peer-checked:translate-x-4" />
      </span>
    </label>
  );
}

export default function CalendarSkipSettings({
  value,
  onChange,
}: CalendarSkipSettingsProps) {
  const [open, setOpen] = useState(false);
  const skipAllHolidays = HOLIDAY_TYPES.every((type) =>
    value.skipHolidayTypes.includes(type),
  );

  const commit = (patch: Partial<PlanningSkipSettings>) => {
    let next: PlanningSkipSettings = { ...value, ...patch };
    if ("skipWeekends" in patch) {
      next.skipSaturday = Boolean(patch.skipWeekends);
      next.skipSunday = Boolean(patch.skipWeekends);
    } else if ("skipSaturday" in patch || "skipSunday" in patch) {
      next.skipWeekends = next.skipSaturday && next.skipSunday;
    }
    onChange(normalizePlanningSkip(next));
  };

  const toggleHoliday = (type: HolidayType, checked: boolean) => {
    const skipHolidayTypes = checked
      ? Array.from(new Set([...value.skipHolidayTypes, type]))
      : value.skipHolidayTypes.filter((item) => item !== type);
    commit({ skipHolidayTypes });
  };

  return (
    <ClickOutside onClick={() => setOpen(false)} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${open
            ? "border-primary bg-primary/10 text-primary"
            : "border-stroke text-bodydark2 hover:border-primary/40 hover:text-primary dark:border-strokedark"
          }`}
        aria-label="Schedule Exclusions"
        title="Schedule Exclusions"
      >
        <Settings className="h-4 w-4" />
      </button>
      {open ? (
        <div className="absolute right-0 z-30 mt-2 max-h-[min(24rem,70vh)] w-72 overflow-y-auto rounded-xl border border-stroke bg-white p-3 shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="mb-1 text-sm font-bold text-black dark:text-white">
            Schedule Exclusions
          </p>
          <p className="mb-3 text-[11px] text-bodydark2">
            Select weekend days and holiday categories to exclude from
            production scheduling.
          </p>

          <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-bodydark2">
            Weekend Days
          </p>
          <SkipSwitch
            id="skip-weekends"
            checked={value.skipWeekends}
            label="Exclude Weekends"
            onChange={(checked) => commit({ skipWeekends: checked })}
          />
          <SkipSwitch
            id="skip-saturday"
            checked={value.skipSaturday}
            label="Saturdays"
            onChange={(checked) => commit({ skipSaturday: checked })}
          />
          <SkipSwitch
            id="skip-sunday"
            checked={value.skipSunday}
            label="Sundays"
            onChange={(checked) => commit({ skipSunday: checked })}
          />

          <p className="mb-1 mt-3 text-[10px] font-bold uppercase tracking-wide text-bodydark2">
            Holiday categories
          </p>
          <SkipSwitch
            id="skip-all-holidays"
            checked={skipAllHolidays}
            label="Exclude All Holidays"
            onChange={(checked) =>
              commit({ skipHolidayTypes: checked ? [...HOLIDAY_TYPES] : [] })
            }
          />
          {HOLIDAY_TYPES.map((type) => {
            const colors = HOLIDAY_COLORS[type];
            return (
              <SkipSwitch
                key={type}
                id={`skip-holiday-${type}`}
                checked={value.skipHolidayTypes.includes(type)}
                label={
                  <span className="inline-flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
                    {HOLIDAY_EXCLUSION_LABELS[type]}
                  </span>
                }
                onChange={(checked) => toggleHoliday(type, checked)}
              />
            );
          })}
        </div>
      ) : null}
    </ClickOutside>
  );
}
