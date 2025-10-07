import axios from "axios";
import { API_BASE_URL } from "../config";

const UserModel = {
  register: async (email, password, name, mobile) => {
    try {
      // Log the data being sent for debugging
      const registrationData = {
        email: email.trim(),
        password,
        name: name.trim(),
        mobile // <-- Add this
      };
      
      console.log("Sending registration data:", registrationData);
      
      // Validate data before sending
      if (!registrationData.email || !registrationData.password || !registrationData.name || !registrationData.mobile) {
        throw new Error("All fields are required");
      }
      
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, registrationData);
      return response.data;
    } catch (error) {
      console.error("Registration error:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Full error:", error);
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },

  login: async (email, password) => {
    try {
      const loginData = {
        email: email.trim(),
        password
      };
      
      console.log("Sending login data:", { email: loginData.email, password: "[HIDDEN]" });
      
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, loginData);
      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data);
      console.error("Error status:", error.response?.status);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  setSession: (user) => {
    localStorage.setItem("token", user.token);
    localStorage.setItem("user", JSON.stringify(user));
  },

  getSession: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return token && user ? { ...JSON.parse(user), token } : null;
  },

  clearSession: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("intendedPath");
  },

  isAuthenticated: () => {
    const session = UserModel.getSession();
    return session !== null;
  },

  isAdmin: () => {
    const session = UserModel.getSession();
    return session?.role === "admin";
  }
};

export { UserModel };