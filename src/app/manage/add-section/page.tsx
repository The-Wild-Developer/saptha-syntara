"use client";
import { useEffect, useState } from "react";
import withAuth from "@/utils/withAuth";
import AddFormLayout from "@/components/common/AddFormLayout";
import FormField from "@/components/common/FormField";
import { companyStore, sectionStore } from "@/utils/localStore";
import { showErrorAlert, showSuccessAlert } from "@/utils/alert";

const emptyForm = {
  companyId: "",
  code: "",
  name: "",
  description: "",
};

function AddSection() {
  const [form, setForm] = useState(emptyForm);
  const [companies, setCompanies] = useState<
    ReturnType<typeof companyStore.getAll>
  >([]);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyId) {
      showErrorAlert(
        "Company required",
        "Add a company first, then assign this section.",
      );
      return;
    }
    setLoading(true);
    sectionStore.add(form);
    setForm(emptyForm);
    setLoading(false);
    showSuccessAlert(
      "Section added",
      "The section is now available in View Section.",
    );
  };

  return (
    <AddFormLayout
      pageName="Add Section"
      title="Provide Section Information"
      submitLabel="Save Section"
      loading={loading}
      onSubmit={handleSubmit}
    >
      {companies.length === 0 ? (
        <p className="mb-4.5 text-sm font-medium text-black dark:text-white">
          Add a company first, then register sections under that company.
        </p>
      ) : null}
      <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
        <FormField
          label="Company Name"
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
          label="Section Code"
          name="code"
          value={form.code}
          onChange={handleChange}
          required
          placeholder="Enter section code"
        />
      </div>
      <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
        <FormField
          label="Section Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Enter section name"
          fullWidth
        />
      </div>
      <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
        <FormField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          as="textarea"
          fullWidth
          placeholder="Write section description here..."
        />
      </div>
    </AddFormLayout>
  );
}

export default withAuth(AddSection);
