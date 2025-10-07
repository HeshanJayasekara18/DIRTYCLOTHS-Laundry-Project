// controller/UserController.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const User = require("../models/User");

// ================= MULTER CONFIG =================
const storage = multer.diskStorage({
  destination: "./Uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(), // <-- use memory storage
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
});

// ================= REGISTER =================
const registerUser = async (req, res) => {
  try {
    const { email, password, name, mobile, role, adminSecret } = req.body;

    if (!email || !password || !name || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    if (!/^\+?\d{10,15}$/.test(mobile)) {
      return res.status(400).json({ message: "Invalid mobile number format" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Determine role
    let userRole = "user";
    if (role === "admin") {
      if (adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ message: "Not allowed to create admin" });
      }
      userRole = "admin";
    }

    const user = await User.create({
      email: email.toLowerCase(),
      password, 
      name,
      mobile,
      role: userRole,
      addresses: [],
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      token,
      email: user.email,
      name: user.name,
      role: user.role,
      mobile: user.mobile,
      profileImage: user.profileImage || "",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= LOGIN =================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      email: user.email,
      name: user.name,
      role: user.role,
      mobile: user.mobile,
      profileImage: user.profileImage || "",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET CURRENT USER =================
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= UPDATE USER =================
const updateUser = async (req, res) => {
  try {
    const { name, mobile } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name.trim();
    if (mobile) {
      if (!/^\+?\d{10,15}$/.test(mobile)) {
        return res.status(400).json({ message: "Invalid mobile number format" });
      }
      user.mobile = mobile.trim();
    }

    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= UPLOAD PROFILE IMAGE =================
const uploadProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Save buffer to database
    user.profileImage = req.file.buffer;
    await user.save();

    res.json({ message: "Profile image uploaded successfully" });
  } catch (error) {
    console.error("Profile image upload error:", error);
    res.status(500).json({ message: "Failed to upload profile image" });
  }
};

// ================= CHANGE PASSWORD =================
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new passwords are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ message: "Incorrect current password" });

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= ADD ADDRESS =================
const addAddress = async (req, res) => {
  try {
    const { label, address, lat, lng, isDefault } = req.body;

    if (!label || !["home", "work", "favorite", "other"].includes(label)) {
      return res.status(400).json({ message: "Valid label required (home, work, favorite, other)" });
    }
    if (!address || !address.trim()) {
      return res.status(400).json({ message: "Address is required" });
    }
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    if (isNaN(parsedLat) || parsedLat < -90 || parsedLat > 90) {
      return res.status(400).json({ message: "Latitude must be between -90 and 90" });
    }
    if (isNaN(parsedLng) || parsedLng < -180 || parsedLng > 180) {
      return res.status(400).json({ message: "Longitude must be between -180 and 180" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.addresses) user.addresses = [];

    if (isDefault || user.addresses.length === 0) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    const newAddress = { label, address: address.trim(), lat: parsedLat, lng: parsedLng, isDefault: isDefault || user.addresses.length === 0 };

    user.addresses.push(newAddress);
    await user.save();

    res.json({ message: "Address added successfully", addresses: user.addresses });
  } catch (error) {
    console.error("Add address error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= DELETE ADDRESS =================
const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const deletedAddress = user.addresses.find((addr) => addr._id.toString() === id);
    user.addresses = user.addresses.filter((addr) => addr._id.toString() !== id);

    if (!deletedAddress) return res.status(404).json({ message: "Address not found" });

    if (deletedAddress.isDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    res.json({ message: "Address deleted successfully", addresses: user.addresses });
  } catch (error) {
    console.error("Delete address error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= SET DEFAULT ADDRESS =================
const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.addresses.find((addr) => addr._id.toString() === id);
    if (!address) return res.status(404).json({ message: "Address not found" });

    user.addresses.forEach((addr) => (addr.isDefault = addr._id.toString() === id));
    await user.save();

    res.json({ message: "Default address set successfully", addresses: user.addresses });
  } catch (error) {
    console.error("Set default address error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= EXPORTS =================
module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUser,
  uploadProfileImage,
  changePassword,
  addAddress,
  deleteAddress,
  setDefaultAddress,
  upload,
};
