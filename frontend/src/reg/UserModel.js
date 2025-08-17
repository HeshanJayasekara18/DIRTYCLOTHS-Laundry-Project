import axios from "axios";

const UserModel = {
  register: async (email, password, name) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        email,
        password,
        name
      });
      return response.data;
    } catch (error) {
      console.error("Registration error:", error.response?.data);
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },

  login: async (email, password) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });
      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data);
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