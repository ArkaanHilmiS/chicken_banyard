"use client";

import React from "react";
import { useOfflineStore } from "@/lib/offlineStore";

type Option = { value: string; label: string; };

type SelectProps = {
  options: Option[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  required?: boolean;
  placeholder?: string;
};

const Select: React.FC<SelectProps> = ({ options, value, onChange, className, required, placeholder }) => {
  const locale = useOfflineStore((state) => state.locale);
  const defaultPlaceholder = locale === "en" ? "Select..." : "Pilih...";

  return (
    <select
      value={value}
      onChange={onChange}
      required={required}
      className={`border px-2 py-1 rounded-md ${className}`}
    >
      <option value="">{placeholder ?? defaultPlaceholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
};

export default Select;
