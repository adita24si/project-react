export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#F4F1ED]/80 backdrop-blur-sm">
      <div className="relative flex flex-col items-center">
        
        {/* Efek Glow di Belakang Logo (Animasi Pulse) */}
        <div className="absolute top-2 w-20 h-20 bg-[#A67C52]/30 rounded-full blur-2xl animate-pulse"></div>

        {/* Logo TimberCraft */}
        <img
          src="/img/logo.png"
          alt="TimberCraft Logo"
          className="w-50 h-50 object-contain relative z-10 mb-6 drop-shadow-md transition-transform hover:scale-105 duration-300"
        />

        {/* Spinner Elegan (Dua lapis border) */}
        <div className="relative w-10 h-10 mb-5">
          {/* Track / Lingkaran background abu pudar */}
          <div className="absolute inset-0 border-[3px] border-[#E8E2DD] rounded-full"></div>
          {/* Spinner cokelat yang berputar */}
          <div className="absolute inset-0 border-[3px] border-[#79553D] border-t-transparent rounded-full animate-spin"></div>
        </div>

        {/* Teks Loading */}
        <p 
          className="text-[#2B2420] font-bold tracking-tight text-lg"
          style={{ fontFamily: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif" }}
        >
          Crafting your workspace...
        </p>
        <p className="text-sm text-[#8A817A] font-medium mt-1.5 animate-pulse">
          Please wait a moment
        </p>
        
      </div>
    </div>
  );
}