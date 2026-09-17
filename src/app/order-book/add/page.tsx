"use client";
import { useEffect, useMemo, useState } from "react";
import withAuth from "@/utils/withAuth";
import AddFormLayout from "@/components/common/AddFormLayout";
import FormField from "@/components/common/FormField";
import {
  companyStore,
  FABRIC_TYPES,
  GARMENT_TYPES,
  ORDER_STATUSES,
  orderBookStore,
  SEASONS,
  SIZE_RANGES,
} from "@/utils/localStore";
import { showErrorAlert, showSuccessAlert } from "@/utils/alert";

const SIZE_KEYS = ["qtyXS", "qtyS", "qtyM", "qtyL", "qtyXL", "qtyXXL"] as const;
const SIZE_LABELS = ["XS", "S", "M", "L", "XL", "XXL"] as const;

const emptyForm = {
  companyId: "",
  orderNo: "",
  styleNo: "",
  styleName: "",
  buyer: "",
  season: "",
  garmentType: "",
  fabricType: "",
  color: "",
  sizeRange: "",
  qtyXS: "",
  qtyS: "",
  qtyM: "",
  qtyL: "",
  qtyXL: "",
  qtyXXL: "",
  orderQty: "",
  orderDate: "",
  deliveryDate: "",
  merchandiser: "",
  status: "Confirmed",
  remarks: "",
};

function sumSizeQty(form: typeof emptyForm) {
  return SIZE_KEYS.reduce((total, key) => total + (Number(form[key]) || 0), 0);
}

