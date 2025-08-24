import { UserModel } from "./UserModel";

const UserController = {
  handleRegister: async (email, password, name, mobile, setError, navigate) => {
    try {
      // Clear any previous errors
      setError("");
      
      // Trim values
      const trimmedEmail = email?.trim();
      const trimmedName = name?.trim();
      const trimmedMobile = mobile?.trim();
      
      console.log("Registration attempt with:", { 
        email: trimmedEmail, 
        name: trimmedName, 
        passwordLength: password?.length 
      });
      
      // Validate required fields
      if (!trimmedEmail || !password || !trimmedName) {
        setError("All fields are required");
        return;
      }
      
      // Validate email format
      if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
        setError("Invalid email format");
        return;
      }
      
      // Validate password length
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      
      // Validate name length
      if (trimmedName.length < 2) {
        setError("Name must be at least 2 characters");
        return;
      }
      
      const user = await UserModel.register(trimmedEmail, password, trimmedName, trimmedMobile);
      
      console.log("Registration successful:", user);
      
      // Set session
      UserModel.setSession(user);
      
      // Verify session was set
      const session = UserModel.getSession();
      console.log("Session after registration:", session);
      
      // Navigate based on user role
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/login"); // <-- Always navigate to login for regular users
      }
      
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "Registration failed");
    }
  },

  handleLogin: async (email, password, setError, navigate) => {
    try {
      // Clear any previous errors
      setError("");
      
      const trimmedEmail = email?.trim();
      
      if (!trimmedEmail || !password) {
        setError("Email and password are required");
        return;
      }
      
      console.log("=== LOGIN ATTEMPT IN CONTROLLER ===");
      console.log("Email:", trimmedEmail);
      
      const user = await UserModel.login(trimmedEmail, password);
      
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