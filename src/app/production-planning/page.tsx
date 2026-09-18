"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Factory,
  GripVertical,
  LayoutGrid,
  Network,
  Search,
  X,
} from "lucide-react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CalendarMonthView, {
  HOLIDAY_COLORS,
  MONTH_LABELS,
  padDate,
} from "@/components/calendar/CalendarMonthView";
import PlanningTimeline, {
  DAYS_DRAG_TYPE,
  type DayMovePayload,
} from "@/components/calendar/PlanningTimeline";
import CalendarSkipSettings from "@/components/calendar/CalendarSkipSettings";
import withAuth from "@/utils/withAuth";
import { fireAlert, showErrorAlert, showSuccessAlert } from "@/utils/alert";
import {
  CalendarConfig,
  DEFAULT_PLANNING_SKIP,
  HOLIDAY_TYPES,
  calendarStore,
  companyStore,
  groupStore,
  orderBookStore,
  planningSkipStore,
  productionLineStore,
  productionPlanStore,
  sectionStore,
} from "@/utils/localStore";
import {
  BLOCKED_PLAN_STATUSES,
  buildPlannedJobs,
  buildWorkingDates,
  clearScheduleConfigCache,
  colorForLine,
  colorForOrder,
  firstWorkingDate,
  jobOverlapsLine,
  jobsWithoutMovedSegment,
  nextQueueStart,
  qtyOnDate,
  workingDaysNeeded,
  type PlannedJob,
} from "@/utils/productionSchedule";

const ORDER_DRAG_TYPE = "text/order-id";
const PLANNING_COMPANY_KEY = "ss_planning_company_id";
const PLANNING_GROUP_KEY = "ss_planning_group_id";

