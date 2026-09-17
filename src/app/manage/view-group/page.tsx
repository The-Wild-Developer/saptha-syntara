"use client";
import { useEffect, useState } from "react";
import withAuth from "@/utils/withAuth";
import ViewTable from "@/components/common/ViewTable";
import { groupStore } from "@/utils/localStore";

function ViewGroup() {
  const [groups, setGroups] = useState<ReturnType<typeof groupStore.getAll>>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setGroups(groupStore.getAll());
    setLoading(false);
  }, []);

  return (
    <ViewTable
      pageName="View Group"
      modalTitle="View Group"
      rows={groups}
      loading={loading}
      columns={[
        { key: "code", header: "Code" },
        { key: "name", header: "Group" },
        { key: "description", header: "Description" },
      ]}
      getCellValue={(row, key) => String(row[key as keyof typeof row] || "")}
      getViewFields={(row) => [
        { label: "Group Code", value: row.code },
        { label: "Group Name", value: row.name },
        { label: "Description", value: row.description },
      ]}
      editFields={[
        { key: "code", label: "Group Code", required: true },
        { key: "name", label: "Group Name", required: true },
        { key: "description", label: "Description", as: "textarea" },
      ]}
      onUpdate={(row) => {
        groupStore.update(row.id, row);
        setGroups(groupStore.getAll());
      }}
      onDelete={(row) => {
        groupStore.remove(row.id);
        setGroups(groupStore.getAll());
      }}
    />
  );
}

export default withAuth(ViewGroup);
