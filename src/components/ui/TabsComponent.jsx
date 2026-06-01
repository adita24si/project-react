import React from "react";

export default function TabsComponent({ tabs, activeTab, onTabChange }) {
  return (
    <div className="border-b border-[#E8E2DD] flex gap-6 overflow-x-auto scrollbar-none mb-6">
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex items-center gap-2 pb-3.5 pt-1 text-sm font-semibold border-b-2 transition-all duration-150 whitespace-nowrap outline-none ${
              isActive
                ? "border-[#79553D] text-[#79553D]"
                : "border-transparent text-[#8A817A] hover:text-[#2B2420]"
            }`}
          >
            {tab.icon && <span className="text-base">{tab.icon}</span>}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
