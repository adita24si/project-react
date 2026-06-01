import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const C = {
  primary: "#79553D",
  primaryLight: "#A67C52",
  bg: "#FAFAF8",
  dark: "#2B2420",
  muted: "#8A817A",
  border: "#E8E2DD",
  cream: "#F5ECE5",
};

// Animated dots/particles for subtle background interest
function FloatingDots() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${4 + i * 2}px`,
            height: `${4 + i * 2}px`,
            background: `rgba(166, 124, 82, ${0.08 + i * 0.03})`,
            top: `${15 + i * 17}%`,
            left: `${10 + i * 18}%`,
            animation: `float-dot ${6 + i * 2}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.8}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function AuthLayout() {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine current page for dynamic left panel content
  const getPageInfo = () => {
    const path = location.pathname;
    if (path.includes("register")) {
      return {
        heading: "Join the team",
        sub: "Start managing your furniture business with TimberCraft's powerful CRM tools.",
        stat1: { value: "500+", label: "Active Stores" },
        stat2: { value: "98%", label: "Satisfaction" },
      };
    }
    if (path.includes("forgot")) {
      return {
        heading: "We've got you",
        sub: "Don't worry — resetting your password is quick and secure.",
        stat1: { value: "24/7", label: "Support" },
        stat2: { value: "<1min", label: "Reset Time" },
      };
    }
    return {
      heading: "Welcome back",
      sub: "Manage customers, track orders, and grow your furniture business — all in one place.",
      stat1: { value: "12K+", label: "Customers" },
      stat2: { value: "2.4M", label: "Revenue" },
    };
  };

  const info = getPageInfo();

  return (
    <>
      {/* Keyframe animations */}
      <style>{`
        @keyframes float-dot {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-20px) scale(1.3); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .auth-enter {
          animation: fade-in-scale 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .stat-enter {
          animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div
        className="min-h-screen flex font-sans"
        style={{ background: C.bg, fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        {/* ============================
            LEFT PANEL — Brand Showcase
            ============================ */}
        <div
          className="hidden lg:flex lg:w-[48%] xl:w-[45%] relative flex-col justify-between p-10 xl:p-14"
          style={{ background: C.dark }}
        >
          {/* Subtle gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(160deg, rgba(121,85,61,0.15) 0%, transparent 50%, rgba(166,124,82,0.08) 100%)`,
            }}
          />

          <FloatingDots />

          {/* Top — Brand Logo */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: C.primary }}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div>
                <span
                  className="text-sm font-extrabold tracking-[0.15em] uppercase text-white"
                  style={{ letterSpacing: "0.15em" }}
                >
                  TimberCraft
                </span>
                <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Furniture CRM
                </p>
              </div>
            </div>
          </div>

          {/* Center — Hero Content */}
          <div
            className={`relative z-10 ${mounted ? "stat-enter" : "opacity-0"}`}
            style={{ animationDelay: "0.15s" }}
          >
            <h2
              className="text-4xl xl:text-5xl font-bold leading-tight text-white mb-5"
              style={{ fontFamily: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif" }}
            >
              {info.heading}
            </h2>
            <p className="text-base leading-relaxed max-w-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
              {info.sub}
            </p>

            {/* Stats Row */}
            <div className="flex items-center gap-8 mt-10">
              <div
                className={`${mounted ? "stat-enter" : "opacity-0"}`}
                style={{ animationDelay: "0.3s" }}
              >
                <p className="text-3xl font-bold text-white">{info.stat1.value}</p>
                <p className="text-xs font-medium mt-1 uppercase tracking-wider" style={{ color: C.primaryLight }}>
                  {info.stat1.label}
                </p>
              </div>
              <div className="w-px h-12" style={{ background: "rgba(255,255,255,0.12)" }} />
              <div
                className={`${mounted ? "stat-enter" : "opacity-0"}`}
                style={{ animationDelay: "0.45s" }}
              >
                <p className="text-3xl font-bold text-white">{info.stat2.value}</p>
                <p className="text-xs font-medium mt-1 uppercase tracking-wider" style={{ color: C.primaryLight }}>
                  {info.stat2.label}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom — Testimonial / Trust Badge */}
          <div
            className={`relative z-10 ${mounted ? "stat-enter" : "opacity-0"}`}
            style={{ animationDelay: "0.6s" }}
          >
            <div
              className="rounded-xl p-5"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="text-sm italic leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                "TimberCraft CRM transformed how we manage our furniture business. Customer retention improved by 40%."
              </p>
              <div className="flex items-center gap-3 mt-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: C.primary }}
                >
                  AR
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Adi Rahmat</p>
                  <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Owner, Modern Living Co.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[10px] font-medium mt-6 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>
              © 2026 TimberCraft Studio — Admin Portal
            </p>
          </div>
        </div>

        {/* ============================
            RIGHT PANEL — Auth Form
            ============================ */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 relative">
          {/* Subtle decorative corner accent */}
          <div
            className="absolute top-0 right-0 w-64 h-64 pointer-events-none opacity-30"
            style={{
              background: `radial-gradient(circle at 100% 0%, ${C.cream} 0%, transparent 70%)`,
            }}
          />

          <div className="w-full max-w-[420px] relative z-10">
            {/* Mobile-only brand header */}
            <div className="lg:hidden text-center mb-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: C.primary }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <span
                  className="text-sm font-extrabold tracking-[0.15em] uppercase"
                  style={{ color: C.dark }}
                >
                  TimberCraft
                </span>
              </div>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: C.muted }}>
                Admin Portal
              </p>
            </div>

            {/* Auth Form (Outlet) */}
            <div className={mounted ? "auth-enter" : "opacity-0"}>
              <Outlet />
            </div>

            {/* Mobile footer */}
            <div className="lg:hidden text-center mt-10">
              <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: C.muted }}>
                © 2026 TimberCraft Studio
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}