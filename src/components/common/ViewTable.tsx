"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DataLoader from "@/components/common/DataLoader";
import FormField from "@/components/common/FormField";
import Pagination from "@/components/Pagination/page";
import { showDeleteConfirmAlert, showSuccessAlert } from "@/utils/alert";
import { ChevronDown, ChevronUp, Eye, FilePenLine, ImagePlus, Save, Trash2, User, X } from "lucide-react";
import { ReactNode, useMemo, useRef, useState } from "react";

export interface ViewColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
}

export interface ViewField {
  label: string;
  value: ReactNode;
  center?: boolean;
}

export interface EditField {
  key: string;
  label: string;
  required?: boolean;
  type?: string;
  as?: "input" | "textarea" | "select" | "image";
  options?: { value: string; label: string }[];
}

interface ViewTableProps<T extends { id: string }> {
  pageName: string;
  modalTitle: string;
  rows: T[];
  loading?: boolean;
  columns: ViewColumn<T>[];
  getCellValue: (row: T, key: string) => string;
  getViewFields: (row: T) => ViewField[];
  getSortValue?: (row: T, key: string) => string;
  editFields?: EditField[];
  onUpdate?: (row: T) => void;
  onDelete?: (row: T) => void;
}

const PAGE_SIZE = 10;

