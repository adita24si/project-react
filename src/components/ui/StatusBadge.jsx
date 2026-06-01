import React from "react";

export default function StatusBadge({ status }) {
  const getStyles = (s) => {
    const term = String(s).toLowerCase();
    switch (term) {
      case "lunas":
      case "completed":
      case "resolved":
      case "active":
        return { bg: "bg-[#E6ECE5]", text: "text-[#4A6B46]", border: "border-[#D8E2D7]" };
      case "cicilan":
      case "processing":
      case "in progress":
      case "in-progress":
      case "scheduled":
        return { bg: "bg-[#F9F0E5]", text: "text-[#A86E2E]", border: "border-[#EFDEC9]" };
      case "pending":
      case "open":
      case "inactive":
        return { bg: "bg-[#F5ECE5]", text: "text-[#79553D]", border: "border-[#E8D9CE]" };
      case "cancelled":
      case "cancel":
      case "expired":
        return { bg: "bg-[#F2E6E6]", text: "text-[#B85C5C]", border: "border-[#E7D2D2]" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-200" };
    }
  };

  const { bg, text, border } = getStyles(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${bg} ${text} ${border}`}>
      {status}
    </span>
  );
}
