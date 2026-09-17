"use client";
import { useEffect, useState } from "react";
import withAuth from "@/utils/withAuth";
import ViewTable from "@/components/common/ViewTable";
import { companyStore, sectionStore } from "@/utils/localStore";

function ViewSection() {
  const [sections, setSections] = useState<
    ReturnType<typeof sectionStore.getAll>
  >([]);
  const [companies, setCompanies] = useState<
    ReturnType<typeof companyStore.getAll>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSections(sectionStore.getAll());
    setCompanies(companyStore.getAll());
    setLoading(false);
  }, []);

  const companyName = (companyId: string) =>
    companies.find((company) => company.id === companyId)?.name || "Unavailable";

  return (
    <ViewTable
      pageName="View Section"
      modalTitle="View Section"
      rows={sections}
      loading={loading}
      columns={[
        {
          key: "companyId",
          header: "Company",
          render: (row) => companyName(row.companyId),
        },
        {
          key: "code",
          header: "Section Code",
          render: (row) => row.code || "Unavailable",
        },
        {
          key: "name",
          header: "Section Name",
          render: (row) => row.name || "Unavailable",
        },
        {
          key: "description",
          header: "Description",
          render: (row) => row.description || "Unavailable",
        },
      ]}
      getCellValue={(row, key) => {
        if (key === "companyId") return companyName(row.companyId);
        return String(row[key as keyof typeof row] || "Unavailable");
      }}
      getSortValue={(row, key) => {
        if (key === "companyId") return companyName(row.companyId);
        return String(row[key as keyof typeof row] || "");
      }}
      getViewFields={(row) => [
        { label: "Company Name", value: companyName(row.companyId) },
        { label: "Section Code", value: row.code || "Unavailable" },
        { label: "Section Name", value: row.name || "Unavailable" },
        { label: "Description", value: row.description || "Unavailable" },
      ]}
      editFields={[
        {
          key: "companyId",
          label: "Company Name",
          required: true,
          as: "select",
          options: companies.map((company) => ({
            value: company.id,
            label: `${company.name} (${company.code})`,
          })),
        },
        { key: "code", label: "Section Code", required: true },
        { key: "name", label: "Section Name", required: true },
        { key: "description", label: "Description", as: "textarea" },
      ]}
      onUpdate={(row) => {
        sectionStore.update(row.id, row);
        setSections(sectionStore.getAll());
      }}
      onDelete={(row) => {
        sectionStore.remove(row.id);
        setSections(sectionStore.getAll());
      }}
    />
  );
}

export default withAuth(ViewSection);
