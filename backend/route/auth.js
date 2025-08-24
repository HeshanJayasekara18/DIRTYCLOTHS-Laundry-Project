const express = require("express");
const bcrypt = require("bcryptjs"); // use bcryptjs for consistency
const User = require("../models/User");
const router = express.Router();
const {
  getCurrentUser,
  updateUser,
  uploadProfileImage,
  changePassword,
  addAddress,
  deleteAddress,
  setDefaultAddress,
  upload,
  registerUser,
  loginUser,
} = require("../controller/UserController");
const { verifyToken } = require("../middleware/authMiddleware");

// ------------------------ AUTH ROUTES ------------------------

// Registration
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// ------------------------ USER PROFILE ROUTES (Protected) ------------------------
router.get("/user", verifyToken, getCurrentUser); // Get user data
router.put("/user", verifyToken, updateUser); // Update user profile (name, mobile)
router.post("/user/profile-image", verifyToken, upload.single("profileImage"), uploadProfileImage); // Upload profile image
router.put("/change-password", verifyToken, changePassword); // Change password

// ------------------------ USER ADDRESS ROUTES (Protected) ------------------------
router.post("/user/addresses", verifyToken, addAddress); // Add address
router.delete("/user/addresses/:id", verifyToken, deleteAddress); // Delete address
router.put("/user/addresses/:id/default", verifyToken, setDefaultAddress); // Set default address

// ------------------------ DEBUG ROUTE ------------------------
router.get("/debug-user/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    res.json(
      user
        ? {
            email: user.email,
            role: user.role,
            name: user.name,
            addresses: user.addresses || [],
          }
        : { message: "User not found" }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------ CREATE OR UPDATE ADMIN ROUTE ------------------------
router.post("/create-admin", verifyToken, async (req, res) => {
  try {
   
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed to create admin" });
    }

    const { email, password, name, mobile } = req.body;
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Email, name, and password are required" });
    }

    let admin = await User.findOne({ email: email.toLowerCase() });

    if (!admin) {
      // Create new admin
      const hashedPassword = await bcrypt.hash(password, 10);
      admin = new User({
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        role: "admin",
        mobile: mobile || "",
        addresses: [],
      });
      await admin.save();
      return res.json({
        message: "Admin user created successfully",
        admin: { email: admin.email, name: admin.name, role: admin.role },
      });
    }

    // Update existing user to admin and hash password
    admin.password = await bcrypt.hash(password, 10);
    admin.role = "admin";
    if (name) admin.name = name;
    if (mobile) admin.mobile = mobile;
    await admin.save();

    res.json({
      message: "Admin user updated successfully",
      admin: { email: admin.email, name: admin.name, role: admin.role },
    });
  } catch (err) {
    console.error("Create admin error:", err);
    res.status(500).json({ message: "Server error" });
  }
});




module.exports = router;
