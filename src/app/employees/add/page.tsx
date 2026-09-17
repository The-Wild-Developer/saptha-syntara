"use client";
import { useEffect, useRef, useState } from "react";
import withAuth from "@/utils/withAuth";
import AddFormLayout from "@/components/common/AddFormLayout";
import FormField from "@/components/common/FormField";
import { companyStore, employeeStore } from "@/utils/localStore";
import { showErrorAlert, showSuccessAlert } from "@/utils/alert";
import { ImagePlus, Trash2, User } from "lucide-react";

const TITLE_OPTIONS = [
  { value: "Mr", label: "Mr" },
  { value: "Mrs", label: "Mrs" },
  { value: "Ms", label: "Ms" },
  { value: "Miss", label: "Miss" },
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

const emptyForm = {
  companyId: "",
  employeeNo: "",
  title: "",
  firstName: "",
  lastName: "",
  role: "",
  department: "",
  phone: "",
  email: "",
  dateOfBirth: "",
  status: "Active",
  image: "",
};

function AddEmployee() {
  const [form, setForm] = useState(emptyForm);
  const [companies, setCompanies] = useState<
    ReturnType<typeof companyStore.getAll>
  >([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCompanies(companyStore.getAll());
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showErrorAlert("Invalid file", "Please select an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, image: String(reader.result || "") }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyId) {
      showErrorAlert(
        "Company required",
        "Add a company first, then assign this employee.",
      );
      return;
    }
    setLoading(true);
    employeeStore.add(form);
    setForm(emptyForm);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setLoading(false);
    showSuccessAlert(
      "Employee added",
      "The employee is now available in View Employees.",
    );
  };

  return (
    <AddFormLayout
      pageName="Add Employees"
      title="Provide Employee Information"
      submitLabel="Save Employee"
      loading={loading}
      onSubmit={handleSubmit}
    >
      <div className="mb-4.5 flex flex-col gap-6 md:flex-row md:items-stretch md:gap-6">
        <div className="flex w-full shrink-0 items-center justify-center md:min-h-full md:w-64">
          <div className="relative mx-auto h-56 w-56">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-stroke bg-gray-2 transition-colors hover:border-primary dark:border-strokedark dark:bg-meta-4 dark:hover:border-primary"
            >
              {form.image ? (
                <img
                  src={form.image}
                  alt="Profile"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User className="h-28 w-28 text-bodydark2" strokeWidth={1.5} />
              )}
            </button>
            <button
              type="button"
              aria-label="Upload profile picture"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-5 right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-md transition-colors hover:bg-hover dark:border-boxdark"
            >
              <ImagePlus className="h-5 w-5" />
            </button>
            {form.image ? (
              <button
                type="button"
                aria-label="Remove profile picture"
                onClick={() => {
                  setForm((prev) => ({ ...prev, image: "" }));
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute bottom-5 left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-danger text-white shadow-md transition-colors hover:bg-meta-1 dark:border-boxdark"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            ) : null}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div className="flex w-full flex-1 flex-col justify-center gap-6">
          <FormField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            as="select"
            placeholder="Select title"
            fullWidth
            options={TITLE_OPTIONS}
          />
          <FormField
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
            placeholder="Enter first name"
            fullWidth
          />
          <FormField
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
            placeholder="Enter last name"
            fullWidth
          />
        </div>
      </div>

      {companies.length === 0 ? (
        <p className="mb-4.5 text-sm font-medium text-black dark:text-white">
          Add a company first, then register employees under that factory.
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
          label="Employee No"
          name="employeeNo"
          value={form.employeeNo}
          onChange={handleChange}
          required
          placeholder="Enter employee number"
        />
      </div>
      <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
        <FormField
          label="Role"
          name="role"
          value={form.role}
          onChange={handleChange}
          required
          as="select"
          placeholder="Select role"
          options={ROLE_OPTIONS}
        />
        <FormField
          label="Department"
          name="department"
          value={form.department}
          onChange={handleChange}
          as="select"
          placeholder="Select department"
          options={DEPARTMENT_OPTIONS}
        />
      </div>
      <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
        <FormField
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          placeholder="Enter contact number"
        />
        <FormField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          required
          placeholder="Enter employee email"
        />
      </div>
      <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
        <FormField
          label="Date of Birth"
          name="dateOfBirth"
          value={form.dateOfBirth}
          onChange={handleChange}
          type="date"
          required
        />
        <FormField
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          required
          as="select"
          placeholder="Select status"
          options={STATUS_OPTIONS}
        />
      </div>
    </AddFormLayout>
  );
}

export default withAuth(AddEmployee);
