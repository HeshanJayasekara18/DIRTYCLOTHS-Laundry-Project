const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { createTokens, generateToken, generateRefreshToken, setTokenCookie } = require('../utils/auth');
const { sendEmail } = require('../utils/email');

// Helper function to get client IP address
const getIpAddress = (req) => {
  return req.ip || 
         req.headers['x-forwarded-for'] || 
         req.connection.remoteAddress || 
         '';
};

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { email, password, name, mobile } = req.body;
    
    // Input validation
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, name, and password are required',
        code: 'VALIDATION_ERROR'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already in use',
        code: 'EMAIL_EXISTS'
      });
    }

    // Create new user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      name,
      mobile: mobile || '',
      role: 'user'
    });

    // Generate email verification token
    const verificationToken = user.generateVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Send verification email (in production)
    if (process.env.NODE_ENV === 'production') {
      const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
      await sendEmail({
        to: user.email,
        subject: 'Verify Your Email',
        html: `Please click <a href="${verificationUrl}">here</a> to verify your email.`
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = createTokens(user);
    
    // Set refresh token in HTTP-only cookie
    setTokenCookie(res, refreshToken);

    // Return user data and access token
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          isVerified: user.isVerified,
          profileImage: user.profileImage || null
        },
        token: accessToken
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message).join(', ');
      return res.status(400).json({
        success: false,
        message: `Validation error: ${messages}`,
        code: 'VALIDATION_ERROR'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      code: 'SERVER_ERROR'
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ipAddress = getIpAddress(req);

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
        code: 'VALIDATION_ERROR'
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+password +loginAttempts +lockUntil');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Check if account is locked
    if (user.isAccountLocked()) {
      const timeLeft = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
      return res.status(423).json({
        success: false,
        message: `Account locked. Try again in ${timeLeft} minutes.`,
        code: 'ACCOUNT_LOCKED',
        retryAfter: timeLeft * 60
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Increment failed login attempts
      await user.incrementLoginAttempts(ipAddress);
      const attemptsLeft = 5 - (user.loginAttempts + 1);
      
      return res.status(401).json({
        success: false,
        message: `Invalid email or password. ${attemptsLeft > 0 ? attemptsLeft + ' attempts left.' : ''}`,
        code: 'INVALID_CREDENTIALS',
        attemptsLeft: attemptsLeft > 0 ? attemptsLeft : 0
      });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();
    
    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = createTokens(user);
    
    // Set refresh token in HTTP-only cookie
    setTokenCookie(res, refreshToken);

    // Return user data and access token
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          isVerified: user.isVerified,
          profileImage: user.profileImage || null,
          addresses: user.addresses || [],
          mobile: user.mobile || ''
        },
        token: accessToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message).join(', ');
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      email: user.email,
      name: user.name,
      role: user.role,
      mobile: user.mobile,
      profileImage: user.profileImage || '',
      addresses: user.addresses,
    });
  } catch (error) {
    console.error('Get user error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message).join(', ');
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, mobile } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name.trim();
    if (mobile) {
      if (!/^\+?\d{10,15}$/.test(mobile)) {
        return res.status(400).json({ message: 'Invalid mobile number format' });
      }
      user.mobile = mobile.trim();
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      email: user.email,
      name: user.name,
      role: user.role,
      mobile: user.mobile,
      profileImage: user.profileImage || '',
      addresses: user.addresses,
    });
  } catch (error) {
    console.error('Update user error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message).join(', ');
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imagePath = `/Uploads/${req.file.filename}`;
    user.profileImage = imagePath;
    await user.save();

    res.json({
      message: 'Profile image uploaded successfully',
      profileImage: imagePath,
    });
  } catch (error) {
    console.error('Profile image upload error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message).join(', ');
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: 'Failed to upload profile image' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' });
    }

    user.password = newPassword; // Will be hashed by pre-save hook
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message).join(', ');
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const addAddress = async (req, res) => {
  try {
    const { label, address, lat, lng, isDefault } = req.body;

    // Validate input
    if (!label || !['home', 'work', 'favorite', 'other'].includes(label)) {
      return res.status(400).json({ message: 'Valid label is required (home, work, favorite, or other)' });
    }
    if (!address || !address.trim()) {
      return res.status(400).json({ message: 'Address is required' });
    }
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    if (isNaN(parsedLat) || parsedLat < -90 || parsedLat > 90) {
      return res.status(400).json({ message: 'Latitude must be between -90 and 90' });
    }
    if (isNaN(parsedLng) || parsedLng < -180 || parsedLng > 180) {
      return res.status(400).json({ message: 'Longitude must be between -180 and 180' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize addresses array if it doesn't exist
    if (!user.addresses) {
      user.addresses = [];
    }

    // If isDefault is true or this is the first address, set as default
    const shouldSetAsDefault = isDefault || user.addresses.length === 0;
    if (shouldSetAsDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    const newAddress = {
      label,
      address: address.trim(),
      lat: parsedLat,
      lng: parsedLng,
      isDefault: shouldSetAsDefault,
    };

    user.addresses.push(newAddress);
    await user.save();

    res.json({
      message: 'Address added successfully',
      address: newAddress,
      addresses: user.addresses,
    });
  } catch (error) {
    console.error('Add address error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message).join(', ');
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const initialLength = user.addresses.length;
    const deletedAddress = user.addresses.find((addr) => addr._id.toString() === id);
    user.addresses = user.addresses.filter((addr) => addr._id.toString() !== id);

    if (user.addresses.length === initialLength) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // If deleted address was default and there are remaining addresses, set first one as default
    if (deletedAddress && deletedAddress.isDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({
      message: 'Address deleted successfully',
      addresses: user.addresses,
    });
  } catch (error) {
    console.error('Delete address error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message).join(', ');
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const address = user.addresses.find((addr) => addr._id.toString() === id);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    user.addresses.forEach((addr) => {
      addr.isDefault = addr._id.toString() === id;
    });

    await user.save();

    res.json({
      message: 'Default address set successfully',
      addresses: user.addresses,
    });
  } catch (error) {
    console.error('Set default address error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message).join(', ');
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

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
};