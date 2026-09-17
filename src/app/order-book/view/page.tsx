"use client";
import { useEffect, useState } from "react";
import withAuth from "@/utils/withAuth";
import ViewTable from "@/components/common/ViewTable";
import {
  companyStore,
  FABRIC_TYPES,
  GARMENT_TYPES,
  ORDER_STATUSES,
  orderBookStore,
  SEASONS,
  SIZE_RANGES,
} from "@/utils/localStore";

const SIZE_KEYS = ["qtyXS", "qtyS", "qtyM", "qtyL", "qtyXL", "qtyXXL"] as const;
const SIZE_LABELS = ["XS", "S", "M", "L", "XL", "XXL"] as const;

function formatSizeBreakdown(row: {
  qtyXS?: string;
  qtyS?: string;
  qtyM?: string;
  qtyL?: string;
  qtyXL?: string;
  qtyXXL?: string;
}) {
  const parts = SIZE_KEYS.map((key, index) => {
    const qty = Number(row[key]) || 0;
    return qty > 0 ? `${SIZE_LABELS[index]}: ${qty.toLocaleString()}` : "";
  }).filter(Boolean);
  return parts.length > 0 ? parts.join("  |  ") : "";
}

function statusClass(status: string) {
  if (status === "Shipped" || status === "Packed") {
    return "bg-success/10 text-success";
  }
  if (status === "Cancelled" || status === "On Hold") {
    return "bg-danger/10 text-danger";
  }
  if (status === "Confirmed") {
    return "bg-primary/10 text-primary";
  }
  return "bg-warning/10 text-warning";
}

