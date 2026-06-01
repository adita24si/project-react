import React from "react";

export default function InfoRow({ label, value, icon }) {
  return (
    <div className="flex justify-between items-center py-3.5 border-b border-[#E8E2DD]/60 last:border-0 last:pb-0">
      <div className="flex items-center gap-2 text-xs font-semibold text-[#8A817A] uppercase tracking-wider">
        {icon && <span className="text-[#8A817A]/80">{icon}</span>}
        {label}
      </div>
      <div className="text-sm font-semibold text-[#2B2420] text-right">
        {value || "-"}
      </div>
    </div>
  );
}
