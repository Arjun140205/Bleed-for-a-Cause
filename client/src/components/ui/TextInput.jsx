import React from "react";

const TextInput = ({ label, value, onChange, name, type = "text", placeholder = "", required = false, className = "" }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${className}`}
    />
  </div>
);

export default TextInput; 