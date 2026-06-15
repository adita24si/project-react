import React from "react";

export default function PremiumStatCard({ icon, value, label, description, theme = "primary", active, onClick }) {
  const getThemeConfig = (t) => {
    switch (t) {
      case "danger":
        return {
          bg: "from-[#FDF8F8] to-[#FAF2F2]",
          border: active ? "border-[#B85C5C]" : "border-[#E8E2DD] hover:border-[#B85C5C]/50",
          iconBg: "bg-[#F2E6E6] text-[#B85C5C]",
          glow: "group-hover:shadow-[0_8px_30px_rgba(184,92,92,0.08)]",
          accentBar: "bg-[#B85C5C]"
        };
      case "warning":
        return {
          bg: "from-[#FDF9F5] to-[#FAF4EB]",
          border: active ? "border-[#A86E2E]" : "border-[#E8E2DD] hover:border-[#A86E2E]/50",
          iconBg: "bg-[#F9F0E5] text-[#A86E2E]",
          glow: "group-hover:shadow-[0_8px_30px_rgba(168,110,46,0.08)]",
          accentBar: "bg-[#A86E2E]"
        };
      case "success":
        return {
          bg: "from-[#F6FAF5] to-[#EEF5EC]",
          border: active ? "border-[#4A6B46]" : "border-[#E8E2DD] hover:border-[#4A6B46]/50",
          iconBg: "bg-[#E6ECE5] text-[#4A6B46]",
          glow: "group-hover:shadow-[0_8px_30px_rgba(74,107,70,0.08)]",
          accentBar: "bg-[#4A6B46]"
        };
      case "info":
        return {
          bg: "from-[#F5FAFD] to-[#EDF4F9]",
          border: active ? "border-[#3D5266]" : "border-[#E8E2DD] hover:border-[#3D5266]/50",
          iconBg: "bg-[#ECF2F7] text-[#3D5266]",
          glow: "group-hover:shadow-[0_8px_30px_rgba(61,82,102,0.08)]",
          accentBar: "bg-[#3D5266]"
        };
      case "primary":
      default:
        return {
          bg: "from-[#FCFAF9] to-[#F5ECE5]",
          border: active ? "border-[#79553D]" : "border-[#E8E2DD] hover:border-[#79553D]/50",
          iconBg: "bg-[#F5ECE5] text-[#79553D]",
          glow: "group-hover:shadow-[0_8px_30px_rgba(121,85,61,0.08)]",
          accentBar: "bg-[#79553D]"
        };
    }
  };

  const config = getThemeConfig(theme);

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-b ${config.bg} border ${config.border} transition-all duration-300 hover:-translate-y-1 shadow-xs cursor-pointer select-none flex flex-col justify-between ${config.glow}`}
    >
      {/* Thin color accent line on top */}
      <div className={`absolute top-0 inset-x-0 h-1 ${config.accentBar} opacity-80`} />

      {/* Decorative card shine */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/4 to-white/0 pointer-events-none" />

      {/* Icon & Label */}
      <div className="flex justify-between items-start">
        <div className="text-left">
          <span className="text-[11px] font-bold text-[#8A817A] uppercase tracking-wider block mb-1">
            {label}
          </span>
        </div>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base transition-transform duration-300 group-hover:scale-110 ${config.iconBg}`}>
          {icon}
        </div>
      </div>

      {/* Metric Value */}
      <div className="mt-5 text-left">
        <h3 
          className="text-3xl font-extrabold text-[#2B2420] tracking-tight"
          style={{ fontFamily: "ui-serif, Georgia, Cambria, serif" }}
        >
          {value}
        </h3>
        {description && (
          <p className="text-[10px] text-[#8A817A] mt-1 font-semibold leading-tight">
            {description}
          </p>
        )}
      </div>

      {/* Interactive selection badge */}
      {active && (
        <div className="absolute right-3 bottom-3 flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${config.accentBar} animate-pulse`} />
          <span className="text-[8px] font-extrabold uppercase tracking-wider text-[#8A817A]">
            Selected
          </span>
        </div>
      )}
    </div>
  );
}
