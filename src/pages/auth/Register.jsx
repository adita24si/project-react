import { Link } from "react-router-dom";
import { useState } from "react";

const C = {
  primary: "#79553D",
  primaryLight: "#A67C52",
  dark: "#2B2420",
  muted: "#8A817A",
  border: "#E8E2DD",
  inputBg: "#FAFAF8",
  successBg: "#F0FDF4",
  successBorder: "#BBF7D0",
  successText: "#16A34A",
};

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h2
          className="text-2xl font-bold tracking-tight mb-2"
          style={{ color: C.dark, fontFamily: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif" }}
        >
          Create your account
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
          Set up your TimberCraft admin access in just a few steps.
        </p>
      </div>

      {/* Form */}
      <form className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: C.dark }}>
            Full Name
          </label>
          <input
            type="text"
            id="register-name"
            required
            className="w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 outline-none"
            style={{ background: C.inputBg, border: `1.5px solid ${C.border}`, color: C.dark }}
            onFocus={(e) => {
              e.target.style.borderColor = C.primary;
              e.target.style.boxShadow = `0 0 0 3px rgba(121,85,61,0.08)`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = C.border;
              e.target.style.boxShadow = "none";
            }}
            placeholder="Enter your full name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: C.dark }}>
            Email Address
          </label>
          <input
            type="email"
            id="register-email"
            required
            className="w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 outline-none"
            style={{ background: C.inputBg, border: `1.5px solid ${C.border}`, color: C.dark }}
            onFocus={(e) => {
              e.target.style.borderColor = C.primary;
              e.target.style.boxShadow = `0 0 0 3px rgba(121,85,61,0.08)`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = C.border;
              e.target.style.boxShadow = "none";
            }}
            placeholder="you@example.com"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: C.dark }}>
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="register-password"
              required
              className="w-full px-4 py-3 pr-12 rounded-lg text-sm font-medium transition-all duration-200 outline-none"
              style={{ background: C.inputBg, border: `1.5px solid ${C.border}`, color: C.dark }}
              onFocus={(e) => {
                e.target.style.borderColor = C.primary;
                e.target.style.boxShadow = `0 0 0 3px rgba(121,85,61,0.08)`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = C.border;
                e.target.style.boxShadow = "none";
              }}
              placeholder="Min. 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors"
              style={{ color: C.muted, background: "transparent", border: "none" }}
              onMouseEnter={(e) => (e.target.style.color = C.dark)}
              onMouseLeave={(e) => (e.target.style.color = C.muted)}
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {/* Password strength indicator */}
          <div className="flex gap-1.5 mt-2.5">
            <div className="flex-1 h-1 rounded-full" style={{ background: C.primary }} />
            <div className="flex-1 h-1 rounded-full" style={{ background: C.primary, opacity: 0.6 }} />
            <div className="flex-1 h-1 rounded-full" style={{ background: C.border }} />
            <div className="flex-1 h-1 rounded-full" style={{ background: C.border }} />
          </div>
          <p className="text-[11px] font-medium mt-1.5" style={{ color: C.muted }}>
            Use 8+ characters with a mix of letters, numbers & symbols
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: C.dark }}>
            Confirm Password
          </label>
          <input
            type="password"
            id="register-confirm-password"
            required
            className="w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 outline-none"
            style={{ background: C.inputBg, border: `1.5px solid ${C.border}`, color: C.dark }}
            onFocus={(e) => {
              e.target.style.borderColor = C.primary;
              e.target.style.boxShadow = `0 0 0 3px rgba(121,85,61,0.08)`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = C.border;
              e.target.style.boxShadow = "none";
            }}
            placeholder="••••••••"
          />
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2.5 pt-1">
          <input
            type="checkbox"
            id="register-terms"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 rounded cursor-pointer accent-[#79553D] mt-0.5"
          />
          <label htmlFor="register-terms" className="text-xs leading-relaxed cursor-pointer select-none" style={{ color: C.muted }}>
            I agree to the{" "}
            <span className="font-semibold" style={{ color: C.primaryLight }}>Terms of Service</span>
            {" "}and{" "}
            <span className="font-semibold" style={{ color: C.primaryLight }}>Privacy Policy</span>
          </label>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            id="register-submit"
            className="w-full flex justify-center items-center py-3.5 px-4 rounded-lg text-sm font-bold text-white transition-all duration-200 cursor-pointer"
            style={{
              background: C.primary,
              border: "none",
              boxShadow: "0 2px 8px rgba(121,85,61,0.25)",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#614330";
              e.target.style.transform = "translateY(-1px)";
              e.target.style.boxShadow = "0 4px 12px rgba(121,85,61,0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = C.primary;
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(121,85,61,0.25)";
            }}
          >
            Create Account
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-7">
        <div className="flex-1 h-px" style={{ background: C.border }} />
        <span className="text-xs font-medium" style={{ color: C.muted }}>OR</span>
        <div className="flex-1 h-px" style={{ background: C.border }} />
      </div>

      {/* Login link */}
      <p className="text-center text-sm" style={{ color: C.muted }}>
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-bold no-underline transition-colors"
          style={{ color: C.primaryLight }}
          onMouseEnter={(e) => (e.target.style.color = C.primary)}
          onMouseLeave={(e) => (e.target.style.color = C.primaryLight)}
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}