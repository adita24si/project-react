import React from "react";
import { FiGift, FiAward, FiAlertCircle, FiTrendingUp } from "react-icons/fi";

export default function NotificationItem({ title, description, time, type, isRead, onClick }) {
  const getStyles = () => {
    switch (type) {
      case "promo":
        return {
          icon: <FiGift className="text-sm" />,
          bg: "bg-[#E6ECE5]",
          color: "text-[#4A6B46]",
        };
      case "membership":
        return {
          icon: <FiAward className="text-sm" />,
          bg: "bg-[#FDF6E3]",
          color: "text-[#967132]",
        };
      case "complaint":
        return {
          icon: <FiAlertCircle className="text-sm" />,
          bg: "bg-[#F2E6E6]",
          color: "text-[#B85C5C]",
        };
      case "activity":
      default:
        return {
          icon: <FiTrendingUp className="text-sm" />,
          bg: "bg-[#ECF2F7]",
          color: "text-[#3D5266]",
        };
    }
  };

  const { icon, bg, color } = getStyles();

  return (
    <div 
      onClick={onClick}
      className={`flex items-start gap-4 p-4 border border-[#E8E2DD]/60 rounded-xl transition-all duration-150 cursor-pointer ${
        isRead ? "bg-white hover:bg-[#FAFAFA]" : "bg-[#FDFBF9] border-[#79553D]/20 hover:bg-[#F9F5F2]"
      }`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${bg} ${color}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <p className={`text-sm ${isRead ? "font-semibold text-[#2B2420]" : "font-bold text-[#2B2420]"} truncate`}>
            {title}
          </p>
          {!isRead && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#79553D] flex-shrink-0 mt-1.5" />
          )}
        </div>
        <p className="text-xs text-[#8A817A] mt-0.5 leading-relaxed">{description}</p>
        <span className="text-[10px] text-[#8A817A] font-medium block mt-2">{time}</span>
      </div>
    </div>
  );
}