function readDaysPayload(event: DragEvent): DayMovePayload | null {
  const raw =
    event.dataTransfer.getData(DAYS_DRAG_TYPE) ||
    event.dataTransfer.getData("text/plan-days") ||
    event.dataTransfer.getData("text/plain");
  if (!raw) return null;
  const encoded = raw.startsWith("days:") ? raw.slice(5) : raw;
  try {
    const parsed = JSON.parse(encoded) as DayMovePayload;
    if (!parsed?.assignmentId || !Array.isArray(parsed.dates)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function statusClass(status: string) {
  if (status === "Shipped" || status === "Packed") {
    return "bg-success/10 text-success";
  }
  if (status === "Cancelled" || status === "On Hold") {
    return "bg-danger/10 text-danger";
  }
  if (status === "Confirmed") {
    return "bg-primary/10 text-primary";
  }
  return "bg-warning/10 text-warning";
}

function formatPcs(value: number) {
  return `${value.toLocaleString()} pcs`;
}

function readDraggedOrderId(event: DragEvent) {
  const value =
    event.dataTransfer.getData(ORDER_DRAG_TYPE) ||
    event.dataTransfer.getData("text/plain");
  if (!value || value.startsWith("days:") || value.startsWith("{")) return "";
  return value;
}

function ProductionPlanningBoard() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [config, setConfig] = useState<CalendarConfig | null>(null);
  const [selectedDate, setSelectedDate] = useState(
    padDate(now.getFullYear(), now.getMonth(), now.getDate()),
  );
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [lineQuery, setLineQuery] = useState("");
  const [orderQuery, setOrderQuery] = useState("");
  const [draggingOrderId, setDraggingOrderId] = useState<string | null>(null);
  const [draggingDays, setDraggingDays] = useState(false);
  const [draggingAssignmentId, setDraggingAssignmentId] = useState<string | null>(
    null,
  );
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(
    null,
  );
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [dragOverLineId, setDragOverLineId] = useState<string | null>(null);
  const [orderFilter, setOrderFilter] = useState<"all" | "unassigned" | "assigned">(
    "all",
  );
  const [calendarView, setCalendarView] = useState<"tiles" | "month">("tiles");
  const [skipSettings, setSkipSettings] = useState(DEFAULT_PLANNING_SKIP);
  const [selectedCompanyId, setSelectedCompanyId] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem(PLANNING_COMPANY_KEY) || "";
  });
  const [selectedGroupId, setSelectedGroupId] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem(PLANNING_GROUP_KEY) || "";
  });
  const skipLineClickRef = useRef(false);

  const [lines, setLines] = useState<ReturnType<typeof productionLineStore.getAll>>(
    [],
  );
  const [orders, setOrders] = useState<ReturnType<typeof orderBookStore.getAll>>(
    [],
  );
  const [companies, setCompanies] = useState<
    ReturnType<typeof companyStore.getAll>
  >([]);
  const [groups, setGroups] = useState<ReturnType<typeof groupStore.getAll>>(
    [],
  );
  const [sections, setSections] = useState<
    ReturnType<typeof sectionStore.getAll>
  >([]);
  const [assignments, setAssignments] = useState<
    ReturnType<typeof productionPlanStore.getAll>
  >([]);

  const refreshPlan = () => {
    setLines(productionLineStore.getAll());
    setOrders(orderBookStore.getAll());
    setCompanies(companyStore.getAll());
    setGroups(groupStore.getAll());
    setSections(sectionStore.getAll());
    setAssignments(productionPlanStore.getAll());
  };

  useEffect(() => {
    clearScheduleConfigCache();
    setConfig(calendarStore.getOrCreate(year));
  }, [year]);

  useEffect(() => {
    setSkipSettings(planningSkipStore.get());
  }, []);

  useEffect(() => {
    refreshPlan();
  }, []);

  useEffect(() => {
    if (groups.length === 0) {
      if (selectedGroupId) setSelectedGroupId("");
      return;
    }
    const selectedCompany = companies.find(
      (company) => company.id === selectedCompanyId,
    );
    if (
      selectedCompany &&
      groups.some((group) => group.id === selectedCompany.groupId)
    ) {
      if (selectedGroupId !== selectedCompany.groupId) {
        setSelectedGroupId(selectedCompany.groupId);
      }
      return;
    }
    if (groups.some((group) => group.id === selectedGroupId)) return;
    const stored =
      typeof window === "undefined"
        ? ""
        : window.localStorage.getItem(PLANNING_GROUP_KEY) || "";
    setSelectedGroupId(
      groups.some((group) => group.id === stored) ? stored : groups[0].id,
    );
  }, [groups, companies, selectedCompanyId, selectedGroupId]);

  useEffect(() => {
    if (!selectedGroupId || typeof window === "undefined") return;
    window.localStorage.setItem(PLANNING_GROUP_KEY, selectedGroupId);
  }, [selectedGroupId]);

  const groupCompanies = useMemo(
    () => companies.filter((company) => company.groupId === selectedGroupId),
    [companies, selectedGroupId],
  );

  useEffect(() => {
    if (groupCompanies.length === 0) {
      if (selectedCompanyId) {
        const belongs = companies.some(
          (company) =>
            company.id === selectedCompanyId &&
            company.groupId === selectedGroupId,
        );
        if (!belongs) setSelectedCompanyId("");
      }
      return;
    }
    if (groupCompanies.some((company) => company.id === selectedCompanyId)) {
      return;
    }
    const stored =
      typeof window === "undefined"
        ? ""
        : window.localStorage.getItem(PLANNING_COMPANY_KEY) || "";
    setSelectedCompanyId(
      groupCompanies.some((company) => company.id === stored)
        ? stored
        : groupCompanies[0].id,
    );
  }, [groupCompanies, companies, selectedCompanyId, selectedGroupId]);

  useEffect(() => {
    if (!selectedCompanyId || typeof window === "undefined") return;
    window.localStorage.setItem(PLANNING_COMPANY_KEY, selectedCompanyId);
  }, [selectedCompanyId]);

  useEffect(() => {
    setSelectedLineId(null);
    setSelectedOrderId(null);
    setSelectedAssignmentId(null);
    setSelectedDays([]);
    setLineQuery("");
    setOrderQuery("");
  }, [selectedCompanyId]);

  useEffect(() => {
    if (selectedDays.length === 0 && selectedAssignmentId) {
      setSelectedAssignmentId(null);
    }
  }, [selectedDays, selectedAssignmentId]);

  const companyName = (companyId: string) =>
    companies.find((company) => company.id === companyId)?.name || "Unavailable";

  const sectionName = (sectionId: string) =>
    sections.find((section) => section.id === sectionId)?.name || "Unavailable";

  const selectedCompany =
    companies.find((company) => company.id === selectedCompanyId) || null;
  const selectedGroup =
    groups.find((group) => group.id === selectedGroupId) || null;

  const handleGroupChange = (groupId: string) => {
    setSelectedGroupId(groupId);
    const nextCompanies = companies.filter(
      (company) => company.groupId === groupId,
    );
    setSelectedCompanyId(nextCompanies[0]?.id || "");
  };

  const companyLines = useMemo(
    () => lines.filter((line) => line.companyId === selectedCompanyId),
    [lines, selectedCompanyId],
  );

  const companyOrders = useMemo(
    () => orders.filter((order) => order.companyId === selectedCompanyId),
    [orders, selectedCompanyId],
  );

  const jobs = useMemo(
    () =>
      buildPlannedJobs(assignments, companyOrders, companyLines, skipSettings),
    [assignments, companyOrders, companyLines, skipSettings],
  );

  const jobsByOrderId = useMemo(() => {
    const map = new Map<string, PlannedJob[]>();
    jobs.forEach((job) => {
      const list = map.get(job.order.id) || [];
      list.push(job);
      map.set(job.order.id, list);
    });
    return map;
  }, [jobs]);

  const orderLegends = useMemo(() => {
    const seen = new Set<string>();
    return jobs.filter((job) => {
      if (seen.has(job.order.id)) return false;
      seen.add(job.order.id);
      return true;
    });
  }, [jobs]);

  const jobsByLineId = useMemo(() => {
    const map = new Map<string, PlannedJob[]>();
    jobs.forEach((job) => {
      const list = map.get(job.line.id) || [];
      list.push(job);
      map.set(job.line.id, list);
    });
    return map;
  }, [jobs]);

  const jobsOnSelectedDate = useMemo(
    () => jobs.filter((job) => job.dates.includes(selectedDate)),
    [jobs, selectedDate],
  );

  const filteredLines = useMemo(() => {
    const query = lineQuery.trim().toLowerCase();
    if (!query) return companyLines;
    return companyLines.filter((line) => {
      const haystack = [
        line.name,
        line.code,
        line.shift,
        companyName(line.companyId),
        sectionName(line.sectionId),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [companyLines, lineQuery, companies, sections]);

  const filteredOrders = useMemo(() => {
    const query = orderQuery.trim().toLowerCase();
    return companyOrders.filter((order) => {
      if (orderFilter === "unassigned" && jobsByOrderId.has(order.id)) {
        return false;
      }
      if (orderFilter === "assigned" && !jobsByOrderId.has(order.id)) {
        return false;
      }
      if (!query) return true;
      const planned = jobsByOrderId.get(order.id) || [];
      const haystack = [
        order.orderNo,
        order.styleNo,
        order.styleName,
        order.buyer,
        order.status,
        companyName(order.companyId),
        ...planned.map((job) => job.line.name),
        ...planned.map((job) => job.line.code),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [companyOrders, orderQuery, orderFilter, companies, jobsByOrderId]);

  const selectedHolidays = config
    ? config.holidays.filter((holiday) => holiday.date === selectedDate)
    : [];

  const jumpToDate = (date: string) => {
    const [nextYear, nextMonth] = date.split("-").map(Number);
    if (!nextYear || !nextMonth) return;
    setYear(nextYear);
    setMonth(nextMonth - 1);
    setSelectedDate(date);
  };

  const goPrevMonth = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
      return;
    }
    setMonth(month - 1);
  };

  const goNextMonth = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
      return;
    }
    setMonth(month + 1);
  };

  const startDragOrder = (event: DragEvent, orderId: string) => {
    event.dataTransfer.setData(ORDER_DRAG_TYPE, orderId);
    event.dataTransfer.setData("text/plain", orderId);
    event.dataTransfer.effectAllowed = "move";
    setDraggingOrderId(orderId);
  };

  const stopDrag = () => {
    setDraggingOrderId(null);
    setDraggingDays(false);
    setDraggingAssignmentId(null);
    setDragOverLineId(null);
  };

  const clearDaySelection = () => {
    setSelectedAssignmentId(null);
    setSelectedDays([]);
  };

  const handleToggleJobDay = (
    job: PlannedJob | null,
    date: string,
    event: { shiftKey: boolean },
  ) => {
    if (!job) {
      clearDaySelection();
      return;
    }
    setSelectedOrderId(job.order.id);
    setSelectedAssignmentId((currentAssignment) => {
      const switching = currentAssignment !== job.assignment.id;
      setSelectedDays((current) => {
        const fromThisDay = job.dates.filter((item) => item >= date);
        if (switching) return fromThisDay;
        const cut = current[0];
        if (!event.shiftKey && cut === date) return [];
        return fromThisDay;
      });
      return switching ? job.assignment.id : currentAssignment;
    });
  };

  const handleDragDaysStart = (
    job: PlannedJob,
    date: string,
    event: DragEvent,
  ) => {
    const cut =
      selectedAssignmentId === job.assignment.id && selectedDays.length > 0
        ? [date, ...selectedDays].sort()[0]
        : date;
    const dates = job.dates.filter((item) => item >= cut);
    setSelectedAssignmentId(job.assignment.id);
    setSelectedDays(dates);
    const payload: DayMovePayload = {
      assignmentId: job.assignment.id,
      orderId: job.order.id,
      dates,
    };
    event.dataTransfer.setData(DAYS_DRAG_TYPE, JSON.stringify(payload));
    event.dataTransfer.setData("text/plan-days", JSON.stringify(payload));
    event.dataTransfer.setData("text/plain", `days:${JSON.stringify(payload)}`);
    event.dataTransfer.effectAllowed = "move";
    setDraggingDays(true);
    setDraggingAssignmentId(job.assignment.id);
    setDraggingOrderId(job.order.id);
    setSelectedOrderId(job.order.id);
    setSelectedLineId(job.line.id);
  };

  const moveSelectedDays = async (
    destLineId: string,
    preferredStart: string,
    mode: "queue" | "date",
    payload: DayMovePayload,
  ) => {
    const sourceJob = jobs.find(
      (job) => job.assignment.id === payload.assignmentId,
    );
    const destLine = lines.find((line) => line.id === destLineId);
    if (!sourceJob || !destLine) {
      showErrorAlert("Missing record", "The order or production line was not found.");
      return;
    }
    if (
      sourceJob.order.companyId !== destLine.companyId ||
      destLine.companyId !== selectedCompanyId
    ) {
      showErrorAlert(
        "Different company",
        "Orders can only be moved onto production lines from the selected company.",
      );
      return;
    }
    const sameLine = sourceJob.line.id === destLineId;
    const destOutput = Number(destLine.targetOutput) || 0;
    if (destOutput <= 0) {
      showErrorAlert(
        "Daily output required",
        "Set the destination line daily output before moving days.",
      );
      return;
    }
    const cut = [...payload.dates].sort()[0];
    const dates = sourceJob.dates.filter((date) => date >= cut);
    if (dates.length === 0) {
      showErrorAlert("No days selected", "Select order days on the calendar first.");
      return;
    }
    const remainingDates = sourceJob.dates.filter((date) => date < cut);
    const movedQty = dates.reduce(
      (total, date) => total + qtyOnDate(sourceJob, date),
      0,
    );
    if (movedQty <= 0) return;

    const remainingQty = sourceJob.qty - movedQty;
    const occupancyJobs = jobsWithoutMovedSegment(
      jobs,
      sourceJob.assignment.id,
      remainingDates,
      remainingQty,
    );
    const daysNeeded = workingDaysNeeded(movedQty, destOutput);
    const startDate =
      mode === "queue"
        ? nextQueueStart(destLineId, occupancyJobs, preferredStart, undefined, skipSettings)
        : firstWorkingDate(preferredStart, skipSettings);
    const destDates = buildWorkingDates(startDate, daysNeeded, skipSettings);
    if (destDates.length === 0) {
      showErrorAlert(
        "No working days",
        "Could not find working days after weekends and holidays.",
      );
      return;
    }
    if (sameLine && destDates[0] === dates[0]) {
      return;
    }
    if (mode === "date" && jobOverlapsLine(destLineId, destDates, occupancyJobs)) {
      showErrorAlert(
        "Line already booked",
        sameLine
          ? "That production line already has an order on those days. Drop onto a free start date, or onto the line name to queue after its current orders."
          : "That production line already has an order on those days. Drop onto the line name to queue after its current orders.",
      );
      return;
    }

    const result = await fireAlert({
      icon: "question",
      title: sameLine
        ? remainingQty <= 0
          ? "Move this order?"
          : "Move days on this line?"
        : "Move days to another line?",
      text: sameLine
        ? `${sourceJob.order.orderNo}: ${formatPcs(movedQty)} · ${dates.length} day${dates.length === 1 ? "" : "s"}\n${destLine.name}\n${destDates.length} working day${destDates.length === 1 ? "" : "s"} · ${destDates[0]} → ${destDates[destDates.length - 1]}`
        : `${sourceJob.order.orderNo}: ${formatPcs(movedQty)} · ${dates.length} day${dates.length === 1 ? "" : "s"}\n${sourceJob.line.name} → ${destLine.name}\n${destDates.length} working day${destDates.length === 1 ? "" : "s"} · ${destDates[0]} → ${destDates[destDates.length - 1]}`,
      showCancelButton: true,
      confirmButtonText:
        sameLine && remainingQty <= 0 ? "Move order" : "Move days",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;

    if (sameLine && remainingQty <= 0) {
      productionPlanStore.update(sourceJob.assignment.id, {
        startDate: destDates[0],
      });
    } else {
      if (remainingQty <= 0) {
        productionPlanStore.remove(sourceJob.assignment.id);
      } else {
        productionPlanStore.update(sourceJob.assignment.id, { qty: remainingQty });
      }
      productionPlanStore.addSegment({
        orderId: sourceJob.order.id,
        lineId: destLine.id,
        startDate: destDates[0],
        qty: movedQty,
      });
    }
    refreshPlan();
    clearDaySelection();
    setSelectedLineId(destLine.id);
    setSelectedOrderId(sourceJob.order.id);
    jumpToDate(destDates[0]);
    showSuccessAlert(
      sameLine ? "Order moved" : "Days moved",
      sameLine
        ? `${sourceJob.order.orderNo} now runs ${destDates[0]} → ${destDates[destDates.length - 1]} on ${destLine.name}.`
        : `${sourceJob.order.orderNo} now also runs on ${destLine.name}, keeping the same legend colour.`,
    );
  };

  const scheduleOrder = async (
    orderId: string,
    lineId: string,
    preferredStart: string,
    mode: "queue" | "date",
  ) => {
    const order = orders.find((item) => item.id === orderId);
    const line = lines.find((item) => item.id === lineId);
    if (!order || !line) {
      showErrorAlert("Missing record", "The order or production line was not found.");
      return;
    }
    if (order.companyId !== line.companyId || line.companyId !== selectedCompanyId) {
      showErrorAlert(
        "Different company",
        "Orders can only be planned on production lines from the selected company.",
      );
      return;
    }
    if (BLOCKED_PLAN_STATUSES.has(order.status)) {
      showErrorAlert(
        "Order cannot be planned",
        `${order.orderNo || "This order"} is ${order.status}.`,
      );
      return;
    }

    const qty = Number(order.orderQty) || 0;
    const dailyOutput = Number(line.targetOutput) || 0;
    if (qty <= 0) {
      showErrorAlert(
        "Order quantity required",
        "Set the order production size before scheduling this order.",
      );
      return;
    }
    if (dailyOutput <= 0) {
      showErrorAlert(
        "Daily output required",
        "Set the production line daily output before assigning orders.",
      );
      return;
    }

    const daysNeeded = workingDaysNeeded(qty, dailyOutput);
    const startDate =
      mode === "queue"
        ? nextQueueStart(lineId, jobs, preferredStart, orderId, skipSettings)
        : firstWorkingDate(preferredStart, skipSettings);
    const dates = buildWorkingDates(startDate, daysNeeded, skipSettings);
    if (dates.length === 0) {
      showErrorAlert(
        "No working days",
        "Could not find working days after weekends and holidays.",
      );
      return;
    }

    if (mode === "date" && jobOverlapsLine(lineId, dates, jobs, orderId)) {
      showErrorAlert(
        "Line already booked",
        "This production line already has an order on those days. Drop onto the line to queue after the current order, or pick a free start date.",
      );
      return;
    }

    const endDate = dates[dates.length - 1];
    const lastDay = qty % dailyOutput || dailyOutput;
    const result = await fireAlert({
      icon: "question",
      title: "Schedule this order?",
      text: `${order.orderNo}: ${formatPcs(qty)}\n${line.name}: ${formatPcs(dailyOutput)} / day\n${dates.length} working day${dates.length === 1 ? "" : "s"} · ${dates[0]} → ${endDate}\nLast day: ${formatPcs(lastDay)}`,
      showCancelButton: true,
      confirmButtonText: "Assign to line",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;

    productionPlanStore.assign({
      orderId: order.id,
      lineId: line.id,
      startDate: dates[0],
      qty,
    });
    refreshPlan();
    setSelectedLineId(line.id);
    setSelectedOrderId(order.id);
    jumpToDate(dates[0]);
    showSuccessAlert(
      "Order scheduled",
      `${order.orderNo} will finish on ${endDate} under ${line.name}.`,
    );
  };

  const handleDropOnLine = async (lineId: string, event: DragEvent) => {
    event.preventDefault();
    skipLineClickRef.current = true;
    const daysPayload = readDaysPayload(event);
    const orderId = readDraggedOrderId(event);
    stopDrag();
    if (daysPayload) {
      await moveSelectedDays(lineId, selectedDate, "queue", daysPayload);
      return;
    }
    if (!orderId) return;
    await scheduleOrder(orderId, lineId, selectedDate, "queue");
  };

  const handleDropOnDate = async (date: string, event: DragEvent) => {
    const daysPayload = readDaysPayload(event);
    const orderId = readDraggedOrderId(event);
    stopDrag();
    if (daysPayload) {
      if (!selectedLineId) {
        showErrorAlert(
          "Select a production line",
          "Click a production line first, or drop the days onto a line.",
        );
        return;
      }
      await moveSelectedDays(selectedLineId, date, "date", daysPayload);
      return;
    }
    if (!orderId) return;
    if (!selectedLineId) {
      showErrorAlert(
        "Select a production line",
        "Click a production line first, or drop the order onto a line.",
      );
      return;
    }
    await scheduleOrder(orderId, selectedLineId, date, "date");
  };

  const handleDropOnLineDate = async (
    lineId: string,
    date: string,
    event: DragEvent,
  ) => {
    event.preventDefault();
    const daysPayload = readDaysPayload(event);
    const orderId = readDraggedOrderId(event);
    stopDrag();
    if (daysPayload) {
      setSelectedLineId(lineId);
      await moveSelectedDays(lineId, date, "date", daysPayload);
      return;
    }
    if (!orderId) return;
    setSelectedLineId(lineId);
    await scheduleOrder(orderId, lineId, date, "date");
  };

  const handleUnassign = (orderId: string) => {
    productionPlanStore.removeByOrderId(orderId);
    refreshPlan();
    clearDaySelection();
  };

  const handleUnassignSegment = (assignmentId: string) => {
    productionPlanStore.remove(assignmentId);
    refreshPlan();
    if (selectedAssignmentId === assignmentId) clearDaySelection();
  };

  const handleDropUnassign = (event: DragEvent) => {
    event.preventDefault();
    const orderId = readDraggedOrderId(event);
    stopDrag();
    if (!orderId || !jobsByOrderId.has(orderId)) return;
    handleUnassign(orderId);
  };

  const dayExtras = useMemo(() => {
    const extras: Record<string, ReactNode> = {};
    const byDate = new Map<string, PlannedJob[]>();
    jobs.forEach((job) => {
      job.dates.forEach((date) => {
        const list = byDate.get(date) || [];
        list.push(job);
        byDate.set(date, list);
      });
    });
    byDate.forEach((dayJobs, date) => {
      extras[date] = (
        <div className="flex w-full flex-wrap items-center gap-0.5">
          {dayJobs.slice(0, 4).map((job) => (
            <span
              key={job.assignment.id}
              className={`relative h-1.5 min-w-3 flex-1 overflow-hidden rounded-full ${job.color.bar}`}
              title={`${job.order.orderNo} · ${job.line.name}`}
            >
              <span className="plan-bar-sweep" aria-hidden />
            </span>
          ))}
        </div>
      );
    });
    return extras;
  }, [jobs]);

  if (!config) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="Production Planning Board" />
        <p className="mt-6 text-sm text-bodydark2">Loading calendar...</p>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Production Planning Board" />

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="flex flex-col gap-3 rounded-2xl border border-stroke bg-white px-4 py-3 shadow-sm dark:border-strokedark dark:bg-boxdark">
          <div className="flex min-w-0 items-center gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Network className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wide text-bodydark2">
                Group
              </p>
              <p className="truncate text-sm font-bold text-black dark:text-white">
                {selectedGroup
                  ? `${selectedGroup.name} (${selectedGroup.code})`
                  : groups.length === 0
                    ? "No groups available"
                    : "Select a group"}
              </p>
              <p className="truncate text-xs text-bodydark2">
                {selectedGroup
                  ? `${groupCompanies.length} compan${groupCompanies.length === 1 ? "y" : "ies"} in this group`
                  : "Choose a group first"}
              </p>
            </div>
          </div>
          {groups.length === 0 ? (
            <Link
              href="/manage/add-group"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
            >
              Add group
            </Link>
          ) : (
            <div className="relative">
              <select
                value={selectedGroupId}
                onChange={(event) => handleGroupChange(event.target.value)}
                className="w-full cursor-pointer appearance-none rounded-lg border-[1.5px] border-stroke bg-transparent py-2.5 pl-4 pr-11 text-sm font-semibold text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                aria-label="Select group"
              >
                {!groups.some((group) => group.id === selectedGroupId) ? (
                  <option value={selectedGroupId} disabled>
                    Select a group
                  </option>
                ) : null}
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name} ({group.code})
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bodydark2" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-stroke bg-white px-4 py-3 shadow-sm dark:border-strokedark dark:bg-boxdark">
          <div className="flex min-w-0 items-center gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wide text-bodydark2">
                Company
              </p>
              <p className="truncate text-sm font-bold text-black dark:text-white">
                {selectedCompany
                  ? `${selectedCompany.name} (${selectedCompany.code})`
                  : groupCompanies.length === 0
                    ? "No companies in this group"
                    : "Select a company"}
              </p>
              <p className="truncate text-xs text-bodydark2">
                {selectedCompany
                  ? `${selectedCompany.location || "No location"} · ${companyLines.length} line${companyLines.length === 1 ? "" : "s"} · ${companyOrders.length} order${companyOrders.length === 1 ? "" : "s"}`
                  : "Lines and orders load for the selected factory"}
              </p>
            </div>
          </div>
          {groupCompanies.length === 0 ? (
            <Link
              href="/manage/add-company"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
            >
              Add company
            </Link>
          ) : (
            <div className="relative">
              <select
                value={selectedCompanyId}
                onChange={(event) => setSelectedCompanyId(event.target.value)}
                className="w-full cursor-pointer appearance-none rounded-lg border-[1.5px] border-stroke bg-transparent py-2.5 pl-4 pr-11 text-sm font-semibold text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                aria-label="Select company"
              >
                {!groupCompanies.some(
                  (company) => company.id === selectedCompanyId,
                ) ? (
                  <option value={selectedCompanyId} disabled>
                    Select a company
                  </option>
                ) : null}
                {groupCompanies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name} ({company.code})
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bodydark2" />
            </div>
          )}
        </div>
      </div>

      {!selectedCompanyId ? (
        <p className="mt-4 rounded-2xl border border-dashed border-stroke px-4 py-10 text-center text-sm text-bodydark2 dark:border-strokedark">
          {groups.length === 0
            ? "Add a group first, then add a company to plan production."
            : groupCompanies.length === 0
              ? "This group has no companies. Add a company, then open its planning board."
              : "Select a company to open its planning board."}
        </p>
      ) : (
        <div
          key={selectedCompanyId}
          className="mt-4 grid grid-cols-1 gap-2 xl:grid-cols-[240px_minmax(0,1fr)_250px] 2xl:grid-cols-[260px_minmax(0,1fr)_270px]"
        >
        <aside className="flex flex-col overflow-hidden rounded-2xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark xl:h-0 xl:min-h-full">
          <div className="shrink-0 border-b border-stroke px-4 py-4 dark:border-strokedark">
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Factory className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-black dark:text-white">
                  Production Lines
                </h2>
                <p className="text-xs text-bodydark2">
                  {filteredLines.length} line
                  {filteredLines.length === 1 ? "" : "s"} · {selectedCompany?.code || "company"}
                </p>
              </div>
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bodydark2" />
              <input
                type="text"
                value={lineQuery}
                onChange={(e) => setLineQuery(e.target.value)}
                placeholder="Search lines"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 pl-9 pr-3 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
              />
            </div>
          </div>
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
            {filteredLines.length === 0 ? (
              <p className="rounded-xl border border-dashed border-stroke px-3 py-8 text-center text-sm text-bodydark2 dark:border-strokedark">
                No production lines for this company.
              </p>
            ) : (
              filteredLines.map((line) => {
                const active = selectedLineId === line.id;
                const lineColor = colorForLine(
                  line.id,
                  companyLines.findIndex((item) => item.id === line.id),
                );
                const lineJobs = jobsByLineId.get(line.id) || [];
                const dailyOutput = Number(line.targetOutput) || 0;
                const isDropTarget = dragOverLineId === line.id && Boolean(draggingOrderId);
                return (
                  <div
                    key={line.id}
                    onClick={() => {
                      if (skipLineClickRef.current) {
                        skipLineClickRef.current = false;
                        setSelectedLineId(line.id);
                        return;
                      }
                      setSelectedLineId((current) =>
                        current === line.id ? null : line.id,
                      );
                    }}
                    onDragOver={(event) => {
                      event.preventDefault();
                      event.dataTransfer.dropEffect = "move";
                      setDragOverLineId(line.id);
                    }}
                    onDragLeave={() =>
                      setDragOverLineId((current) =>
                        current === line.id ? null : current,
                      )
                    }
                    onDrop={(event) => handleDropOnLine(line.id, event)}
                    className={`flex cursor-pointer gap-2 rounded-xl border px-3 py-3 text-left transition ${
                      isDropTarget
                        ? "border-primary bg-primary/10 shadow-sm"
                        : active
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-stroke hover:border-primary/40 dark:border-strokedark"
                    }`}
                  >
                    <span
                      className={`plan-accent-bar w-1.5 shrink-0 self-stretch rounded-full ${lineColor.bar}`}
                    />
                    <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <p className="truncate text-sm font-semibold text-black dark:text-white">
                          {line.name || "Unavailable"}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-gray-2 px-2 py-0.5 text-[10px] font-semibold text-bodydark2 dark:bg-meta-4">
                        {line.code || "—"}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-xs text-bodydark2">
                      {companyName(line.companyId)} · {sectionName(line.sectionId)}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        {dailyOutput > 0
                          ? `${formatPcs(dailyOutput)} / day`
                          : "No daily output"}
                      </span>
                      <span className="rounded-full bg-gray-2 px-2 py-0.5 text-[10px] font-semibold text-bodydark2 dark:bg-meta-4">
                        {line.shift || "No shift"}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {lineJobs.length === 0 ? (
                        <span className="text-[10px] text-bodydark2">
                          Drop an order to add a tile
                        </span>
                      ) : (
                        lineJobs.map((job) => (
                          <span
                            key={job.assignment.id}
                            className={`inline-flex max-w-full items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white ${job.color.bar}`}
                            title={`${job.order.orderNo} · ${job.startDate} → ${job.endDate}`}
                          >
                            <span className="truncate">{job.order.orderNo}</span>
                            <button
                              type="button"
                              title="Remove from line"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleUnassignSegment(job.assignment.id);
                              }}
                              className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white/20 hover:bg-white/40"
                            >
                              <X className="h-2.5 w-2.5" />
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        <section className="flex h-fit flex-col self-start rounded-2xl border border-stroke bg-white p-4 shadow-sm dark:border-strokedark dark:bg-boxdark md:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-black dark:text-white">
                Planning Calendar
              </h2>
              <p className="text-xs text-bodydark2">
                {draggingOrderId || draggingDays
                  ? "Drop on a date box to start from that day, including on the same line, or on a line name to queue"
                  : `${selectedCompany?.name || "Company"} · ${config.name} · ${selectedDate}${
                      selectedLineId
                        ? ` · ${companyLines.find((line) => line.id === selectedLineId)?.name || "line"}`
                        : ""
                    }`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden flex-wrap gap-1.5 sm:flex">
              {HOLIDAY_TYPES.slice(0, 4).map((type) => {
                const colors = HOLIDAY_COLORS[type];
                return (
                  <span
                    key={type}
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${colors.bg} ${colors.text}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
                    {type}
                  </span>
                );
              })}
              </div>
              <CalendarSkipSettings
                value={skipSettings}
                onChange={(next) => {
                  setSkipSettings(planningSkipStore.save(next));
                  clearScheduleConfigCache();
                }}
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-full bg-gray-2 p-1 dark:bg-meta-4">
              <button
                type="button"
                onClick={() => setCalendarView("tiles")}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                  calendarView === "tiles"
                    ? "bg-primary text-white shadow-sm"
                    : "text-bodydark2 hover:text-black dark:hover:text-white"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                Line tiles
              </button>
              <button
                type="button"
                onClick={() => setCalendarView("month")}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                  calendarView === "month"
                    ? "bg-primary text-white shadow-sm"
                    : "text-bodydark2 hover:text-black dark:hover:text-white"
                }`}
              >
                <CalendarDays className="h-3.5 w-3.5" />
                Month calendar
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrevMonth}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stroke dark:border-strokedark"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <h3 className="min-w-36 text-center text-sm font-bold text-black dark:text-white">
                {MONTH_LABELS[month]} {year}
              </h3>
              <button
                type="button"
                onClick={goNextMonth}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stroke dark:border-strokedark"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {calendarView === "tiles" ? (
            <PlanningTimeline
              year={year}
              month={month}
              config={config}
              lines={filteredLines}
              jobs={jobs}
              skipSettings={skipSettings}
              selectedDate={selectedDate}
              selectedLineId={selectedLineId}
              selectedAssignmentId={selectedAssignmentId}
              selectedDays={selectedDays}
              dragging={Boolean(draggingOrderId || draggingDays)}
              draggingOrderId={draggingOrderId}
              draggingAssignmentId={draggingAssignmentId}
              draggingOrderQty={
                draggingOrderId && !draggingDays
                  ? Number(
                      orders.find((order) => order.id === draggingOrderId)
                        ?.orderQty,
                    ) || 0
                  : 0
              }
              draggingDayCount={draggingDays ? selectedDays.length : 0}
              onSelectDate={setSelectedDate}
              onSelectLine={setSelectedLineId}
              onToggleJobDay={handleToggleJobDay}
              onDragDaysStart={handleDragDaysStart}
              onDropLine={handleDropOnLine}
              onDropDate={handleDropOnLineDate}
            />
          ) : (
            <CalendarMonthView
              year={year}
              month={month}
              config={config}
              selectedDate={selectedDate}
              skipSettings={skipSettings}
              compact
              showNav={false}
              onSelectDate={setSelectedDate}
              onMonthChange={(nextYear, nextMonth) => {
                setYear(nextYear);
                setMonth(nextMonth);
              }}
              onDropDate={handleDropOnDate}
              dayExtras={dayExtras}
            />
          )}

          <div className="mt-4 space-y-3">
            {jobs.some(
              (job) =>
                job.order.deliveryDate && job.endDate > job.order.deliveryDate,
            ) ? (
              <p className="rounded-xl border border-amber-300/70 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-900/20 dark:text-amber-200">
                An order runs past its delivery date. Click the first extra day
                — that day and every later box will be selected. Drag them onto
                a later date on this line, or onto another production line. The
                order keeps the same legend colour.
              </p>
            ) : null}
            {selectedDays.length > 0 ? (
              <p className="rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 text-xs text-primary">
                {selectedDays.length} day{selectedDays.length === 1 ? "" : "s"}{" "}
                from {selectedDays[0]} onward selected. Drag onto a new date on
                this line, or onto another line to move this tail of the order.
              </p>
            ) : null}
            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-bodydark2">
                Order colour legend
              </p>
              {orderLegends.length === 0 ? (
                <p className="rounded-xl border border-dashed border-stroke px-3 py-2 text-xs text-bodydark2 dark:border-strokedark">
                  Assigned orders each get a colour here. Calendar boxes use
                  that same order colour on every production line.
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {orderLegends.map((job) => {
                    const segments = jobsByOrderId.get(job.order.id) || [];
                    const lineCodes = Array.from(
                      new Set(
                        segments.map(
                          (segment) => segment.line.code || segment.line.name,
                        ),
                      ),
                    ).join(", ");
                    return (
                      <button
                        key={job.order.id}
                        type="button"
                        onClick={() => {
                          setSelectedLineId(job.line.id);
                          setSelectedOrderId(job.order.id);
                          jumpToDate(job.startDate);
                        }}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${job.color.border} ${job.color.bg} ${job.color.text}`}
                      >
                        <span className={`h-2 w-2 rounded-full ${job.color.dot}`} />
                        {job.order.orderNo}
                        {lineCodes ? ` · ${lineCodes}` : ""}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {selectedHolidays.length > 0 || jobsOnSelectedDate.length > 0 ? (
              <div className="rounded-xl border border-dashed border-stroke px-3 py-2 text-xs text-bodydark2 dark:border-strokedark">
                {selectedHolidays.length > 0 ? (
                  <p>
                    Holiday:{" "}
                    {selectedHolidays.map((holiday) => holiday.name).join(", ")}
                  </p>
                ) : null}
                {jobsOnSelectedDate.length > 0 ? (
                  <div className={selectedHolidays.length > 0 ? "mt-2 space-y-1" : "space-y-1"}>
                    {jobsOnSelectedDate.map((job) => (
                      <p key={job.assignment.id}>
                        {job.order.orderNo} on {job.line.name}:{" "}
                        {formatPcs(qtyOnDate(job, selectedDate))}
                        {selectedDate === job.endDate ? " · ends today" : ""}
                        {selectedDate === job.startDate ? " · starts today" : ""}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>

        <aside className="flex flex-col overflow-hidden rounded-2xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark xl:h-0 xl:min-h-full">
          <div className="shrink-0 border-b border-stroke px-4 py-4 dark:border-strokedark">
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ClipboardList className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-black dark:text-white">
                  Orders
                </h2>
                <p className="text-xs text-bodydark2">
                  {filteredOrders.length} order
                  {filteredOrders.length === 1 ? "" : "s"} · {selectedCompany?.code || "company"}
                </p>
              </div>
            </div>
            <div className="mb-2 flex gap-1">
              {(["all", "unassigned", "assigned"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setOrderFilter(value)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                    orderFilter === value
                      ? "bg-primary text-white"
                      : "bg-gray-2 text-bodydark2 dark:bg-meta-4"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bodydark2" />
              <input
                type="text"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="Search orders"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 pl-9 pr-3 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
              />
            </div>
          </div>
          <div
            className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3"
            onDragOver={(event) => {
              if (!draggingOrderId) return;
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
            }}
            onDrop={handleDropUnassign}
          >
            {filteredOrders.length === 0 ? (
              <p className="rounded-xl border border-dashed border-stroke px-3 py-8 text-center text-sm text-bodydark2 dark:border-strokedark">
                No orders for this company.
              </p>
            ) : (
              filteredOrders.map((order) => {
                const active = selectedOrderId === order.id;
                const plannedJobs = jobsByOrderId.get(order.id) || [];
                const planned = plannedJobs[0];
                const qty = Number(order.orderQty) || 0;
                const orderColor =
                  planned?.color ||
                  colorForOrder(
                    order.id,
                    companyOrders.findIndex((item) => item.id === order.id),
                  );
                return (
                  <div
                    key={order.id}
                    draggable={!BLOCKED_PLAN_STATUSES.has(order.status)}
                    onDragStart={(event) => startDragOrder(event, order.id)}
                    onDragEnd={stopDrag}
                    onClick={() => {
                      setSelectedOrderId((current) =>
                        current === order.id ? null : order.id,
                      );
                      if (planned) {
                        setSelectedLineId(planned.line.id);
                        jumpToDate(planned.startDate);
                        return;
                      }
                      if (order.deliveryDate) jumpToDate(order.deliveryDate);
                    }}
                    className={`flex w-full cursor-grab gap-2 rounded-xl border px-3 py-3 text-left transition active:cursor-grabbing ${
                      active
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-stroke hover:border-primary/40 dark:border-strokedark"
                    }`}
                  >
                    <span
                      className={`plan-accent-bar w-1.5 shrink-0 self-stretch rounded-full ${orderColor.bar}`}
                    />
                    <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <GripVertical className="h-4 w-4 shrink-0 text-bodydark2" />
                        <p
                          className={`truncate text-sm font-semibold ${orderColor.text}`}
                        >
                          {order.orderNo || "Unavailable"}
                        </p>
                      </div>
                      {order.status ? (
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusClass(
                            order.status,
                          )}`}
                        >
                          {order.status}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 truncate text-xs text-bodydark2">
                      {order.styleNo || "No style"}
                      {order.styleName ? ` · ${order.styleName}` : ""}
                    </p>
                    <p className="mt-1 truncate text-xs text-bodydark2">
                      {order.buyer || "No buyer"} · {companyName(order.companyId)}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2 text-[11px] font-semibold text-bodydark2">
                      <span>{qty > 0 ? formatPcs(qty) : "No qty"}</span>
                      <span>{order.deliveryDate || "No date"}</span>
                    </div>
                    {plannedJobs.length > 0 ? (
                      <div className="mt-2 space-y-1.5">
                        {plannedJobs.map((job) => (
                          <div
                            key={job.assignment.id}
                            className={`rounded-lg border px-2 py-1.5 ${job.color.border} ${job.color.bg}`}
                          >
                            <p className={`text-[11px] font-bold ${job.color.text}`}>
                              {job.line.name}
                            </p>
                            <p className="text-[10px] text-bodydark2">
                              {job.startDate} → {job.endDate} · {job.workingDays}{" "}
                              day{job.workingDays === 1 ? "" : "s"}
                              {job.order.deliveryDate &&
                              job.endDate > job.order.deliveryDate
                                ? " · after delivery"
                                : ""}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>
        </div>
      )}
    </DefaultLayout>
  );
}

export default withAuth(ProductionPlanningBoard);
