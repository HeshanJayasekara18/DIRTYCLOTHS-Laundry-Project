const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      email: email.toLowerCase(), 
      password: hashedPassword, 
      name, 
      role: 'user' 
    });
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(201).json({ 
      token, 
      email: user.email, 
      name: user.name, 
      role: user.role  // Make sure role is included
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Raw input - email:', email);
    console.log('Raw input - password length:', password?.length);
    
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const normalizedEmail = email.toLowerCase().trim();
    console.log('Normalized email:', normalizedEmail);
    
    const user = await User.findOne({ email: normalizedEmail });
    console.log('Database query result:', !!user);
    
    if (!user) {
      console.log('❌ User not found for email:', normalizedEmail);
      return res.status(401).json({ message: 'User not found' });
    }
    
    console.log('✅ User found in database:', {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      hasPassword: !!user.password,
      passwordLength: user.password?.length
    });
    
    console.log('About to compare passwords...');
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('bcrypt.compare result:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Password mismatch');
      return res.status(401).json({ message: 'Incorrect password' });
    }
    
    console.log('✅ Password match successful');
    
    // IMPORTANT: Make sure to include the role in the JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    console.log('✅ JWT token generated successfully');
    
    // CRITICAL FIX: Make sure to return the role in the response
    const responseData = {
      token, 
      email: user.email, 
      name: user.name, 
      role: user.role || 'user'  // Fallback to 'user' if role is undefined
    };
    
    console.log('Sending response:', responseData);
    
    res.json(responseData);
    
  } catch (error) {
    console.error('❌ Login error:', error);
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
      role: user.role || 'user'  // Ensure role is always returned
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Test route for admin user
const testAdminUser = async (req, res) => {
  try {
    const adminEmail = 'heshan.system@admin.com';
    const adminPassword = '12345678';
    
    console.log('=== TESTING ADMIN USER ===');
    
    const user = await User.findOne({ email: adminEmail });
    console.log('Admin user found:', !!user);
    
    if (user) {
      console.log('User details:', {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        hasPassword: !!user.password
      });
      
      const isMatch = await bcrypt.compare(adminPassword, user.password);
      console.log('Password test result:', isMatch);
      
      if (isMatch) {
        console.log('✅ Admin login should work');
        res.json({ 
          status: 'success', 
          message: 'Admin user is correctly configured',
          userEmail: user.email,
          userRole: user.role
        });
      } else {
        console.log('❌ Password test failed');
        res.json({ 
          status: 'error', 
          message: 'Password test failed',
          userEmail: user.email
        });
      }
    } else {
      console.log('❌ Admin user not found');
      res.json({ 
        status: 'error', 
        message: 'Admin user not found' 
      });
    }
    
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerUser, loginUser, getCurrentUser, testAdminUser };