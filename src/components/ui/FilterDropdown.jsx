import React from "react";

export default function FilterDropdown({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[11px] font-bold uppercase tracking-wider text-[#8A817A]">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className="px-3 py-2 bg-white border border-[#E8E2DD] rounded-lg text-sm text-[#2B2420] outline-none focus:ring-1 focus:ring-[#79553D] focus:border-[#79553D] transition-all duration-150 cursor-pointer min-w-[140px]"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
