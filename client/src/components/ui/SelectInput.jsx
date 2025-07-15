import React from "react";

const SelectInput = ({ label, value, onChange, name, options = [], required = false, className = "", disabled = false }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${className}`}
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default SelectInput; 