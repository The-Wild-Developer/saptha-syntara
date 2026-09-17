"use client";
import { useEffect, useState } from "react";
import withAuth from "@/utils/withAuth";
import ViewTable from "@/components/common/ViewTable";
import { companyStore, employeeStore } from "@/utils/localStore";

const TITLE_OPTIONS = [
  { value: "Mr", label: "Mr" },
  { value: "Mrs", label: "Mrs" },
  { value: "Ms", label: "Ms" },
  { value: "Miss", label: "Miss" },
  { value: "Dr", label: "Dr" },
  { value: "Prof", label: "Prof" },
];

const ROLE_OPTIONS = [
  { value: "Operator", label: "Operator" },
  { value: "Supervisor", label: "Supervisor" },
  { value: "Manager", label: "Manager" },
  { value: "Quality Inspector", label: "Quality Inspector" },
  { value: "Technician", label: "Technician" },
  { value: "Admin", label: "Admin" },
  { value: "HR", label: "HR" },
  { value: "Accountant", label: "Accountant" },
];

const DEPARTMENT_OPTIONS = [
  { value: "Production", label: "Production" },
  { value: "Quality", label: "Quality" },
  { value: "Maintenance", label: "Maintenance" },
  { value: "HR", label: "HR" },
  { value: "Finance", label: "Finance" },
  { value: "Stores", label: "Stores" },
  { value: "Merchandising", label: "Merchandising" },
  { value: "IT", label: "IT" },
];

const STATUS_OPTIONS = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

function getInitials(firstName?: string, lastName?: string) {
  const first = firstName?.trim().charAt(0) || "";
  const last = lastName?.trim().charAt(0) || "";
  return `${first}${last}`.toUpperCase() || "U";
}

function EmployeeAvatar({
  image,
  firstName,
  lastName,
  size = "sm",
}: {
  image?: string;
  firstName?: string;
  lastName?: string;
  size?: "sm" | "lg";
}) {
  const [failed, setFailed] = useState(false);
  const sizeClass =
    size === "lg"
      ? "h-28 w-28 min-h-28 min-w-28 max-h-28 max-w-28"
      : "h-10 w-10 min-h-10 min-w-10 max-h-10 max-w-10";
  const textClass = size === "lg" ? "text-3xl" : "text-sm";
  const initials = getInitials(firstName, lastName);
  const name = [firstName, lastName].filter(Boolean).join(" ");

  if (!image || failed) {
    return (
      <span
        className={`inline-flex shrink-0 ${sizeClass} items-center justify-center overflow-hidden rounded-full bg-primary font-semibold text-white ${textClass}`}
      >
        {initials}
      </span>
    );
  }

  return (
    <img
      src={image}
      alt={name}
      onError={() => setFailed(true)}
      className={`shrink-0 ${sizeClass} rounded-full object-cover`}
    />
  );
}

function ViewEmployees() {
  const [employees, setEmployees] = useState<
    ReturnType<typeof employeeStore.getAll>
  >([]);
  const [companies, setCompanies] = useState<
    ReturnType<typeof companyStore.getAll>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setEmployees(employeeStore.getAll());
    setCompanies(companyStore.getAll());
    setLoading(false);
  }, []);

  const companyName = (companyId: string) =>
    companies.find((company) => company.id === companyId)?.name || "";

  const formatTitle = (title?: string) => {
    if (!title) return "";
    return title.endsWith(".") ? title : `${title}.`;
  };

  const fullName = (row: {
    title?: string;
    firstName: string;
    lastName: string;
  }) =>
    [formatTitle(row.title), row.firstName, row.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

  return (
    <ViewTable
      pageName="View Employees"
      modalTitle="View Employee"
      rows={employees}
      loading={loading}
      columns={[
        {
          key: "name",
          header: "Name",
          render: (row) => (
            <div className="flex items-center gap-3">
              <EmployeeAvatar
                image={row.image}
                firstName={row.firstName}
                lastName={row.lastName}
              />
              <span className="min-w-0">{fullName(row) || "Unavailable"}</span>
            </div>
          ),
        },
        { key: "employeeNo", header: "Emp No", render: (row) => row.employeeNo || "Unavailable" },
        {
          key: "companyId",
          header: "Company",
          render: (row) => companyName(row.companyId) || "Unavailable",
        },
        {
          key: "phone",
          header: "Phone",
          render: (row) => row.phone || "Unavailable",
        },
        {
          key: "status",
          header: "Status",
          render: (row) => (
            <div className="flex justify-center">
              {row.status ? (
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    row.status === "Active"
                      ? "bg-success/10 text-success"
                      : "bg-danger/10 text-danger"
                  }`}
                >
                  {row.status}
                </span>
              ) : (
                "Unavailable"
              )}
            </div>
          ),
        },
      ]}
      getCellValue={(row, key) => {
        if (key === "name") return fullName(row) || "Unavailable";
        return String(row[key as keyof typeof row] || "Unavailable");
      }}
      getSortValue={(row, key) => {
        if (key === "name") return fullName(row);
        if (key === "companyId") return companyName(row.companyId);
        return String(row[key as keyof typeof row] || "");
      }}
      getViewFields={(row) => [
        {
          label: "Profile Picture",
          center: true,
          value: (
            <EmployeeAvatar
              image={row.image}
              firstName={row.firstName}
              lastName={row.lastName}
              size="lg"
            />
          ),
        },
        { label: "Title", value: row.title || "Unavailable" },
        { label: "First Name", value: row.firstName || "Unavailable" },
        { label: "Last Name", value: row.lastName || "Unavailable" },
        { label: "Company", value: companyName(row.companyId) || "Unavailable" },
        { label: "Employee No", value: row.employeeNo || "Unavailable" },
        { label: "Role", value: row.role || "Unavailable" },
        { label: "Department", value: row.department || "Unavailable" },
        { label: "Phone", value: row.phone || "Unavailable" },
        { label: "Email", value: row.email || "Unavailable" },
        { label: "Date of Birth", value: row.dateOfBirth || "Unavailable" },
        { label: "Status", value: row.status || "Unavailable" },
      ]}
      editFields={[
        { key: "image", label: "Profile Picture", as: "image" },
        {
          key: "title",
          label: "Title",
          required: true,
          as: "select",
          options: TITLE_OPTIONS,
        },
        { key: "firstName", label: "First Name", required: true },
        { key: "lastName", label: "Last Name", required: true },
        {
          key: "companyId",
          label: "Company",
          required: true,
          as: "select",
          options: companies.map((company) => ({
            value: company.id,
            label: `${company.name} (${company.code})`,
          })),
        },
        { key: "employeeNo", label: "Employee No", required: true },
        { key: "role", label: "Role", required: true, as: "select", options: ROLE_OPTIONS },
        {
          key: "department",
          label: "Department",
          as: "select",
          options: DEPARTMENT_OPTIONS,
        },
        { key: "phone", label: "Phone", required: true },
        { key: "email", label: "Email", type: "email", required: true },
        { key: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
        {
          key: "status",
          label: "Status",
          required: true,
          as: "select",
          options: STATUS_OPTIONS,
        },
      ]}
      onUpdate={(row) => {
        employeeStore.update(row.id, row);
        setEmployees(employeeStore.getAll());
      }}
      onDelete={(row) => {
        employeeStore.remove(row.id);
        setEmployees(employeeStore.getAll());
      }}
    />
  );
}

export default withAuth(ViewEmployees);
