import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";

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
  errorBg: "#FEF2F2",
  errorBorder: "#FECACA",
  errorText: "#DC2626"
};

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [dataForm, setDataForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    role: "Store Manager",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm({ ...dataForm, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!agreed) {
      setError("You must agree to the Terms of Service and Privacy Policy");
      return;
    }

    if (dataForm.password !== dataForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (dataForm.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: dataForm.email,
        password: dataForm.password,
        options: {
          data: {
            full_name: dataForm.name,
            phone_number: dataForm.phoneNumber,
            address: dataForm.address,
            role: dataForm.role
          }
        }
      });

      if (signUpError) throw signUpError;

      setSuccess("Account created successfully! Please check your email for confirmation.");
      setDataForm({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        role: "Store Manager",
        password: "",
        confirmPassword: ""
      });
      setAgreed(false);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h2
          className="text-2xl font-bold tracking-tight mb-2"
          style={{ color: C.dark, fontFamily: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif" }}
        >
          Create your account
        </h2>
        <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
          Set up your TimberCraft admin access in just a few steps.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs mb-5"
          style={{ background: C.errorBg, border: `1px solid ${C.errorBorder}`, color: C.errorText }}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs mb-5"
          style={{ background: C.successBg, border: `1px solid ${C.successBorder}`, color: C.successText }}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{success}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: C.dark }}>
            Full Name
          </label>
          <input
            type="text"
            name="name"
            id="register-name"
            value={dataForm.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 outline-none"
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
          <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: C.dark }}>
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="register-email"
            value={dataForm.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 outline-none"
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

        {/* Phone Number & Role Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: C.dark }}>
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={dataForm.phoneNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 outline-none"
              style={{ background: C.inputBg, border: `1.5px solid ${C.border}`, color: C.dark }}
              onFocus={(e) => {
                e.target.style.borderColor = C.primary;
                e.target.style.boxShadow = `0 0 0 3px rgba(121,85,61,0.08)`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = C.border;
                e.target.style.boxShadow = "none";
              }}
              placeholder="e.g. 081298765432"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: C.dark }}>
              CRM Role
            </label>
            <select
              name="role"
              value={dataForm.role}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 outline-none bg-white"
              style={{ background: C.inputBg, border: `1.5px solid ${C.border}`, color: C.dark }}
              onFocus={(e) => {
                e.target.style.borderColor = C.primary;
                e.target.style.boxShadow = `0 0 0 3px rgba(121,85,61,0.08)`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = C.border;
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="Store Manager">Store Manager</option>
              <option value="Sales Designer">Sales Designer</option>
              <option value="Administrator">Administrator</option>
              <option value="Sales Representative">Sales Representative</option>
            </select>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: C.dark }}>
            Home Address
          </label>
          <input
            type="text"
            name="address"
            value={dataForm.address}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 outline-none"
            style={{ background: C.inputBg, border: `1.5px solid ${C.border}`, color: C.dark }}
            onFocus={(e) => {
              e.target.style.borderColor = C.primary;
              e.target.style.boxShadow = `0 0 0 3px rgba(121,85,61,0.08)`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = C.border;
              e.target.style.boxShadow = "none";
            }}
            placeholder="e.g. Jl. Dago No. 102, Bandung"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: C.dark }}>
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="register-password"
              value={dataForm.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 pr-12 rounded-lg text-xs font-medium transition-all duration-200 outline-none"
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
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: C.dark }}>
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="register-confirm-password"
            value={dataForm.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 outline-none"
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
          <label htmlFor="register-terms" className="text-[11px] leading-relaxed cursor-pointer select-none" style={{ color: C.muted }}>
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
            disabled={loading}
            className="w-full flex justify-center items-center py-3.5 px-4 rounded-lg text-xs font-bold text-white transition-all duration-200 cursor-pointer disabled:opacity-50"
            style={{
              background: C.primary,
              border: "none",
              boxShadow: "0 2px 8px rgba(121,85,61,0.25)",
            }}
            onMouseEnter={(e) => {
              if (loading) return;
              e.target.style.background = "#614330";
              e.target.style.transform = "translateY(-1px)";
              e.target.style.boxShadow = "0 4px 12px rgba(121,85,61,0.3)";
            }}
            onMouseLeave={(e) => {
              if (loading) return;
              e.target.style.background = C.primary;
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(121,85,61,0.25)";
            }}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px" style={{ background: C.border }} />
        <span className="text-xs font-medium" style={{ color: C.muted }}>OR</span>
        <div className="flex-1 h-px" style={{ background: C.border }} />
      </div>

      {/* Login link */}
      <p className="text-center text-xs" style={{ color: C.muted }}>
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