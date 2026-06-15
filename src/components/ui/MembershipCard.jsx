import React from "react";
import { FiAward, FiUsers } from "react-icons/fi";

export default function MembershipCard({ tier, count, active, onClick }) {
  const getTierConfig = (t) => {
    const term = String(t).toLowerCase();
    switch (term) {
      case "vip":
        return {
          gradient: "from-[#111111] via-[#2D2A26] to-[#0A0A0A]",
          textColor: "text-[#F1E5D1]",
          subColor: "text-[#C9B396]",
          borderColor: active ? "border-[#D4AF37]" : "border-[#E8E2DD]/20",
          shadowColor: "hover:shadow-[0_8px_30px_rgb(212,175,55,0.15)]",
          glow: "bg-[#D4AF37]/5",
          cardNumber: "•••• •••• •••• 9999",
          badgeBg: "bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30"
        };
      case "platinum":
        return {
          gradient: "from-[#1B2838] via-[#2A3E56] to-[#0D151E]",
          textColor: "text-[#E6EFF8]",
          subColor: "text-[#9EB9D4]",
          borderColor: active ? "border-[#96C2EC]" : "border-[#E8E2DD]/20",
          shadowColor: "hover:shadow-[0_8px_30px_rgb(150,194,236,0.15)]",
          glow: "bg-[#96C2EC]/5",
          cardNumber: "•••• •••• •••• 8888",
          badgeBg: "bg-[#96C2EC]/20 text-[#96C2EC] border-[#96C2EC]/30"
        };
      case "gold":
        return {
          gradient: "from-[#59421A] via-[#85652D] to-[#402F12]",
          textColor: "text-[#FFF5E6]",
          subColor: "text-[#D9B780]",
          borderColor: active ? "border-[#E5C185]" : "border-[#E8E2DD]/20",
          shadowColor: "hover:shadow-[0_8px_30px_rgb(229,193,133,0.15)]",
          glow: "bg-[#E5C185]/5",
          cardNumber: "•••• •••• •••• 7777",
          badgeBg: "bg-[#E5C185]/20 text-[#E5C185] border-[#E5C185]/30"
        };
      case "silver":
        return {
          gradient: "from-[#4B4B4B] via-[#7D7D7D] to-[#333333]",
          textColor: "text-[#FFFFFF]",
          subColor: "text-[#CCCCCC]",
          borderColor: active ? "border-[#E5E5E5]" : "border-[#E8E2DD]/20",
          shadowColor: "hover:shadow-[0_8px_30px_rgb(229,229,229,0.15)]",
          glow: "bg-white/5",
          cardNumber: "•••• •••• •••• 5555",
          badgeBg: "bg-white/20 text-white border-white/30"
        };
      case "bronze":
      default:
        return {
          gradient: "from-[#4F3624] via-[#75553D] to-[#362315]",
          textColor: "text-[#FAF0E6]",
          subColor: "text-[#C9B19C]",
          borderColor: active ? "border-[#79553D]" : "border-[#E8E2DD]/20",
          shadowColor: "hover:shadow-[0_8px_30px_rgb(121,85,61,0.15)]",
          glow: "bg-[#79553D]/5",
          cardNumber: "•••• •••• •••• 1111",
          badgeBg: "bg-[#79553D]/20 text-[#C9B19C] border-[#79553D]/30"
        };
    }
  };

  const config = getTierConfig(tier);

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${config.gradient} border-2 ${config.borderColor} transition-all duration-300 hover:-translate-y-1.5 shadow-md cursor-pointer ${config.shadowColor} select-none aspect-[1.58/1] min-w-[240px] flex-1`}
    >
      {/* Gloss overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none" />

      {/* Decorative shapes */}
      <div className="absolute -right-12 -bottom-12 w-36 h-36 rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full border border-white/10 pointer-events-none" />
      <div className="absolute left-10 top-10 w-20 h-20 rounded-full bg-white/2 pointer-events-none blur-xl" />

      {/* Card Header */}
      <div className="flex justify-between items-start z-10 relative">
        <div className="text-left">
          <span className={`text-[9px] font-bold tracking-widest uppercase opacity-75 ${config.textColor}`}>
            TimberCraft Club
          </span>
          <h3 className={`text-xl font-bold tracking-tight mt-0.5 ${config.textColor}`} style={{ fontFamily: "ui-serif, Georgia, Cambria, serif" }}>
            {tier}
          </h3>
        </div>
        <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${config.badgeBg}`}>
          <FiAward className="text-xs" />
          <span>Tier</span>
        </div>
      </div>

      {/* Card Body (Chip & Count) */}
      <div className="flex justify-between items-end mt-6 z-10 relative">
        {/* Contactless / Chip design */}
        <div className="w-9 h-7 rounded-md bg-amber-400/10 border border-amber-400/20 flex flex-wrap p-1 gap-[2px] relative overflow-hidden">
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-amber-400/20" />
          <div className="absolute inset-y-0 left-1/2 w-[1px] bg-amber-400/20" />
          <div className="w-1.5 h-1.5 rounded-sm bg-amber-400/15" />
          <div className="w-1.5 h-1.5 rounded-sm bg-amber-400/15" />
          <div className="w-1.5 h-1.5 rounded-sm bg-amber-400/15" />
          <div className="w-1.5 h-1.5 rounded-sm bg-amber-400/15" />
        </div>

        {/* Member Count */}
        <div className="text-right">
          <span className={`text-[10px] uppercase tracking-wider block opacity-70 ${config.subColor}`}>
            Total Members
          </span>
          <div className={`flex items-center justify-end gap-1 font-bold text-sm ${config.textColor}`}>
            <FiUsers className="text-xs" />
            <span>{count}</span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-5 pt-3 border-t border-white/5 flex justify-between items-center z-10 relative">
        <span className={`text-[11px] font-mono tracking-widest ${config.subColor}`}>
          {config.cardNumber}
        </span>
        {active && (
          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${config.badgeBg}`}>
            Selected
          </span>
        )}
      </div>
    </div>
  );
}
