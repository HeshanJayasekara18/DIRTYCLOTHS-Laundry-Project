const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
require('dotenv').config();
const connectDB = require('./db/db');

const seedAdmin = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB:', mongoose.connection.host);
    
    const adminEmail = 'heshan.system@admin.com'.toLowerCase().trim();
    const adminPassword = '12345678';
    
    console.log('=== ADMIN SEED PROCESS ===');
    console.log('Target email:', adminEmail);
    console.log('Target password:', adminPassword);
    
    // First, let's delete any existing admin user to start fresh
    const deleteResult = await User.deleteOne({ email: adminEmail });
    console.log('Deleted existing admin users:', deleteResult.deletedCount);
    
    // Create the admin user with PLAIN PASSWORD (let the model hash it)
    console.log('Creating admin user with plain password...');
    const adminUser = await User.create({
      email: adminEmail,
      password: adminPassword, // Plain password - let the model hash it
      name: 'Admin',
      role: 'admin'
    });
    
    console.log('✅ Admin user created:', {
      id: adminUser._id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role
    });
    
    // Verify the user was saved correctly
    console.log('=== VERIFICATION ===');
    const savedUser = await User.findOne({ email: adminEmail });
    
    if (!savedUser) {
      console.error('❌ Admin user not found after creation');
      process.exit(1);
    }
    
    console.log('Admin user found in database:', {
      id: savedUser._id,
      email: savedUser.email,
      name: savedUser.name,
      role: savedUser.role,
      hasPassword: !!savedUser.password,
      passwordHash: savedUser.password
    });
    
    // Test the saved password
    const finalTest = await bcrypt.compare(adminPassword, savedUser.password);
    console.log('Final password test:', finalTest);
    
    if (finalTest) {
      console.log('✅ SUCCESS: Admin user is correctly configured and ready to use');
      console.log('Login credentials:');
      console.log('Email:', adminEmail);
      console.log('Password:', adminPassword);
    } else {
      console.error('❌ FAILED: Password test failed after saving to database');
      
      // Let's try to understand what's happening
      console.log('=== DEBUGGING INFO ===');
      console.log('Plain password:', adminPassword);
      console.log('Stored hash:', savedUser.password);
      console.log('Hash length:', savedUser.password.length);
      console.log('Hash starts with $2b$:', savedUser.password.startsWith('$2b$'));
      
      // Test creating a hash manually
      const manualHash = await bcrypt.hash(adminPassword, 10);
      const manualTest = await bcrypt.compare(adminPassword, manualHash);
      console.log('Manual hash test:', manualTest);
      console.log('Manual hash:', manualHash);
      
      process.exit(1);
    }
    
    mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Error in seed process:', error);
    process.exit(1);
  }
};

seedAdmin();