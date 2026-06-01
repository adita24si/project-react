import React from "react";

export default function DetailCard({ title, children, action, className = "" }) {
  return (
    <div className={`bg-white border border-[#E8E2DD] rounded-xl overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="flex justify-between items-center px-6 py-4.5 border-b border-[#E8E2DD]/80 bg-[#FAFAFA]/50">
          {title && (
            <h3 
              className="text-sm font-semibold text-[#2B2420] tracking-tight"
              style={{ fontFamily: "ui-serif, Georgia, Cambria, serif" }}
            >
              {title}
            </h3>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
