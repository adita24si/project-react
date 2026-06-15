import React from "react";
import { FiAward } from "react-icons/fi";

export default function MembershipBadge({ tier }) {
  const getStyles = (t) => {
    const term = String(t).toLowerCase();
    switch (term) {
      case "vip":
        return {
          bg: "bg-[#FDF9F2]",
          text: "text-[#D4AF37]",
          border: "border-[#EADBB3]",
          label: "VIP"
        };
      case "platinum":
        return {
          bg: "bg-[#ECF2F7]",
          text: "text-[#3D5266]",
          border: "border-[#D1DFEB]",
          label: "Platinum"
        };
      case "gold":
        return {
          bg: "bg-[#FDF6E3]",
          text: "text-[#967132]",
          border: "border-[#E5D5B5]",
          label: "Gold"
        };
      case "silver":
        return {
          bg: "bg-[#F5F5F5]",
          text: "text-[#6E6A67]",
          border: "border-[#E0DEDC]",
          label: "Silver"
        };
      case "bronze":
      default:
        return {
          bg: "bg-[#FAF0E6]",
          text: "text-[#8C5E3C]",
          border: "border-[#E3D1C1]",
          label: "Bronze"
        };
    }
  };

  const { bg, text, border, label } = getStyles(tier);

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${bg} ${text} ${border}`}>
      <FiAward className="text-[11px]" />
      {label}
    </span>
  );
}
