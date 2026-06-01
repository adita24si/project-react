import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}) {
  if (totalPages <= 1) return null;

  const startIdx = (currentPage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 border-t border-[#E8E2DD] bg-[#FAFAFA]/40">
      <p className="text-xs text-[#8A817A] font-medium">
        Showing <span className="text-[#2B2420] font-semibold">{startIdx}</span> to{" "}
        <span className="text-[#2B2420] font-semibold">{endIdx}</span> of{" "}
        <span className="text-[#2B2420] font-semibold">{totalItems}</span> entries
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 border border-[#E8E2DD] bg-white rounded-md text-[#8A817A] hover:bg-[#FAFAFA] hover:text-[#79553D] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <FiChevronLeft className="text-base" />
        </button>

        <div className="text-xs font-semibold px-2 text-[#2B2420]">
          {currentPage} <span className="text-[#8A817A] font-normal">/ {totalPages}</span>
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 border border-[#E8E2DD] bg-white rounded-md text-[#8A817A] hover:bg-[#FAFAFA] hover:text-[#79553D] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <FiChevronRight className="text-base" />
        </button>
      </div>
    </div>
  );
}