function AddOrder() {
  const [form, setForm] = useState(emptyForm);
  const [companies, setCompanies] = useState<
    ReturnType<typeof companyStore.getAll>
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCompanies(companyStore.getAll());
  }, []);

  const sizeTotal = useMemo(() => sumSizeQty(form), [form]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (SIZE_KEYS.includes(name as (typeof SIZE_KEYS)[number])) {
      const digitsOnly = value.replace(/\D/g, "");
      setForm((prev) => {
        const next = { ...prev, [name]: digitsOnly };
        const total = sumSizeQty(next);
        return {
          ...next,
          orderQty: total > 0 ? String(total) : prev.orderQty,
        };
      });
      return;
    }

    if (name === "orderQty") {
      setForm((prev) => ({ ...prev, orderQty: value.replace(/\D/g, "") }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyId) {
      showErrorAlert(
        "Company required",
        "Add a company first, then book this order against a factory.",
      );
      return;
    }
    if (!form.orderQty || Number(form.orderQty) <= 0) {
      showErrorAlert(
        "Order quantity required",
        "Enter the total pieces or fill the size breakdown.",
      );
      return;
    }
    if (form.deliveryDate && form.orderDate && form.deliveryDate < form.orderDate) {
      showErrorAlert(
        "Invalid delivery date",
        "Ex-factory / delivery date cannot be earlier than the order date.",
      );
      return;
    }

    setLoading(true);
    orderBookStore.add({
      ...form,
      orderQty: sizeTotal > 0 ? String(sizeTotal) : form.orderQty,
    });
    setForm(emptyForm);
    setLoading(false);
    showSuccessAlert(
      "Order added",
      "The order is now available in View Order Details.",
    );
  };

  return (
    <AddFormLayout
      pageName="Add Order"
      title="Provide Order Book Information"
      submitLabel="Save Order"
      loading={loading}
      onSubmit={handleSubmit}
    >
      {companies.length === 0 ? (
        <p className="mb-4.5 text-sm font-medium text-black dark:text-white">
          Add a company first, then book garment orders for that factory.
        </p>
      ) : null}

      <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
        <FormField
          label="Factory"
          name="companyId"
          value={form.companyId}
          onChange={handleChange}
          required
          as="select"
          placeholder="Select a factory"
          options={companies.map((company) => ({
            value: company.id,
            label: `${company.name} (${company.code})`,
          }))}
        />
        <FormField
          label="Buyer PO / Order No"
          name="orderNo"
          value={form.orderNo}
          onChange={handleChange}
          required
          placeholder="Enter buyer PO number"
        />
      </div>

      <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
        <FormField
          label="Style No"
          name="styleNo"
          value={form.styleNo}
          onChange={handleChange}
          required
          placeholder="Enter style number"
        />
        <FormField
          label="Style Name"
          name="styleName"
          value={form.styleName}
          onChange={handleChange}
          required
          placeholder="Enter style name"
        />
      </div>

      <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
        <FormField
          label="Buyer / Brand"
          name="buyer"
          value={form.buyer}
          onChange={handleChange}
          required
          placeholder="Enter buyer or brand"
        />
        <FormField
          label="Season"
          name="season"
          value={form.season}
          onChange={handleChange}
          as="select"
          placeholder="Select season"
          options={SEASONS.map((season) => ({
            value: season,
            label: season,
          }))}
        />
      </div>

      <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
        <FormField
          label="Garment Type"
          name="garmentType"
          value={form.garmentType}
          onChange={handleChange}
          required
          as="select"
          placeholder="Select garment type"
          options={GARMENT_TYPES.map((type) => ({
            value: type,
            label: type,
          }))}
        />
        <FormField
          label="Fabric"
          name="fabricType"
          value={form.fabricType}
          onChange={handleChange}
          as="select"
          placeholder="Select fabric"
          options={FABRIC_TYPES.map((type) => ({
            value: type,
            label: type,
          }))}
        />
      </div>

      <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
        <FormField
          label="Color / Colorway"
          name="color"
          value={form.color}
          onChange={handleChange}
          required
          placeholder="Enter colorway"
        />
        <FormField
          label="Size Range"
          name="sizeRange"
          value={form.sizeRange}
          onChange={handleChange}
          as="select"
          placeholder="Select size range"
          options={SIZE_RANGES.map((range) => ({
            value: range,
            label: range,
          }))}
        />
      </div>

      <div className="mb-4.5">
        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
          Size Breakdown (pcs)
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {SIZE_KEYS.map((key, index) => (
            <div key={key}>
              <label className="mb-1.5 block text-xs font-medium text-bodydark2">
                {SIZE_LABELS[index]}
              </label>
              <input
                type="text"
                inputMode="numeric"
                name={key}
                value={form[key]}
                onChange={handleChange}
                placeholder="0"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          ))}
        </div>
        {sizeTotal > 0 ? (
          <p className="mt-2 text-sm text-bodydark2">
            Size total:{" "}
            <span className="font-semibold text-black dark:text-white">
              {sizeTotal.toLocaleString()} pcs
            </span>
          </p>
        ) : null}
      </div>

      <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
        <FormField
          label="Order Qty (pcs)"
          name="orderQty"
          value={form.orderQty}
          onChange={handleChange}
          inputMode="numeric"
          required
          placeholder="Enter total pieces"
        />
        <FormField
          label="Merchandiser"
          name="merchandiser"
          value={form.merchandiser}
          onChange={handleChange}
          placeholder="Enter merchandiser name"
        />
      </div>

      <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
        <FormField
          label="Order Date"
          name="orderDate"
          value={form.orderDate}
          onChange={handleChange}
          type="date"
          required
        />
        <FormField
          label="Ex-Factory / Delivery Date"
          name="deliveryDate"
          value={form.deliveryDate}
          onChange={handleChange}
          type="date"
          required
        />
      </div>

      <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
        <FormField
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          required
          as="select"
          placeholder="Select status"
          options={ORDER_STATUSES.map((status) => ({
            value: status,
            label: status,
          }))}
        />
      </div>

      <div className="mb-4.5 flex flex-col gap-6 md:flex-row">
        <FormField
          label="Remarks"
          name="remarks"
          value={form.remarks}
          onChange={handleChange}
          as="textarea"
          fullWidth
          placeholder="Wash, packing, shipment terms, or special instructions..."
        />
      </div>
    </AddFormLayout>
  );
}

export default withAuth(AddOrder);
