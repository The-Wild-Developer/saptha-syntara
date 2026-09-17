import React from "react";
import { ChevronDown } from "lucide-react";

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  required?: boolean;
  placeholder?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  as?: "input" | "textarea" | "select";
  options?: { value: string; label: string }[];
  fullWidth?: boolean;
}

const controlClassName =
  "w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary";

export default function FormField({
  label,
  name,
  value,
  onChange,
  required,
  placeholder,
  type = "text",
  inputMode,
  as = "input",
  options = [],
  fullWidth,
}: FormFieldProps) {
  return (
    <div className={fullWidth ? "w-full" : "w-full md:w-1/2"}>
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
        {label}
        {required ? <span className="text-meta-1"> *</span> : null}
      </label>
      {as === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={controlClassName}
        />
      ) : as === "select" ? (
        <div className="relative">
          <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={`appearance-none ${controlClassName} cursor-pointer pr-11`}
          >
            {placeholder ? (
              <option value="" disabled>
                {placeholder}
              </option>
            ) : null}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-bodydark2" />
        </div>
      ) : (
        <input
          type={type}
          inputMode={inputMode}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={controlClassName}
        />
      )}
    </div>
  );
}
