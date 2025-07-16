const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust path as needed

async function migrateUserRoles() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb+srv://LaundryAdmin:gQFW3MUj9Yi17wRX@laundrycluster.ixcg45u.mongodb.net/?retryWrites=true&w=majority&appName=LaundryCluster', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB Atlas');

    const adminEmail = 'heshan.system@admin.com';
    const adminPassword = '12345678';
    const adminName = 'Admin User';

    // Find the admin user
    const adminUser = await User.findOne({ email: adminEmail });
    
    if (adminUser) {
      console.log('📍 Found admin user:', {
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
        hasPassword: !!adminUser.password
      });
      
      // Update the role to admin if it's not already
      if (adminUser.role !== 'admin') {
        adminUser.role = 'admin';
        await adminUser.save();
        console.log('✅ Updated admin user role to "admin"');
      } else {
        console.log('✅ Admin user already has "admin" role');
      }
      
      // Verify password works
      const passwordTest = await bcrypt.compare(adminPassword, adminUser.password);
      console.log('🔐 Password test result:', passwordTest);
      
      if (!passwordTest) {
        console.log('❌ Password test failed - resetting password');
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        adminUser.password = hashedPassword;
        await adminUser.save();
        console.log('✅ Password reset successfully');
      }
    } else {
      console.log('❌ Admin user not found - creating new admin user');
      
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      const newAdminUser = new User({
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        role: 'admin'
      });

      await newAdminUser.save();
      console.log('✅ Admin user created successfully!');
    }

    // Final verification
    const verifyAdmin = await User.findOne({ email: adminEmail });
    console.log('🔍 Final verification:', {
      email: verifyAdmin.email,
      name: verifyAdmin.name,
      role: verifyAdmin.role,
      hasPassword: !!verifyAdmin.password
    });

    // Test password one more time
    const finalPasswordTest = await bcrypt.compare(adminPassword, verifyAdmin.password);
    console.log('🔐 Final password test:', finalPasswordTest);

    console.log('✅ Admin user setup complete!');
    console.log('Admin credentials:', {
      email: adminEmail,
      password: adminPassword,
      role: 'admin'
    });

  } catch (error) {
    console.error('❌ Error fixing admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('💾 Disconnected from MongoDB');
  }
}


migrateUserRoles();