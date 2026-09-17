"use client";
import { useMemo, useState } from "react";
import { Employee } from "@/utils/localStore";
import { GripVertical, Plus, Search, Trash2, User } from "lucide-react";

function employeeLabel(employee: Employee) {
  return `${employee.title ? `${employee.title}. ` : ""}${employee.firstName} ${employee.lastName}`.trim();
}

function matchesEmployeeSearch(employee: Employee, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;

  const name = employeeLabel(employee).toLowerCase();
  const employeeId = (employee.employeeNo || "").toLowerCase();
  const designation = (employee.role || "").toLowerCase();

  return (
    name.includes(needle) ||
    employeeId.includes(needle) ||
    designation.includes(needle)
  );
}

function EmployeeCard({
  employee,
  disabled,
  action,
  onAction,
}: {
  employee: Employee;
  disabled?: boolean;
  action: "assign" | "remove";
  onAction: () => void;
}) {
  return (
    <div
      draggable={!disabled}
      onDragStart={(e) => {
        if (disabled) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.setData("text/employee-id", employee.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      className={`flex items-center gap-3 rounded-xl border border-stroke bg-white px-3 py-2 shadow-sm dark:border-strokedark dark:bg-boxdark ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : "cursor-grab active:cursor-grabbing"
      }`}
    >
      <GripVertical className="h-4 w-4 shrink-0 text-bodydark2" />
      {employee.image ? (
        <img
          src={employee.image}
          alt={employeeLabel(employee)}
          className="h-9 w-9 shrink-0 rounded-full object-cover"
        />
      ) : (
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User className="h-4 w-4" />
        </span>
      )}
      <div className="min-w-0 flex-1 text-left">
        <p className="truncate text-sm font-semibold text-black dark:text-white">
          {employeeLabel(employee) || "Unavailable"}
        </p>
        <p className="truncate text-xs text-bodydark2">
          {employee.employeeNo || "No emp no"}
          {employee.role ? ` • ${employee.role}` : ""}
        </p>
      </div>
      <button
        type="button"
        disabled={disabled}
        title={action === "assign" ? "Assign" : "Remove"}
        aria-label={action === "assign" ? "Assign employee" : "Remove employee"}
        onClick={(e) => {
          e.stopPropagation();
          onAction();
        }}
        onMouseDown={(e) => e.stopPropagation()}
        className={`ml-auto inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
          action === "assign"
            ? "bg-primary/15 text-primary hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-primary/15 disabled:hover:text-primary"
            : "bg-danger/15 text-danger hover:bg-danger hover:text-white"
        }`}
      >
        {action === "assign" ? (
          <Plus className="h-4 w-4" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

interface EmployeeAssignBoardProps {
  availableEmployees: Employee[];
  assignedEmployees: Employee[];
  assignedIds: string[];
  maxCount: number;
  onChange: (employeeIds: string[]) => void;
  onLimitReached?: () => void;
}

export default function EmployeeAssignBoard({
  availableEmployees,
  assignedEmployees,
  assignedIds,
  maxCount,
  onChange,
  onLimitReached,
}: EmployeeAssignBoardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const canAssignMore = maxCount > 0 && assignedIds.length < maxCount;
  const assignDisabled = maxCount <= 0 || !canAssignMore;

  const filteredAvailableEmployees = useMemo(
    () =>
      availableEmployees.filter((employee) =>
        matchesEmployeeSearch(employee, searchQuery),
      ),
    [availableEmployees, searchQuery],
  );

  const assignEmployee = (employeeId: string) => {
    if (assignedIds.includes(employeeId)) return;
    if (maxCount <= 0 || assignedIds.length >= maxCount) {
      onLimitReached?.();
      return;
    }
    onChange([...assignedIds, employeeId]);
  };

  const unassignEmployee = (employeeId: string) => {
    onChange(assignedIds.filter((id) => id !== employeeId));
  };

  const handleDropAssign = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (assignDisabled) {
      onLimitReached?.();
      return;
    }
    const employeeId = e.dataTransfer.getData("text/employee-id");
    if (employeeId) assignEmployee(employeeId);
  };

  const handleDropUnassign = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const employeeId = e.dataTransfer.getData("text/employee-id");
    if (employeeId) unassignEmployee(employeeId);
  };

  return (
    <div className="mb-4.5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-black dark:text-white">
          Assign Employees
        </h4>
        <p className="text-sm font-medium text-black dark:text-white">
          Assigned:{" "}
          <span className="text-primary">
            {assignedEmployees.length} / {maxCount || 0}
          </span>
        </p>
      </div>

      {maxCount <= 0 ? (
        <p className="mb-3 rounded-xl border border-stroke bg-gray-2 px-4 py-3 text-sm text-bodydark2 dark:border-strokedark dark:bg-meta-4">
          Set Employee Count first to enable employee assignment.
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropUnassign}
          className="rounded-2xl border border-dashed border-stroke bg-gray-2 p-3 dark:border-strokedark dark:bg-meta-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-black dark:text-white">
              Available Employees
            </p>
            <span className="text-xs text-bodydark2">
              {searchQuery.trim()
                ? `${filteredAvailableEmployees.length} / ${availableEmployees.length}`
                : availableEmployees.length}
            </span>
          </div>
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bodydark2" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
              placeholder="Search name, employee ID or designation"
              aria-label="Search available employees by name, employee ID or designation"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
          </div>
          <div className="flex max-h-80 min-h-60 flex-col gap-2 overflow-y-auto">
            {availableEmployees.length === 0 ? (
              <p className="py-8 text-center text-sm text-bodydark2">
                No available employees
              </p>
            ) : filteredAvailableEmployees.length === 0 ? (
              <p className="py-8 text-center text-sm text-bodydark2">
                No employees match this search
              </p>
            ) : (
              filteredAvailableEmployees.map((employee) => (
                <EmployeeCard
                  key={employee.id}
                  employee={employee}
                  disabled={assignDisabled}
                  action="assign"
                  onAction={() => assignEmployee(employee.id)}
                />
              ))
            )}
          </div>
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropAssign}
          className={`rounded-2xl border border-dashed p-3 ${
            assignDisabled
              ? "border-stroke bg-gray-2 dark:border-strokedark dark:bg-meta-4"
              : "border-primary/40 bg-primary/5 dark:bg-primary/10"
          }`}
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-black dark:text-white">
              Assigned to Production Line
            </p>
            <span className="text-xs text-bodydark2">
              {assignedEmployees.length}
            </span>
          </div>
          <div className="flex max-h-80 min-h-60 flex-col gap-2 overflow-y-auto">
            {assignedEmployees.length === 0 ? (
              <p className="py-8 text-center text-sm text-bodydark2">
                {maxCount <= 0
                  ? "Define employee count first"
                  : "Drag employees here to assign"}
              </p>
            ) : (
              assignedEmployees.map((employee) => (
                <EmployeeCard
                  key={employee.id}
                  employee={employee}
                  action="remove"
                  onAction={() => unassignEmployee(employee.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