export default function ViewTable<T extends { id: string }>({
  pageName,
  modalTitle,
  rows,
  loading = false,
  columns,
  getCellValue,
  getViewFields,
  getSortValue,
  editFields = [],
  onUpdate,
  onDelete,
}: ViewTableProps<T>) {
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");
  const [selectedRow, setSelectedRow] = useState<T | null>(null);
  const [editForm, setEditForm] = useState<T | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

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

  const renderSortIcons = (column: string) => {
    const isActive = sortColumn === column;
    return (
      <span className="ml-1 inline-block">
        <span
          className={`block ${
            isActive && sortDirection === "ASC" ? "text-black" : "text-gray-400"
          }`}
        >
          <ChevronUp className="h-3 w-3 text-black dark:text-gray-400" />
        </span>
        <span
          className={`-mt-1 block ${
            isActive && sortDirection === "DESC" ? "text-black" : "text-gray-400"
          }`}
        >
          <ChevronDown className="h-3 w-3 text-black dark:text-gray-400" />
        </span>
      </span>
    );
  };

  const sortedRows = useMemo(() => {
    if (!sortColumn) return rows;
    return [...rows].sort((a, b) => {
      const left = (
        getSortValue?.(a, sortColumn) ?? getCellValue(a, sortColumn)
      ).toLowerCase();
      const right = (
        getSortValue?.(b, sortColumn) ?? getCellValue(b, sortColumn)
      ).toLowerCase();
      if (left < right) return sortDirection === "ASC" ? -1 : 1;
      if (left > right) return sortDirection === "ASC" ? 1 : -1;
      return 0;
    });
  }, [getCellValue, getSortValue, rows, sortColumn, sortDirection]);

  const totalRecords = sortedRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const pagedRows = sortedRows.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize,
  );
  const colSpan = columns.length + 1;

  const closeModal = () => {
    setShowModal(false);
    setSelectedRow(null);
    setEditForm(null);
    setModalMode("view");
  };

  const openView = (row: T) => {
    setSelectedRow(row);
    setModalMode("view");
    setShowModal(true);
  };

  const openEdit = (row: T) => {
    setSelectedRow(row);
    setEditForm({ ...row });
    setModalMode("edit");
    setShowModal(true);
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleEditImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      setEditForm((prev) =>
        prev ? { ...prev, [key]: String(reader.result || "") } : prev,
      );
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!editForm || !onUpdate) return;
    onUpdate(editForm);
    showSuccessAlert("Successfully Updated", "Check and verify updated details.");
    closeModal();
  };

  const handleDelete = async (row: T) => {
    if (!onDelete) return;
    const result = await showDeleteConfirmAlert();
    if (!result.isConfirmed) return;
    onDelete(row);
    showSuccessAlert("Deleted", "The record has been removed.");
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName={pageName} />

      <div className="mt-4 w-full">
        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="w-[10%] px-6 py-3 text-center">Action</th>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-3 text-center ${
                      column.sortable !== false ? "cursor-pointer" : ""
                    }`}
                    onClick={() =>
                      column.sortable !== false ? handleSort(column.key) : undefined
                    }
                  >
                    <div className="flex items-center justify-center">
                      {column.header}{" "}
                      {column.sortable !== false ? renderSortIcons(column.key) : null}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={colSpan}>
                    <div className="flex h-full items-center justify-center">
                      <DataLoader />
                    </div>
                  </td>
                </tr>
              ) : pagedRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={colSpan}
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
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-3 text-start">
                        {column.render
                          ? column.render(row)
                          : getCellValue(row, column.key)}
                      </td>
                    ))}
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

      {showModal && selectedRow && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black bg-opacity-40">
          <div className="hide-scrollbar scrollbar-none relative m-2 max-h-[500px] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-4 shadow-lg dark:border dark:border-gray-700 dark:bg-gray-800 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {modalMode === "edit" ? modalTitle.replace("View", "Edit") : modalTitle}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-red-500"
              >
                <span className="sr-only">Close</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {modalMode === "edit" && editForm ? (
              editFields.map((field) =>
                field.as === "image" ? (
                  <div
                    key={field.key}
                    className="mb-2 rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <p className="mb-2.5 text-sm font-medium text-black dark:text-white">
                      {field.label}
                      {field.required ? (
                        <span className="text-meta-1"> *</span>
                      ) : null}
                    </p>
                    <div className="relative mx-auto h-36 w-36">
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-stroke bg-gray-2 transition-colors hover:border-primary dark:border-strokedark dark:bg-meta-4 dark:hover:border-primary"
                      >
                        {(editForm as Record<string, string>)[field.key] ? (
                          <img
                            src={(editForm as Record<string, string>)[field.key]}
                            alt={field.label}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-16 w-16 text-bodydark2" />
                        )}
                      </button>
                      <button
                        type="button"
                        aria-label={`Upload ${field.label}`}
                        onClick={() => imageInputRef.current?.click()}
                        className="absolute bottom-1 right-1 z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-md transition-colors hover:bg-hover dark:border-boxdark"
                      >
                        <ImagePlus className="h-4 w-4" />
                      </button>
                      {(editForm as Record<string, string>)[field.key] ? (
                        <button
                          type="button"
                          aria-label={`Remove ${field.label}`}
                          onClick={() => {
                            setEditForm((prev) =>
                              prev ? { ...prev, [field.key]: "" } : prev,
                            );
                            if (imageInputRef.current) {
                              imageInputRef.current.value = "";
                            }
                          }}
                          className="absolute bottom-1 left-1 z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-danger text-white shadow-md transition-colors hover:bg-meta-1 dark:border-boxdark"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      ) : null}
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleEditImageChange(e, field.key)}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    key={field.key}
                    className="mb-2 rounded-xl border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <FormField
                      label={field.label}
                      name={field.key}
                      value={String(
                        (editForm as Record<string, string>)[field.key] || "",
                      )}
                      onChange={handleEditChange}
                      required={field.required}
                      type={field.type}
                      as={field.as}
                      options={field.options}
                      fullWidth
                    />
                  </div>
                ),
              )
            ) : (
              getViewFields(selectedRow).map((field) => (
                <div
                  key={field.label}
                  className="mb-2 rounded-xl border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
                >
                  <p className="font-bold">{field.label}</p>
                  <div
                    className={`mt-1 ${
                      field.center ? "flex justify-center" : ""
                    }`}
                  >
                    {field.value || "Unavailable"}
                  </div>
                </div>
              ))
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
