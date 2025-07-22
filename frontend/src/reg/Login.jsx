import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserController } from "./UserController";
import laundryImg from "../images/laundry-illustration.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is already logged in
  useEffect(() => {
    if (UserController.isAuthenticated()) {
      const user = UserController.getCurrentUser();
      console.log("User already authenticated:", user);
      
      if (user.role === "admin") {
        console.log("Redirecting authenticated admin to /admin");
        navigate("/admin", { replace: true });
      } else {
        console.log("Redirecting authenticated user to /");
        navigate("/home", { replace: true });
      }
    }
  }, [navigate]);

  // Store intended path if user was redirected here
  useEffect(() => {
    if (location.state?.from) {
      sessionStorage.setItem('intendedPath', location.state.from.pathname);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("=== LOGIN FORM SUBMISSION ===");
    console.log("Email:", email);
    console.log("Password length:", password.length);

    try {
      await UserController.handleLogin(email, password, setError, navigate);
    } catch (error) {
      console.error("Login submission error:", error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-32 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl flex w-full max-w-4xl overflow-hidden">
        {/* Left panel with glassmorphism effect */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm p-12 w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-600/10"></div>
          <div className="relative z-10 text-center">
            <div className="mb-8 relative">
              <div className="w-56 h-56 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-xl">
                <img
                  src={laundryImg}
                  alt="Laundry illustration"
                  className="w-40 h-40 object-contain filter drop-shadow-lg"
                />
              </div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full animate-ping"></div>
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full animate-pulse"></div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent mb-4">
              Welcome Back!
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Login to manage your laundry orders and enjoy our premium service experience.
            </p>
            <div className="mt-6 flex justify-center space-x-2">
              <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce animation-delay-200"></div>
              <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce animation-delay-400"></div>
            </div>
          </div>
        </div>

        {/* Right panel - Login form */}
        <div className="flex-1 p-12 flex flex-col justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-2">
                Sign In
              </h2>
              <div className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                DIRTYCLOTHS
              </div>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-3 rounded-full"></div>
            </div>
            
            {error && (
              <div className="bg-red-500/10 backdrop-blur-sm border border-red-400/30 text-red-200 px-6 py-4 rounded-2xl mb-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5"></div>
                <div className="relative z-10 flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 outline-none transition-all duration-300 group-hover:border-white/30"
                  autoFocus
                  required
                  disabled={loading}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 outline-none transition-all duration-300 group-hover:border-white/30 pr-12"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white p-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center justify-center space-x-2">
                  {loading && (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  <span>{loading ? "Signing in..." : "Sign In"}</span>
                </div>
              </button>
            </form>
            
            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link 
                to="/home"
                className="flex-1 relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 text-white p-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] group text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Back to Home</span>
                </div>
              </Link>
              
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 text-white p-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Cancel</span>
                </div>
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-white/70 text-lg">
                Don't have an account?{" "}
                <Link 
                  to="/register" 
                  className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-semibold hover:from-blue-300 hover:to-purple-300 transition-all duration-300 relative group"
                >
                  Create Account
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;