"use client";
import { useEffect, useState } from "react";
import withAuth from "@/utils/withAuth";
import AddFormLayout from "@/components/common/AddFormLayout";
import FormField from "@/components/common/FormField";
import { companyStore, groupStore } from "@/utils/localStore";
import { showErrorAlert, showSuccessAlert } from "@/utils/alert";

const emptyForm = {
  groupId: "",
  name: "",
  code: "",
  location: "",
  contactPerson: "",
  phone: "",
  email: "",
};

function AddCompany() {
  const [form, setForm] = useState(emptyForm);
  const [groups, setGroups] = useState<ReturnType<typeof groupStore.getAll>>(
    [],
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setGroups(groupStore.getAll());
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
    if (!form.groupId) {
      showErrorAlert(
        "Group required",
        "Add a group first, then assign this company.",
      );
      return;
    }
    setLoading(true);
    companyStore.add(form);
    setForm(emptyForm);
    setLoading(false);
    showSuccessAlert(
      "Company added",
      "The company is now available in View Company.",
    );
  };

  return (
    <AddFormLayout
      pageName="Add Company"
      title="Provide Company Information"
      submitLabel="Save Company"
      loading={loading}
      onSubmit={handleSubmit}
    >
      {groups.length === 0 ? (
        <p className="mb-4.5 text-sm font-medium text-black dark:text-white">
          Add a group first, then register companies under that group.
        </p>
      ) : null}
      <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
        <FormField
          label="Group"
          name="groupId"
          value={form.groupId}
          onChange={handleChange}
          required
          as="select"
          placeholder="Select a group"
          options={groups.map((group) => ({
            value: group.id,
            label: `${group.name} (${group.code})`,
          }))}
        />
        <FormField
          label="Company Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Enter company name"
        />
      </div>
      <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
        <FormField
          label="Company Code"
          name="code"
          value={form.code}
          onChange={handleChange}
          required
          placeholder="Enter company code"
        />
        <FormField
          label="Location"
          name="location"
          value={form.location}
          onChange={handleChange}
          required
          placeholder="Enter factory location"
        />
      </div>
      <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
        <FormField
          label="Contact Person"
          name="contactPerson"
          value={form.contactPerson}
          onChange={handleChange}
          placeholder="Enter contact person"
        />
        <FormField
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Enter contact number"
        />
      </div>
      <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
        <FormField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          placeholder="Enter company email"
        />
      </div>
    </AddFormLayout>
  );
}

export default withAuth(AddCompany);
