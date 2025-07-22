const multer = require("multer");
const path = require("path");
const User = require("../models/User");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
});

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      email,
      password: hashedPassword,
      name,
      role: "user",
      addresses: [] // Initialize addresses array
    });
    await user.save();

    const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
    res.status(201).json({ 
      token, 
      email: user.email, 
      name: user.name, 
      role: user.role,
      mobile: user.mobile || "",
      profileImage: user.profileImage || null,
      addresses: user.addresses || []
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
    res.json({ 
      token, 
      email: user.email, 
      name: user.name, 
      role: user.role, 
      mobile: user.mobile || "", 
      profileImage: user.profileImage || null, 
      addresses: user.addresses || [] 
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      email: user.email,
      name: user.name,
      role: user.role,
      mobile: user.mobile || "",
      profileImage: user.profileImage || null,
      addresses: user.addresses || []
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, mobile } = req.body;
    const session = req.user;
    
    const update = {};
    if (name) update.name = name;
    if (mobile) {
      const phoneRegex = /^(?:\+94\d{9}|07\d{8})$/;
      if (!phoneRegex.test(mobile)) {
        return res.status(400).json({ message: "Invalid mobile number format" });
      }
      update.mobile = mobile;
    }

    const user = await User.findOneAndUpdate(
      { email: session.email },
      update,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      name: user.name,
      email: user.email,
      mobile: user.mobile || "",
      profileImage: user.profileImage || null,
      addresses: user.addresses || [],
    });
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message).join(', ');
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: "Failed to update profile" });
  }
};
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const imagePath = `/Uploads/${req.file.filename}`;
    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      { profileImage: imagePath },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ 
      message: "Profile image uploaded successfully",
      profileImage: imagePath 
    });
  } catch (error) {
    console.error("Profile image upload error:", error);
    res.status(500).json({ message: "Failed to upload profile image" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const session = req.user;
    const user = await User.findOne({ email: session.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findOneAndUpdate(
      { email: session.email },
      { password: hashedPassword }
    );

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Failed to update password" });
  }
};

const addAddress = async (req, res) => {
  try {
    const { label, address, lat, lng, isDefault } = req.body;
    if (!label || !address || lat === undefined || lng === undefined) {
      return res.status(400).json({ message: "All address fields are required" });
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize addresses array if it doesn't exist
    if (!user.addresses) {
      user.addresses = [];
    }

    // If this is the first address or isDefault is true, set as default
    const shouldSetAsDefault = isDefault || user.addresses.length === 0;

    if (shouldSetAsDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    const newAddress = {
      _id: new mongoose.Types.ObjectId().toString(),
      label,
      address,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      isDefault: shouldSetAsDefault,
    };

    user.addresses.push(newAddress);
    await user.save();

    res.json({
      message: "Address added successfully",
      address: newAddress,
      addresses: user.addresses
    });
  } catch (error) {
    console.error("Add address error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const session = req.user;
    const user = await User.findOne({ email: session.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const initialLength = user.addresses.length;
    const deletedAddress = user.addresses.find(addr => addr._id === id);
    user.addresses = user.addresses.filter((addr) => addr._id !== id);

    if (user.addresses.length === initialLength) {
      return res.status(404).json({ message: "Address not found" });
    }

    // If deleted address was default and there are remaining addresses, set first one as default
    if (deletedAddress && deletedAddress.isDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({
      message: "Address deleted successfully",
      addresses: user.addresses
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: "Failed to delete address" });
  }
};

const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const session = req.user;
    const user = await User.findOne({ email: session.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const addressExists = user.addresses.some((addr) => addr._id === id);
    if (!addressExists) {
      return res.status(404).json({ message: "Address not found" });
    }

    user.addresses = user.addresses.map((addr) => ({
      ...addr,
      isDefault: addr._id === id
    }));

    await user.save();

    res.json({
      message: "Default address set successfully",
      addresses: user.addresses
    });
  } catch (error) {
    console.error("Error setting default address:", error);
    res.status(500).json({ message: "Failed to set default address" });
  }
};

module.exports = {
  getUserProfile,
  updateUser,
  uploadProfileImage,
  changePassword,
  addAddress,
  deleteAddress,
  setDefaultAddress,
  upload,
  register,
  login,
};