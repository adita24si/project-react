import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const C = {
  primary: "#79553D",
  primaryLight: "#A67C52",
  dark: "#2B2420",
  muted: "#8A817A",
  border: "#E8E2DD",
  inputBg: "#FAFAF8",
  errorBg: "#FEF2F2",
  errorBorder: "#FECACA",
  errorText: "#DC2626",
};

export default function Login() {
  const navigate = useNavigate();

  const [dataForm, setDataForm] = useState({
    email: "emilys",
    password: "emilyspass",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm({ ...dataForm, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://dummyjson.com/user/login",
        {
          username: dataForm.email,
          password: dataForm.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Username atau password salah"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h2
          className="text-2xl font-bold tracking-tight mb-2"
          style={{ color: C.dark, fontFamily: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif" }}
        >
          Sign in to your account
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
          Enter your credentials to access the dashboard.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div
          className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm mb-6"
          style={{ background: C.errorBg, border: `1px solid ${C.errorBorder}`, color: C.errorText }}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Username */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: C.dark }}>
            Username
          </label>
          <input
            type="text"
            name="email"
            id="login-username"
            value={dataForm.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 outline-none"
            style={{
              background: C.inputBg,
              border: `1.5px solid ${C.border}`,
              color: C.dark,
            }}
            onFocus={(e) => {
              e.target.style.borderColor = C.primary;
              e.target.style.boxShadow = `0 0 0 3px rgba(121,85,61,0.08)`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = C.border;
              e.target.style.boxShadow = "none";
            }}
            placeholder="Enter your username"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: C.dark }}>
              Password
            </label>
            <Link
              to="/forgot"
              className="text-xs font-semibold no-underline transition-colors duration-150"
              style={{ color: C.primaryLight }}
              onMouseEnter={(e) => (e.target.style.color = C.primary)}
              onMouseLeave={(e) => (e.target.style.color = C.primaryLight)}
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="login-password"
              value={dataForm.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 pr-12 rounded-lg text-sm font-medium transition-all duration-200 outline-none"
              style={{
                background: C.inputBg,
                border: `1.5px solid ${C.border}`,
                color: C.dark,
              }}
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

        {/* Remember Me */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="remember-me"
            className="w-4 h-4 rounded cursor-pointer accent-[#79553D]"
          />
          <label htmlFor="remember-me" className="text-sm cursor-pointer select-none" style={{ color: C.muted }}>
            Remember me for 30 days
          </label>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            disabled={loading}
            type="submit"
            id="login-submit"
            className="w-full flex justify-center items-center py-3.5 px-4 rounded-lg text-sm font-bold text-white transition-all duration-200 cursor-pointer"
            style={{
              background: loading ? C.primaryLight : C.primary,
              border: "none",
              boxShadow: loading ? "none" : `0 2px 8px rgba(121,85,61,0.25)`,
              opacity: loading ? 0.8 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.background = "#614330";
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 4px 12px rgba(121,85,61,0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.background = C.primary;
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 2px 8px rgba(121,85,61,0.25)";
              }
            }}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-7">
        <div className="flex-1 h-px" style={{ background: C.border }} />
        <span className="text-xs font-medium" style={{ color: C.muted }}>OR</span>
        <div className="flex-1 h-px" style={{ background: C.border }} />
      </div>

      {/* Register link */}
      <p className="text-center text-sm" style={{ color: C.muted }}>
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-bold no-underline transition-colors"
          style={{ color: C.primaryLight }}
          onMouseEnter={(e) => (e.target.style.color = C.primary)}
          onMouseLeave={(e) => (e.target.style.color = C.primaryLight)}
        >
          Create account
        </Link>
      </p>
    </div>
  );
}