import { Link } from "react-router-dom";
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
  errorText: "#DC2626",
};

export default function Forgot() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/login",
      });

      if (resetError) throw resetError;

      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-full text-center">
        {/* Success State */}
        <div className="mb-6">
          <div
            className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-5"
            style={{ background: C.successBg, border: `1.5px solid ${C.successBorder}` }}
          >
            <svg className="w-6 h-6" fill="none" stroke={C.successText} strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2
            className="text-2xl font-bold tracking-tight mb-2"
            style={{ color: C.dark, fontFamily: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif" }}
          >
            Check your email
          </h2>
          <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: C.muted }}>
            We've sent a password reset link to <strong style={{ color: C.dark }}>{email}</strong>. Please check your inbox.
          </p>
        </div>

        {/* Info box */}
        <div
          className="rounded-lg p-4 mb-6 text-left"
          style={{ background: C.inputBg, border: `1px solid ${C.border}` }}
        >
          <p className="text-xs font-semibold mb-2" style={{ color: C.dark }}>Didn't receive the email?</p>
          <ul className="text-xs space-y-1.5" style={{ color: C.muted }}>
            <li className="flex items-start gap-2">
              <span style={{ color: C.primaryLight }}>•</span>
              Check your spam or junk folder
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: C.primaryLight }}>•</span>
              Make sure the email address is correct
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: C.primaryLight }}>•</span>
              Wait a few minutes and try again
            </li>
          </ul>
        </div>

        {/* Resend */}
        <button
          onClick={() => setSubmitted(false)}
          className="text-sm font-semibold transition-colors cursor-pointer"
          style={{ color: C.primaryLight, background: "transparent", border: "none" }}
          onMouseEnter={(e) => (e.target.style.color = C.primary)}
          onMouseLeave={(e) => (e.target.style.color = C.primaryLight)}
        >
          Try a different email
        </button>

        {/* Back to login */}
        <div className="mt-8">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold no-underline transition-colors"
            style={{ color: C.muted }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.dark)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-5"
          style={{ background: `rgba(121,85,61,0.08)` }}
        >
          <svg className="w-5 h-5" fill="none" stroke={C.primary} strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h2
          className="text-2xl font-bold tracking-tight mb-2"
          style={{ color: C.dark, fontFamily: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif" }}
        >
          Reset your password
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
          Enter the email associated with your account and we'll send you a reset link.
        </p>
      </div>

      {/* Error Alert */}
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
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: C.dark }}>
            Email Address
          </label>
          <input
            type="email"
            id="forgot-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            placeholder="you@example.com"
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3.5 px-4 rounded-lg text-sm font-bold text-white transition-all duration-200 cursor-pointer disabled:opacity-50"
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
            {loading ? "Sending link..." : "Send Reset Link"}
          </button>
        </div>
      </form>

      {/* Back to login */}
      <div className="text-center mt-8">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold no-underline transition-colors"
          style={{ color: C.muted }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.dark)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to sign in
        </Link>
      </div>
    </div>
  );
}