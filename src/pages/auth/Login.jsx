import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const [dataForm, setDataForm] = useState({
    email: "emilys",
    password: "emilyspass",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm({
      ...dataForm,
      [name]: value,
    });
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
          headers: {
            "Content-Type": "application/json",
          },
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
    <div className="w-full space-y-8 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header Form */}
      <div className="text-center">
        <h2 
          className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2B2420]"
          style={{ fontFamily: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif" }}
        >
          Welcome Back 👋
        </h2>
        <p className="mt-2 text-sm text-[#8A817A] font-medium">
          Please enter your details to access the dashboard.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-[#F2E6E6] border border-[#E8D1D1] text-[#B85C5C] px-4 py-3 rounded-xl text-sm shadow-sm flex items-center animate-in slide-in-from-top-2 duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Username Input */}
        <div>
          <label className="block text-sm font-semibold text-[#2B2420] mb-1.5">
            Username
          </label>
          <input
            type="text"
            name="email"
            value={dataForm.email}
            onChange={handleChange}
            required
            className="appearance-none block w-full px-4 py-3 border border-[#E8E2DD] rounded-xl shadow-sm text-[#2B2420] placeholder-[#8A817A] focus:outline-none focus:ring-2 focus:ring-[#79553D]/30 focus:border-[#79553D] transition-all duration-200 bg-[#FAFAFA] focus:bg-white sm:text-sm"
            placeholder="Enter username"
          />
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-sm font-semibold text-[#2B2420] mb-1.5">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={dataForm.password}
            onChange={handleChange}
            required
            className="appearance-none block w-full px-4 py-3 border border-[#E8E2DD] rounded-xl shadow-sm text-[#2B2420] placeholder-[#8A817A] focus:outline-none focus:ring-2 focus:ring-[#79553D]/30 focus:border-[#79553D] transition-all duration-200 bg-[#FAFAFA] focus:bg-white sm:text-sm"
            placeholder="••••••••"
          />
        </div>

        {/* Forgot Password Link */}
        <div className="flex items-center justify-end">
          <Link to="/forgot" className="text-sm font-bold text-[#A67C52] hover:text-[#79553D] transition-colors">
            Forgot your password?
          </Link>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            disabled={loading}
            type="submit"
            className={`w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white transition-all duration-200 
              ${loading 
                ? "bg-[#A67C52] cursor-not-allowed shadow-none" 
                : "bg-[#79553D] hover:bg-[#614330] shadow-[#79553D]/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#79553D] active:scale-[0.98]"
              }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </div>
      </form>

      {/* Footer Text */}
      <div className="text-center text-sm text-[#8A817A] font-medium mt-8">
        Don't have an account?{" "}
        <Link 
          to="/register" 
          className="font-bold text-[#A67C52] hover:text-[#79553D] transition-colors"
        >
          Sign up here
        </Link>
      </div>

    </div>
  );
}