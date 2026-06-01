import { FaChevronRight, FaPlus } from "react-icons/fa";

export default function PageHeader({
  title,
  breadcrumb = [],
  children,
  onAdd,        // optional handler
  addLabel,     // optional button text
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      
      {/* Left Section: Title & Breadcrumb */}
      <div>
        <h1 
          className="text-2xl md:text-3xl font-bold text-[#2B2420] tracking-tight"
          style={{ fontFamily: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif" }}
        >
          {title}
        </h1>

        <div className="flex items-center flex-wrap gap-2 text-sm mt-2 font-medium">
          {Array.isArray(breadcrumb) ? (
            breadcrumb.map((item, index) => {
              const isLast = index === breadcrumb.length - 1;
              return (
                <span key={index} className="flex items-center gap-2">
                  <span
                    className={`transition-colors ${
                      isLast
                        ? "text-[#A67C52] font-bold" // Warna aksen emas/coklat terang untuk halaman saat ini
                        : "text-[#8A817A] hover:text-[#2B2420] cursor-pointer"
                    }`}
                  >
                    {item}
                  </span>
                  {!isLast && (
                    <FaChevronRight className="text-[10px] text-[#D4CFC9] mt-[1px]" />
                  )}
                </span>
              );
            })
          ) : (
            <span className="text-[#8A817A]">{breadcrumb}</span>
          )}
        </div>
      </div>

      {/* Right Section: Action Buttons / Children */}
      <div className="w-full sm:w-auto flex justify-end">
        {children ? (
          children
        ) : onAdd ? (
          <button
            onClick={onAdd}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#79553D] hover:bg-[#614330] text-white px-5 py-2.5 rounded-xl shadow-sm shadow-[#79553D]/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#79553D] transition-all duration-200 active:scale-[0.98] font-bold text-sm"
          >
            <FaPlus className="text-xs" />
            {addLabel || "Add New"}
          </button>
        ) : null}
      </div>
      
    </div>
  );
}