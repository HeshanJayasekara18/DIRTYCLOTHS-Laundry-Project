const express = require("express");
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();
const {
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
} = require("../controller/UserController");
const { verifyToken } = require("../middleware/authMiddleware");

// Registration route
router.post("/register", register);

// Login route
router.post("/login", login);

// Protected user profile routes
router.get("/user", verifyToken, getUserProfile); // Get user data
router.put("/user", verifyToken, updateUser); // Update user profile (name, mobile)
router.post("/user/profile-image", verifyToken, upload.single("profileImage"), uploadProfileImage); // Upload profile image
router.put("/change-password", verifyToken, changePassword); // Change password
router.post("/user/addresses", verifyToken, addAddress); // Add address
router.delete("/user/addresses/:id", verifyToken, deleteAddress); // Delete address
router.put("/user/addresses/:id/default", verifyToken, setDefaultAddress); // Set default address

// Debug route - Add to your auth routes for debugging
router.get('/debug-user/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    res.json(user ? {
      email: user.email,
      role: user.role,
      name: user.name,
      addresses: user.addresses || []
    } : { message: 'User not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to create admin user - REMOVE IN PRODUCTION
router.post('/create-admin', async (req, res) => {
  try {
    const adminEmail = 'heshan.system@admin.com';
    const adminPassword = '12345678';
    const adminName = 'Admin User';

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      // Update role if it's not admin
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        return res.json({
          message: 'Updated existing user role to admin',
          admin: {
            email: existingAdmin.email,
            name: existingAdmin.name,
            role: existingAdmin.role
          }
        });
      }
      
      return res.json({
        message: 'Admin user already exists',
        admin: {
          email: existingAdmin.email,
          name: existingAdmin.name,
          role: existingAdmin.role
        }
      });
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const adminUser = new User({
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: 'admin',
      addresses: []
    });

    await adminUser.save();
    
    res.json({
      message: 'Admin user created successfully!',
      admin: {
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role
      }
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;