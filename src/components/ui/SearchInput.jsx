import React from "react";
import { FiSearch } from "react-icons/fi";

export default function SearchInput({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative w-full max-w-xs">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <FiSearch className="text-[#8A817A] text-base" />
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 bg-white border border-[#E8E2DD] rounded-lg text-sm text-[#2B2420] placeholder-[#8A817A] focus:outline-none focus:ring-1 focus:ring-[#79553D] focus:border-[#79553D] transition-all duration-150"
      />
    </div>
  );
}
