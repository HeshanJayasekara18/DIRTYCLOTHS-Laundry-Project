const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust path as needed

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb+srv://LaundryAdmin:gQFW3MUj9Yi17wRX@laundrycluster.ixcg45u.mongodb.net/?retryWrites=true&w=majority&appName=LaundryCluster', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB Atlas');

    const adminEmail = 'heshan.system@admin.com';
    const adminPassword = '12345678';
    const adminName = 'Admin User';

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Admin details:', {
        email: existingAdmin.email,
        name: existingAdmin.name,
        role: existingAdmin.role
      });
      
      // Update role if it's not admin
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Updated existing user role to admin');
      }
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      const adminUser = new User({
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        role: 'admin'
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully!');
      console.log('Admin credentials:', {
        email: adminEmail,
        password: adminPassword,
        name: adminName,
        role: 'admin'
      });
    }

    // Verify the admin user
    const verifyAdmin = await User.findOne({ email: adminEmail });
    console.log('✅ Admin user verification:', {
      email: verifyAdmin.email,
      name: verifyAdmin.name,
      role: verifyAdmin.role,
      hasPassword: !!verifyAdmin.password
    });

    // Test password verification
    const passwordTest = await bcrypt.compare(adminPassword, verifyAdmin.password);
    console.log('✅ Password verification test:', passwordTest);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
createAdminUser();