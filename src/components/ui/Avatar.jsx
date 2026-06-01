import React from "react";

export default function Avatar({ name = "User", size = "md", src, className = "" }) {
  const getInitials = (n) => {
    const parts = n.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0] ? parts[0][0].toUpperCase() : "U";
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-lg font-bold",
  };

  return (
    <div className={`relative inline-flex items-center justify-center rounded-full overflow-hidden flex-shrink-0 ${className}`}>
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div 
          className={`w-full h-full rounded-full flex items-center justify-center font-semibold text-white bg-[#79553D] ${sizeClasses[size] || sizeClasses.md}`}
        >
          {getInitials(name)}
        </div>
      )}
    </div>
  );
}
