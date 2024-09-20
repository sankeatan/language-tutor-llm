// components/ui/select.tsx
import React from 'react';

interface SelectProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}

export const Select: React.FC<SelectProps> = ({ options, value, onChange }) => {
  return (
    <select
      className="border border-gray-300 rounded px-4 py-2"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
