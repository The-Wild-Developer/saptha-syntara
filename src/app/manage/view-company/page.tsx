"use client";
import { useEffect, useState } from "react";
import withAuth from "@/utils/withAuth";
import ViewTable from "@/components/common/ViewTable";
import { companyStore, groupStore } from "@/utils/localStore";

function ViewCompany() {
  const [companies, setCompanies] = useState<
    ReturnType<typeof companyStore.getAll>
  >([]);
  const [groups, setGroups] = useState<ReturnType<typeof groupStore.getAll>>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCompanies(companyStore.getAll());
    setGroups(groupStore.getAll());
    setLoading(false);
  }, []);

  const groupName = (groupId: string) =>
    groups.find((group) => group.id === groupId)?.name || "";

  return (
    <ViewTable
      pageName="View Company"
      modalTitle="View Company"
      rows={companies}
      loading={loading}
      columns={[
        { key: "code", header: "Code" },
        { key: "name", header: "Company" },
        {
          key: "groupId",
          header: "Group",
          render: (row) => groupName(row.groupId) || "-",
        },
        { key: "location", header: "Location" },
        { key: "contactPerson", header: "Contact" },
        { key: "phone", header: "Phone" },
      ]}
      getCellValue={(row, key) => String(row[key as keyof typeof row] || "")}
      getSortValue={(row, key) => {
        if (key === "groupId") return groupName(row.groupId);
        return String(row[key as keyof typeof row] || "");
      }}
      getViewFields={(row) => [
        { label: "Company Code", value: row.code },
        { label: "Company Name", value: row.name },
        { label: "Group", value: groupName(row.groupId) },
        { label: "Location", value: row.location },
        { label: "Contact Person", value: row.contactPerson },
        { label: "Phone", value: row.phone },
        { label: "Email", value: row.email },
      ]}
      editFields={[
        {
          key: "groupId",
          label: "Group",
          required: true,
          as: "select",
          options: groups.map((group) => ({
            value: group.id,
            label: group.name,
          })),
        },
        { key: "name", label: "Company Name", required: true },
        { key: "code", label: "Company Code", required: true },
        { key: "location", label: "Location", required: true },
        { key: "contactPerson", label: "Contact Person" },
        { key: "phone", label: "Phone" },
        { key: "email", label: "Email", type: "email" },
      ]}
      onUpdate={(row) => {
        companyStore.update(row.id, row);
        setCompanies(companyStore.getAll());
      }}
      onDelete={(row) => {
        companyStore.remove(row.id);
        setCompanies(companyStore.getAll());
      }}
    />
  );
}

export default withAuth(ViewCompany);
