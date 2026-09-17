"use client";
import { useState } from "react";
import withAuth from "@/utils/withAuth";
import AddFormLayout from "@/components/common/AddFormLayout";
import FormField from "@/components/common/FormField";
import { groupStore } from "@/utils/localStore";
import { showSuccessAlert } from "@/utils/alert";

const emptyForm = {
  name: "",
  code: "",
  description: "",
};

function AddGroup() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    groupStore.add(form);
    setForm(emptyForm);
    setLoading(false);
    showSuccessAlert("Group added", "The company group is ready to use.");
  };

  return (
    <AddFormLayout
      pageName="Add Group"
      title="Provide Group Information"
      submitLabel="Save Group"
      loading={loading}
      onSubmit={handleSubmit}
    >
      <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
        <FormField
          label="Group Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Enter group name"
        />
        <FormField
          label="Group Code"
          name="code"
          value={form.code}
          onChange={handleChange}
          required
          placeholder="Enter group code"
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
          placeholder="Write your thoughts here..."
        />
      </div>
    </AddFormLayout>
  );
}

export default withAuth(AddGroup);
