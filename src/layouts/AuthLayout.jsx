import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#F4F1ED] p-4 sm:p-8 font-sans selection:bg-[#79553D] selection:text-white">
      
      {/* =========================================
          BACKGROUND DECORATION (Modern Top Block)
          ========================================= */}
      <div className="absolute top-0 left-0 w-full h-[45%] md:h-[50%] bg-[#2B2420] rounded-b-[2.5rem] md:rounded-b-[4rem] shadow-lg overflow-hidden">
        {/* Abstract glowing accents inside the dark block */}
        <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-[#4A3B32] rounded-full blur-[80px] opacity-70"></div>
        <div className="absolute top-10 right-[-5%] w-72 h-72 bg-[#A67C52] rounded-full blur-[100px] opacity-30"></div>
      </div>

      {/* =========================================
          MAIN AUTHENTICATION CARD
          ========================================= */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(43,36,32,0.2)] border border-[#E8E2DD]/60 overflow-hidden">
        
        {/* Branding Header (Inside the card) */}
        <div className="flex flex-col items-center justify-center pt-10 pb-6 px-8 bg-[#FAFAFA] border-b border-[#F4F1ED]">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-[#A67C52] blur-xl opacity-20 rounded-full"></div>
            <img 
              src="/img/logo.png" 
              alt="TimberCraft Logo" 
              className="relative w-16 h-16 object-contain drop-shadow-sm" 
            />
          </div>
          
          <h1 
            className="text-3xl font-bold text-[#2B2420] tracking-tight"
            style={{ fontFamily: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif" }}
          >
            Timber<span className="text-[#A67C52]">Craft</span>
          </h1>
          <p className="text-sm text-[#8A817A] mt-1.5 font-medium tracking-wide uppercase text-center">
            Admin Portal
          </p>
        </div>

        {/* Dynamic Form Area (Login/Register/Forgot) */}
        <div className="p-8 sm:p-10">
          <Outlet />
        </div>
        
        {/* Footer */}
        <div className="pb-8 text-center bg-white">
          <p className="text-xs text-[#A67C52]/70 font-semibold tracking-wider">
            © 2026 TIMBERCRAFT
          </p>
        </div>

      </div>
    </div>
  );
}