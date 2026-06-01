import React from "react";
import { FiX } from "react-icons/fi";

export default function Modal({ isOpen, onClose, title, children, size = "md" }) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B2420]/30 backdrop-blur-xs">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div 
        className={`w-full bg-white border border-[#E8E2DD] rounded-xl shadow-lg relative z-10 overflow-hidden transform transition-all ${
          sizeClasses[size] || sizeClasses.md
        }`}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#E8E2DD]/80 bg-[#FAFAFA]/50">
          <h3 
            className="text-sm font-semibold text-[#2B2420]"
            style={{ fontFamily: "ui-serif, Georgia, Cambria, serif" }}
          >
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-[#8A817A] hover:text-[#2B2420] hover:bg-[#EFEBE7]/50 transition-colors"
          >
            <FiX className="text-base" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
