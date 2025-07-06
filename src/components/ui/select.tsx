import React from "react";

type Option = { value: string; label: string; };

type SelectProps = {
  options: Option[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  required?: boolean;
};

const Select: React.FC<SelectProps> = ({ options, value, onChange, className, required }) => (
  <select
    value={value}
    onChange={onChange}
    required={required}
    className={`border px-2 py-1 rounded-md ${className}`}
  >
    <option value="">Pilih...</option>
    {options.map(opt => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

export default Select;
