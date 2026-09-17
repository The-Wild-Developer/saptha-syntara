"use client";
import { useEffect, useMemo, useState } from "react";
import withAuth from "@/utils/withAuth";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DataLoader from "@/components/common/DataLoader";
import FormField from "@/components/common/FormField";
import Pagination from "@/components/Pagination/page";
import EmployeeAssignBoard from "@/components/production-line/EmployeeAssignBoard";
import {
  companyStore,
  employeeStore,
  ProductionLine,
  productionLineStore,
  sectionStore,
} from "@/utils/localStore";
import {
  showDeleteConfirmAlert,
  showErrorAlert,
  showSuccessAlert,
} from "@/utils/alert";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  FilePenLine,
  Save,
  Trash2,
  X,
} from "lucide-react";

const PAGE_SIZE = 10;

function ViewProductionLine() {
  const [lines, setLines] = useState<ProductionLine[]>([]);
  const [companies, setCompanies] = useState<
    ReturnType<typeof companyStore.getAll>
  >([]);
  const [sections, setSections] = useState<
    ReturnType<typeof sectionStore.getAll>
  >([]);
  const [employees, setEmployees] = useState<
    ReturnType<typeof employeeStore.getAll>
  >([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("ASC");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");
  const [selected, setSelected] = useState<ProductionLine | null>(null);
  const [editForm, setEditForm] = useState<ProductionLine | null>(null);

  const refresh = () => {
    setLines(productionLineStore.getAll());
    setCompanies(companyStore.getAll());
    setSections(sectionStore.getAll());
    setEmployees(employeeStore.getAll());
  };

  useEffect(() => {
    refresh();
    setLoading(false);
  }, []);

  const companyName = (companyId: string) =>
    companies.find((company) => company.id === companyId)?.name || "Unavailable";

  const sectionName = (sectionId: string) =>
    sections.find((section) => section.id === sectionId)?.name || "Unavailable";

  const employeeName = (employeeId: string) => {
    const employee = employees.find((item) => item.id === employeeId);
    if (!employee) return "Unavailable";
    return `${employee.firstName} ${employee.lastName}`.trim() || "Unavailable";
  };

  const getSortValue = (row: ProductionLine, key: string) => {
    if (key === "companyId") return companyName(row.companyId);
    if (key === "sectionId") return sectionName(row.sectionId);
    if (key === "employeeCount") {
      return String(row.employeeCount || row.employeeIds?.length || 0);
    }
    if (key === "code") return row.code || "";
    if (key === "name") return row.name || "";
    if (key === "shift") return row.shift || "";
    return "";
  };

  const sortedRows = useMemo(() => {
    if (!sortColumn) return lines;
    return [...lines].sort((a, b) => {
      const left = getSortValue(a, sortColumn).toLowerCase();
      const right = getSortValue(b, sortColumn).toLowerCase();
      if (left < right) return sortDirection === "ASC" ? -1 : 1;
      if (left > right) return sortDirection === "ASC" ? 1 : -1;
      return 0;
    });
  }, [lines, sortColumn, sortDirection, companies, sections]);

  const totalRecords = sortedRows.length;
  const currentPage = Math.min(page, Math.max(0, Math.ceil(totalRecords / pageSize) - 1));
  const pagedRows = sortedRows.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize,
  );

  const companySections = useMemo(
    () =>
      sections.filter(
        (section) => section.companyId === (editForm?.companyId || ""),
      ),
    [sections, editForm?.companyId],
  );

  const companyEmployees = useMemo(
    () =>
      employees.filter(
        (employee) =>
          employee.companyId === (editForm?.companyId || "") &&
          employee.status !== "Inactive",
      ),
    [employees, editForm?.companyId],
  );

  const assignedEmployees = useMemo(
    () =>
      companyEmployees.filter((employee) =>
        (editForm?.employeeIds || []).includes(employee.id),
      ),
    [companyEmployees, editForm?.employeeIds],
  );

  const availableEmployees = useMemo(
    () =>
      companyEmployees.filter(
        (employee) => !(editForm?.employeeIds || []).includes(employee.id),
      ),
    [companyEmployees, editForm?.employeeIds],
  );

  const handleSort = (column: string) => {
    setSortColumn((prev) => {
      if (prev === column) {
        setSortDirection((direction) => (direction === "ASC" ? "DESC" : "ASC"));
        return prev;
      }
      setSortDirection("ASC");
      return column;
    });
    setPage(0);
  };

  const openView = (row: ProductionLine) => {
    setSelected(row);
    setEditForm(null);
    setModalMode("view");
    setShowModal(true);
  };

  const openEdit = (row: ProductionLine) => {
    setSelected(row);
    setEditForm({
      ...row,
      employeeIds: row.employeeIds || [],
      employeeCount: row.employeeCount || String(row.employeeIds?.length || ""),
      sectionId: row.sectionId || "",
    });
    setModalMode("edit");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelected(null);
    setEditForm(null);
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (!editForm) return;

    if (name === "companyId") {
      setEditForm({
        ...editForm,
        companyId: value,
        sectionId: "",
        employeeIds: [],
      });
      return;
    }

    if (name === "employeeCount") {
      const digitsOnly = value.replace(/\D/g, "");
      const nextCount = Math.max(0, Number(digitsOnly) || 0);
      setEditForm({
        ...editForm,
        employeeCount: digitsOnly,
        employeeIds: editForm.employeeIds.slice(0, nextCount),
      });
      return;
    }

    if (name === "targetOutput") {
      setEditForm({
        ...editForm,
        targetOutput: value.replace(/\D/g, ""),
      });
      return;
    }

    setEditForm({ ...editForm, [name]: value });
  };

  const handleSave = () => {
    if (!editForm) return;
    if (!editForm.companyId || !editForm.sectionId) {
      showErrorAlert(
        "Missing details",
        "Company and section are required.",
      );
      return;
    }
    if (!editForm.targetOutput || Number(editForm.targetOutput) <= 0) {
      showErrorAlert(
        "Target output required",
        "Enter a valid target output using numbers only.",
      );
      return;
    }
    const maxCount = Number(editForm.employeeCount) || 0;
    if (maxCount <= 0) {
      showErrorAlert(
        "Employee count required",
        "Enter how many employees this production line needs.",
      );
      return;
    }
    if (editForm.employeeIds.length !== maxCount) {
      showErrorAlert(
        "Assign employees",
        `Assign exactly ${maxCount} employee${maxCount > 1 ? "s" : ""} to this production line.`,
      );
      return;
    }
    productionLineStore.update(editForm.id, editForm);
    refresh();
    showSuccessAlert("Successfully Updated", "Check and verify updated details.");
    closeModal();
  };

  const handleDelete = async (row: ProductionLine) => {
    const result = await showDeleteConfirmAlert();
    if (!result.isConfirmed) return;
    productionLineStore.remove(row.id);
    refresh();
    showSuccessAlert("Deleted", "The production line has been removed.");
  };

  const columns = [
    { key: "code", header: "Line Code" },
    { key: "name", header: "Line Name" },
    { key: "companyId", header: "Company" },
    { key: "sectionId", header: "Section" },
    { key: "employeeCount", header: "Employees" },
    { key: "shift", header: "Shift" },
  ];

  return (
    <DefaultLayout>
      <Breadcrumb pageName="View Production Line" />

      <div className="mt-4 w-full">
        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="w-[10%] px-6 py-3 text-center">Action</th>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="cursor-pointer px-6 py-3 text-center"
                    onClick={() => handleSort(column.key)}
                  >
                    <div className="flex items-center justify-center">
                      {column.header}
                      <span className="ml-1 inline-block">
                        <ChevronUp className="h-3 w-3" />
                        <ChevronDown className="-mt-1 h-3 w-3" />
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1}>
                    <div className="flex h-40 items-center justify-center">
                      <DataLoader />
                    </div>
                  </td>
                </tr>
              ) : pagedRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No records found.
                  </td>
                </tr>
              ) : (
                pagedRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t bg-white text-center dark:border-gray-700 dark:bg-gray-800"
                  >
                    <td className="w-[10%] px-6 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="rounded-full bg-[#327ee21a] p-1.5 hover:bg-[#327ee233]"
                          onClick={() => openView(row)}
                          title="View"
                        >
                          <Eye className="h-5 w-5 text-primary" />
                        </button>
                        <button
                          className="rounded-full bg-[#28a7451a] p-1.5 hover:bg-[#28a74533]"
                          onClick={() => openEdit(row)}
                          title="Update"
                        >
                          <FilePenLine className="h-5 w-5 text-green-500" />
                        </button>
                        <button
                          className="rounded-full bg-[#fc1a1a1a] p-1.5 hover:bg-[#ff000033]"
                          onClick={() => handleDelete(row)}
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5 text-red-500" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-start">
                      {row.code || "Unavailable"}
                    </td>
                    <td className="px-6 py-3 text-start">
                      {row.name || "Unavailable"}
                    </td>
                    <td className="px-6 py-3 text-start">
                      {companyName(row.companyId)}
                    </td>
                    <td className="px-6 py-3 text-start">
                      {sectionName(row.sectionId)}
                    </td>
                    <td className="px-6 py-3 text-start">
                      {row.employeeIds?.length || 0}
                      {row.employeeCount ? ` / ${row.employeeCount}` : ""}
                    </td>
                    <td className="px-6 py-3 text-start">
                      {row.shift || "Unavailable"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        page={currentPage}
        totalRecords={totalRecords}
        size={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(nextSize) => {
          setPageSize(nextSize);
          setPage(0);
        }}
      />

      {showModal && selected && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black bg-opacity-40">
          <div className="hide-scrollbar relative m-2 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-4 shadow-lg dark:border dark:border-gray-700 dark:bg-gray-800 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {modalMode === "edit"
                  ? "Edit Production Line"
                  : "View Production Line"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalMode === "edit" && editForm ? (
              <>
                <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
                  <FormField
                    label="Company"
                    name="companyId"
                    value={editForm.companyId}
                    onChange={handleEditChange}
                    required
                    as="select"
                    placeholder="Select a company"
                    options={companies.map((company) => ({
                      value: company.id,
                      label: `${company.name} (${company.code})`,
                    }))}
                  />
                  <FormField
                    label="Section"
                    name="sectionId"
                    value={editForm.sectionId}
                    onChange={handleEditChange}
                    required
                    as="select"
                    placeholder="Select a section"
                    options={companySections.map((section) => ({
                      value: section.id,
                      label: `${section.name} (${section.code})`,
                    }))}
                  />
                </div>
                <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
                  <FormField
                    label="Line Name"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    required
                    placeholder="Enter line name"
                  />
                  <FormField
                    label="Line Code"
                    name="code"
                    value={editForm.code}
                    onChange={handleEditChange}
                    required
                    placeholder="Enter line code"
                  />
                </div>
                <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
                  <FormField
                    label="Style / Order"
                    name="style"
                    value={editForm.style}
                    onChange={handleEditChange}
                    placeholder="Enter style or order"
                  />
                  <FormField
                    label="Target Output"
                    name="targetOutput"
                    value={editForm.targetOutput}
                    onChange={handleEditChange}
                    inputMode="numeric"
                    required
                    placeholder="Enter target output"
                  />
                </div>
                <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
                  <FormField
                    label="Shift"
                    name="shift"
                    value={editForm.shift}
                    onChange={handleEditChange}
                    as="select"
                    placeholder="Select a shift"
                    options={[
                      { value: "Day", label: "Day" },
                      { value: "Night", label: "Night" },
                      { value: "General", label: "General" },
                    ]}
                  />
                  <FormField
                    label="Employee Count"
                    name="employeeCount"
                    value={editForm.employeeCount || ""}
                    onChange={handleEditChange}
                    inputMode="numeric"
                    required
                    placeholder="Enter employee count"
                  />
                </div>

                <EmployeeAssignBoard
                  availableEmployees={availableEmployees}
                  assignedEmployees={assignedEmployees}
                  assignedIds={editForm.employeeIds}
                  maxCount={Number(editForm.employeeCount) || 0}
                  onChange={(employeeIds) =>
                    setEditForm({ ...editForm, employeeIds })
                  }
                  onLimitReached={() =>
                    showErrorAlert(
                      "Limit reached",
                      Number(editForm.employeeCount) <= 0
                        ? "Set Employee Count first."
                        : `You can assign only ${editForm.employeeCount} employee${Number(editForm.employeeCount) > 1 ? "s" : ""}.`,
                    )
                  }
                />
              </>
            ) : (
              <>
                {[
                  { label: "Company", value: companyName(selected.companyId) },
                  { label: "Section", value: sectionName(selected.sectionId) },
                  { label: "Line Name", value: selected.name || "Unavailable" },
                  { label: "Line Code", value: selected.code || "Unavailable" },
                  {
                    label: "Style / Order",
                    value: selected.style || "Unavailable",
                  },
                  {
                    label: "Target Output",
                    value: selected.targetOutput || "Unavailable",
                  },
                  { label: "Shift", value: selected.shift || "Unavailable" },
                  {
                    label: "Employee Count",
                    value: `${selected.employeeIds?.length || 0} / ${selected.employeeCount || 0}`,
                  },
                  {
                    label: "Assigned Employees",
                    value:
                      selected.employeeIds?.length > 0
                        ? selected.employeeIds
                            .map((id) => employeeName(id))
                            .join(", ")
                        : "Unavailable",
                  },
                ].map((field) => (
                  <div
                    key={field.label}
                    className="mb-2 rounded-xl border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <p className="font-bold">{field.label}</p>
                    <div className="mt-1">{field.value}</div>
                  </div>
                ))}
              </>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="flex items-center gap-2 rounded-lg bg-gray-500 px-5 py-2 text-sm text-white hover:bg-gray-600"
              >
                <X className="h-5 w-5" />
                Close
              </button>
              {modalMode === "edit" ? (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm text-white hover:bg-hover"
                >
                  <Save className="h-5 w-5" />
                  Update
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}

export default withAuth(ViewProductionLine);