function ViewOrderDetails() {
  const [orders, setOrders] = useState<ReturnType<typeof orderBookStore.getAll>>(
    [],
  );
  const [companies, setCompanies] = useState<
    ReturnType<typeof companyStore.getAll>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setOrders(orderBookStore.getAll());
    setCompanies(companyStore.getAll());
    setLoading(false);
  }, []);

  const companyName = (companyId: string) =>
    companies.find((company) => company.id === companyId)?.name || "";

  return (
    <ViewTable
      pageName="View Order Details"
      modalTitle="View Order Details"
      rows={orders}
      loading={loading}
      columns={[
        { key: "orderNo", header: "PO / Order No" },
        { key: "styleNo", header: "Style No" },
        { key: "styleName", header: "Style" },
        { key: "buyer", header: "Buyer" },
        {
          key: "companyId",
          header: "Factory",
          render: (row) => companyName(row.companyId) || "Unavailable",
        },
        {
          key: "orderQty",
          header: "Qty (pcs)",
          render: (row) =>
            row.orderQty
              ? Number(row.orderQty).toLocaleString()
              : "Unavailable",
        },
        {
          key: "deliveryDate",
          header: "Ex-Factory",
          render: (row) => row.deliveryDate || "Unavailable",
        },
        {
          key: "status",
          header: "Status",
          render: (row) => (
            <div className="flex justify-center">
              {row.status ? (
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                    row.status,
                  )}`}
                >
                  {row.status}
                </span>
              ) : (
                "Unavailable"
              )}
            </div>
          ),
        },
      ]}
      getCellValue={(row, key) => {
        if (key === "companyId") return companyName(row.companyId) || "Unavailable";
        if (key === "orderQty") {
          return row.orderQty
            ? Number(row.orderQty).toLocaleString()
            : "Unavailable";
        }
        return String(row[key as keyof typeof row] || "Unavailable");
      }}
      getSortValue={(row, key) => {
        if (key === "companyId") return companyName(row.companyId);
        if (key === "orderQty") return String(Number(row.orderQty) || 0).padStart(12, "0");
        return String(row[key as keyof typeof row] || "");
      }}
      getViewFields={(row) => [
        { label: "Factory", value: companyName(row.companyId) || "Unavailable" },
        { label: "Buyer PO / Order No", value: row.orderNo || "Unavailable" },
        { label: "Style No", value: row.styleNo || "Unavailable" },
        { label: "Style Name", value: row.styleName || "Unavailable" },
        { label: "Buyer / Brand", value: row.buyer || "Unavailable" },
        { label: "Season", value: row.season || "Unavailable" },
        { label: "Garment Type", value: row.garmentType || "Unavailable" },
        { label: "Fabric", value: row.fabricType || "Unavailable" },
        { label: "Color / Colorway", value: row.color || "Unavailable" },
        { label: "Size Range", value: row.sizeRange || "Unavailable" },
        {
          label: "Size Breakdown",
          value: formatSizeBreakdown(row) || "Unavailable",
        },
        {
          label: "Order Qty (pcs)",
          value: row.orderQty
            ? `${Number(row.orderQty).toLocaleString()} pcs`
            : "Unavailable",
        },
        { label: "Merchandiser", value: row.merchandiser || "Unavailable" },
        { label: "Order Date", value: row.orderDate || "Unavailable" },
        {
          label: "Ex-Factory / Delivery Date",
          value: row.deliveryDate || "Unavailable",
        },
        { label: "Status", value: row.status || "Unavailable" },
        { label: "Remarks", value: row.remarks || "Unavailable" },
      ]}
      editFields={[
        {
          key: "companyId",
          label: "Factory",
          required: true,
          as: "select",
          options: companies.map((company) => ({
            value: company.id,
            label: `${company.name} (${company.code})`,
          })),
        },
        { key: "orderNo", label: "Buyer PO / Order No", required: true },
        { key: "styleNo", label: "Style No", required: true },
        { key: "styleName", label: "Style Name", required: true },
        { key: "buyer", label: "Buyer / Brand", required: true },
        {
          key: "season",
          label: "Season",
          as: "select",
          options: SEASONS.map((season) => ({ value: season, label: season })),
        },
        {
          key: "garmentType",
          label: "Garment Type",
          required: true,
          as: "select",
          options: GARMENT_TYPES.map((type) => ({ value: type, label: type })),
        },
        {
          key: "fabricType",
          label: "Fabric",
          as: "select",
          options: FABRIC_TYPES.map((type) => ({ value: type, label: type })),
        },
        { key: "color", label: "Color / Colorway", required: true },
        {
          key: "sizeRange",
          label: "Size Range",
          as: "select",
          options: SIZE_RANGES.map((range) => ({ value: range, label: range })),
        },
        { key: "qtyXS", label: "Qty XS" },
        { key: "qtyS", label: "Qty S" },
        { key: "qtyM", label: "Qty M" },
        { key: "qtyL", label: "Qty L" },
        { key: "qtyXL", label: "Qty XL" },
        { key: "qtyXXL", label: "Qty XXL" },
        { key: "orderQty", label: "Order Qty (pcs)", required: true },
        { key: "merchandiser", label: "Merchandiser" },
        { key: "orderDate", label: "Order Date", type: "date", required: true },
        {
          key: "deliveryDate",
          label: "Ex-Factory / Delivery Date",
          type: "date",
          required: true,
        },
        {
          key: "status",
          label: "Status",
          required: true,
          as: "select",
          options: ORDER_STATUSES.map((status) => ({
            value: status,
            label: status,
          })),
        },
        { key: "remarks", label: "Remarks", as: "textarea" },
      ]}
      onUpdate={(row) => {
        const sizeTotal = SIZE_KEYS.reduce(
          (total, key) => total + (Number(row[key]) || 0),
          0,
        );
        orderBookStore.update(row.id, {
          ...row,
          orderQty:
            sizeTotal > 0 ? String(sizeTotal) : String(row.orderQty || ""),
        });
        setOrders(orderBookStore.getAll());
      }}
      onDelete={(row) => {
        orderBookStore.remove(row.id);
        setOrders(orderBookStore.getAll());
      }}
    />
  );
}

export default withAuth(ViewOrderDetails);
