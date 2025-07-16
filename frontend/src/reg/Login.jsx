import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserController } from "./UserController";
import laundryImg from "../images/laundry-illustration.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-xl flex w-full max-w-3xl overflow-hidden">
        <div className="hidden md:flex flex-col justify-center items-center bg-blue-100 p-8 w-1/2">
          <img
            src={laundryImg}
            alt="Laundry illustration"
            className="w-48 h-48 object-contain mb-4"
          />
          <h2 className="text-2xl font-bold text-blue-700 mb-2">Welcome Back!</h2>
          <p className="text-blue-600 text-center">
            Login to manage your laundry orders and enjoy premium service.
          </p>
        </div>
        <div className="flex-1 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
            Login to DIRTYCLOTHS
          </h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              autoFocus
              required
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white p-3 rounded-lg font-semibold transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          
          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Register
            </Link>
          </p>
          
          {/* Debug info - remove in production */}
          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>Admin credentials: heshan.system@admin.com / 12345678</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;