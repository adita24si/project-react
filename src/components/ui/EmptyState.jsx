import React from "react";

export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white border border-[#E8E2DD] rounded-xl">
      {icon && (
        <div className="text-[#8A817A] opacity-40 text-4xl mb-4">
          {icon}
        </div>
      )}
      <h3 
        className="text-base font-semibold text-[#2B2420] tracking-tight mb-1"
        style={{ fontFamily: "ui-serif, Georgia, Cambria, serif" }}
      >
        {title}
      </h3>
      <p className="text-xs text-[#8A817A] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
}
