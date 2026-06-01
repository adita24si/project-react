import React from "react";
import { FiShoppingBag, FiAlertCircle, FiAward, FiCalendar, FiGift } from "react-icons/fi";

export default function ActivityItem({ title, description, time, type }) {
  const getIcon = () => {
    switch (type) {
      case "purchase":
        return {
          icon: <FiShoppingBag className="text-sm" />,
          bg: "bg-[#F5ECE5]",
          color: "text-[#79553D]",
        };
      case "complaint":
        return {
          icon: <FiAlertCircle className="text-sm" />,
          bg: "bg-[#F2E6E6]",
          color: "text-[#B85C5C]",
        };
      case "membership":
        return {
          icon: <FiAward className="text-sm" />,
          bg: "bg-[#FDF6E3]",
          color: "text-[#967132]",
        };
      case "consultation":
        return {
          icon: <FiCalendar className="text-sm" />,
          bg: "bg-[#ECF2F7]",
          color: "text-[#3D5266]",
        };
      case "promo":
      default:
        return {
          icon: <FiGift className="text-sm" />,
          bg: "bg-[#E6ECE5]",
          color: "text-[#4A6B46]",
        };
    }
  };

  const { icon, bg, color } = getIcon();

  return (
    <div className="flex gap-4 items-start py-3.5 border-b border-[#E8E2DD]/40 last:border-0 last:pb-0">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${bg} ${color}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#2B2420] truncate">{title}</p>
        <p className="text-xs text-[#8A817A] mt-0.5 leading-relaxed">{description}</p>
      </div>
      <div className="text-[10px] text-[#8A817A] font-medium whitespace-nowrap self-start mt-0.5">
        {time}
      </div>
    </div>
  );
}
