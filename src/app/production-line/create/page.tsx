"use client";
import { useEffect, useMemo, useState } from "react";
import withAuth from "@/utils/withAuth";
import AddFormLayout from "@/components/common/AddFormLayout";
import FormField from "@/components/common/FormField";
import EmployeeAssignBoard from "@/components/production-line/EmployeeAssignBoard";
import {
  companyStore,
  employeeStore,
  productionLineStore,
  sectionStore,
} from "@/utils/localStore";
import { showErrorAlert, showSuccessAlert } from "@/utils/alert";
import { Plus } from "lucide-react";

const emptyForm = {
  companyId: "",
  sectionId: "",
  name: "",
  code: "",
  style: "",
  targetOutput: "",
  employeeCount: "",
  employeeIds: [] as string[],
  shift: "",
};

function CreateProductionLine() {
  const [form, setForm] = useState(emptyForm);
  const [companies, setCompanies] = useState<
    ReturnType<typeof companyStore.getAll>
  >([]);
  const [sections, setSections] = useState<
    ReturnType<typeof sectionStore.getAll>
  >([]);
  const [employees, setEmployees] = useState<
    ReturnType<typeof employeeStore.getAll>
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCompanies(companyStore.getAll());
    setSections(sectionStore.getAll());
    setEmployees(employeeStore.getAll());
  }, []);

  const maxEmployeeCount = Number(form.employeeCount) || 0;

  const companySections = useMemo(
    () => sections.filter((section) => section.companyId === form.companyId),
    [sections, form.companyId],
  );

  const companyEmployees = useMemo(
    () =>
      employees.filter(
        (employee) =>
          employee.companyId === form.companyId &&
          employee.status !== "Inactive",
      ),
    [employees, form.companyId],
  );

  const assignedEmployees = useMemo(
    () =>
      companyEmployees.filter((employee) =>
        form.employeeIds.includes(employee.id),
      ),
    [companyEmployees, form.employeeIds],
  );

  const availableEmployees = useMemo(
    () =>
      companyEmployees.filter(
        (employee) => !form.employeeIds.includes(employee.id),
      ),
    [companyEmployees, form.employeeIds],
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "companyId") {
      setForm((prev) => ({
        ...prev,
        companyId: value,
        sectionId: "",
        employeeIds: [],
      }));
      return;
    }

    if (name === "employeeCount") {
      const digitsOnly = value.replace(/\D/g, "");
      const nextCount = Math.max(0, Number(digitsOnly) || 0);
      setForm((prev) => ({
        ...prev,
        employeeCount: digitsOnly,
        employeeIds: prev.employeeIds.slice(0, nextCount),
      }));
      return;
    }

    if (name === "targetOutput") {
      setForm((prev) => ({
        ...prev,
        targetOutput: value.replace(/\D/g, ""),
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyId) {
      showErrorAlert(
        "Company required",
        "Add a company first, then create a production line.",
      );
      return;
    }
    if (!form.sectionId) {
      showErrorAlert(
        "Section required",
        "Select a section for this production line.",
      );
      return;
    }
    if (!form.targetOutput || Number(form.targetOutput) <= 0) {
      showErrorAlert(
        "Target output required",
        "Enter a valid target output using numbers only.",
      );
      return;
    }
    if (maxEmployeeCount <= 0) {
      showErrorAlert(
        "Employee count required",
        "Enter how many employees this production line needs.",
      );
      return;
    }
    if (form.employeeIds.length !== maxEmployeeCount) {
      showErrorAlert(
        "Assign employees",
        `Assign exactly ${maxEmployeeCount} employee${maxEmployeeCount > 1 ? "s" : ""} to this production line.`,
      );
      return;
    }
    setLoading(true);
    productionLineStore.add(form);
    setForm(emptyForm);
    setLoading(false);
    showSuccessAlert(
      "Production line created",
      "The production line has been saved.",
    );
  };

  return (
    <AddFormLayout
      pageName="Create Production Line"
      title="Provide Production Line Information"
      submitLabel="Create Line"
      submitIcon={<Plus className="h-5 w-5" />}
      loading={loading}
      onSubmit={handleSubmit}
    >
      {companies.length === 0 ? (
        <p className="mb-4.5 text-sm font-medium text-black dark:text-white">
          Add a company first, then create a production line for that factory.
        </p>
      ) : null}
      <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
        <FormField
          label="Company"
          name="companyId"
          value={form.companyId}
          onChange={handleChange}
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
          value={form.sectionId}
          onChange={handleChange}
          required
          as="select"
          placeholder={
            form.companyId ? "Select a section" : "Select a company first"
          }
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
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Enter line name"
        />
        <FormField
          label="Line Code"
          name="code"
          value={form.code}
          onChange={handleChange}
          required
          placeholder="Enter line code"
        />
      </div>
      <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
        <FormField
          label="Style / Order"
          name="style"
          value={form.style}
          onChange={handleChange}
          placeholder="Enter style or order"
        />
        <FormField
          label="Target Output"
          name="targetOutput"
          value={form.targetOutput}
          onChange={handleChange}
          inputMode="numeric"
          required
          placeholder="Enter target output"
        />
      </div>
      <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
        <FormField
          label="Shift"
          name="shift"
          value={form.shift}
          onChange={handleChange}
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
          value={form.employeeCount}
          onChange={handleChange}
          inputMode="numeric"
          required
          placeholder="Enter employee count"
        />
      </div>

      {form.companyId ? (
        <EmployeeAssignBoard
          availableEmployees={availableEmployees}
          assignedEmployees={assignedEmployees}
          assignedIds={form.employeeIds}
          maxCount={maxEmployeeCount}
          onChange={(employeeIds) =>
            setForm((prev) => ({ ...prev, employeeIds }))
          }
          onLimitReached={() =>
            showErrorAlert(
              "Limit reached",
              maxEmployeeCount <= 0
                ? "Set Employee Count first."
                : `You can assign only ${maxEmployeeCount} employee${maxEmployeeCount > 1 ? "s" : ""}.`,
            )
          }
        />
      ) : (
        <p className="mb-4.5 text-sm text-bodydark2">
          Select a company to load employees for assignment.
        </p>
      )}
    </AddFormLayout>
  );
}

export default withAuth(CreateProductionLine);
