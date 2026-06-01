import { Link } from "react-router-dom";

export default function Forgot() {
  return (
    <div className="w-full space-y-8 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header Form */}
      <div className="text-center">
        <h2 
          className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2B2420]"
          style={{ fontFamily: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif" }}
        >
          Forgot Password?
        </h2>
        <p className="mt-2 text-sm text-[#8A817A] font-medium leading-relaxed">
          No worries! Enter your email address below and we'll send you a link to reset your password.
        </p>
      </div>

      {/* Form */}
      <form className="space-y-6">
        
        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-[#2B2420] mb-1.5"
          >
            Email address
          </label>
          <input
            type="email"
            id="email"
            required
            className="appearance-none block w-full px-4 py-3 border border-[#E8E2DD] rounded-xl shadow-sm text-[#2B2420] placeholder-[#8A817A] focus:outline-none focus:ring-2 focus:ring-[#79553D]/30 focus:border-[#79553D] transition-all duration-200 bg-[#FAFAFA] focus:bg-white sm:text-sm"
            placeholder="you@example.com"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md shadow-[#79553D]/20 text-sm font-bold text-white bg-[#79553D] hover:bg-[#614330] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#79553D] transition-all duration-200 active:scale-[0.98]"
          >
            Send Reset Link
          </button>
        </div>
      </form>

      {/* Footer Text */}
      <div className="text-center text-sm text-[#8A817A] font-medium mt-8">
        Remember your password?{" "}
        <Link 
          to="/login" 
          className="font-bold text-[#A67C52] hover:text-[#79553D] transition-colors"
        >
          Back to login
        </Link>
      </div>

    </div>
  );
}