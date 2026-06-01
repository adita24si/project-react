import React from "react";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

export default function StatCard({ icon, value, label, delta, color = "#79553D" }) {
  const isPositive = delta ? delta > 0 : false;

  return (
    <div className="bg-[#FAFAFA] border border-[#E8E2DD] rounded-xl p-6 transition-all duration-200 hover:border-[#79553D]/40">
      <div className="flex justify-between items-start">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center text-sm"
          style={{ backgroundColor: `${color}15`, color: color }}
        >
          {icon}
        </div>
        {delta !== undefined && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
              isPositive 
                ? "bg-[#E6ECE5] text-[#4A6B46]" 
                : "bg-[#F2E6E6] text-[#B85C5C]"
            }`}
          >
            {isPositive ? <FiTrendingUp className="text-[10px]" /> : <FiTrendingDown className="text-[10px]" />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <span className="text-[13px] text-[#8A817A] font-medium block mb-1">{label}</span>
        <span 
          className="text-2xl font-bold tracking-tight text-[#2B2420]"
          style={{ fontFamily: "ui-serif, Georgia, Cambria, serif" }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}
