import { UserModel } from "./UserModel";

const UserController = {
  handleRegister: async (email, password, name, setError, navigate) => {
    try {
      if (!email || !password || !name) {
        setError("All fields are required");
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        setError("Invalid email format");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      
      const user = await UserModel.register(email.trim(), password, name);
      UserModel.setSession(user);
      console.log("Registered user:", user, "Session:", UserModel.getSession());
      
      // Check if registered user is admin and redirect accordingly
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message);
    }
  },

  handleLogin: async (email, password, setError, navigate) => {
    try {
      if (!email || !password) {
        setError("Email and password are required");
        return;
      }
      
      console.log("=== LOGIN ATTEMPT IN CONTROLLER ===");
      console.log("Email:", email.trim());
      
      const user = await UserModel.login(email.trim(), password);
      
      console.log("=== LOGIN RESPONSE ===");
      console.log("User received:", user);
      console.log("User role:", user.role);
      
      UserModel.setSession(user);
      
      // Verify session was set correctly
      const session = UserModel.getSession();
      console.log("Session after setting:", session);
      
      // Clear any intended path for admin users
      if (user.role === "admin") {
        sessionStorage.removeItem('intendedPath');
        console.log("🔑 Admin user detected, navigating to /admin");
        navigate("/admin");
        return; // Early return to avoid any other navigation logic
      }
      
      // For regular users, check if there's an intended destination
      const intendedPath = sessionStorage.getItem('intendedPath') || "/";
      console.log("👤 Regular user detected, navigating to:", intendedPath);
      
      // Clear the intended path after use
      sessionStorage.removeItem('intendedPath');
      navigate(intendedPath);
      
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Invalid credentials");
    }
  },

  handleLogout: (navigate) => {
    UserModel.clearSession();
    navigate("/login");
  },

  // Helper function to check if current user is admin
  isAdmin: () => {
    const session = UserModel.getSession();
    console.log("Checking admin status:", session?.role);
    return session?.role === "admin";
  },

  // Helper function to get current user
  getCurrentUser: () => {
    return UserModel.getSession();
  },

  // Helper function to check if user is authenticated
  isAuthenticated: () => {
    return UserModel.isAuthenticated();
  },

  // Helper function to require admin access
  requireAdmin: (navigate) => {
    if (!UserController.isAdmin()) {
      console.log("Access denied: Admin privileges required");
      navigate("/login");
      return false;
    }
    return true;
  }
};

export { UserController };