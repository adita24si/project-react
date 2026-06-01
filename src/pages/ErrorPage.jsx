import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";

export default function ErrorPage({
  code = "404",
  description = "We couldn't find the page you're looking for. It might have been moved or deleted.",
  image,
}) {
  // Fungsi pembantu untuk mendapatkan judul yang rapi
  const getTitle = () => {
    switch (String(code)) {
      case "404": return "Page Not Found";
      case "400": return "Bad Request";
      case "401": return "Unauthorized Access";
      case "403": return "Access Forbidden";
      case "500": return "Internal Server Error";
      default: return "Something Went Wrong";
    }
  };

  return (
    <div className="flex relative items-center justify-center min-h-[80vh] px-6 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      
      {/* Efek Glow Latar Belakang */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#A67C52]/15 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="relative text-center max-w-md z-10 flex flex-col items-center">
        
        {/* Gambar Kustom (Opsional) */}
        {image && (
          <img
            src={image}
            alt={`error-${code}`}
            className="w-48 sm:w-56 object-contain drop-shadow-md mb-8 animate-in slide-in-from-bottom-4 duration-500"
          />
        )}

        {/* Tipografi Kode Error yang Elegan */}
        {!image && (
          <div 
            className="relative mb-4"
            style={{ fontFamily: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif" }}
          >
            {/* Bayangan Angka Raksasa di Belakang */}
            <h1 className="text-[6rem] sm:text-[8rem] font-black text-[#A67C52]/20 leading-none tracking-tighter select-none">
              {code}
            </h1>
            {/* Angka Utama di Depan */}
            <div className="absolute inset-0 flex items-center justify-center text-4xl sm:text-5xl font-bold text-[#2B2420]">
              {code}
            </div>
          </div>
        )}

        {/* Judul & Deskripsi */}
        <h2 
          className="text-2xl font-bold text-[#2B2420] tracking-tight mt-2"
          style={{ fontFamily: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif" }}
        >
          {getTitle()}
        </h2>
        
        <p className="text-[#8A817A] font-medium mt-3 text-sm sm:text-base leading-relaxed">
          {description}
        </p>

        {/* Tombol Kembali ke Dashboard */}
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 mt-8 bg-[#79553D] hover:bg-[#614330] text-white font-bold px-6 py-3 rounded-xl shadow-md shadow-[#79553D]/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#79553D] transition-all duration-200 active:scale-[0.98]"
        >
          <FiHome className="text-lg" />
          Back to Dashboard
        </Link>
        
      </div>
    </div>
  );
}