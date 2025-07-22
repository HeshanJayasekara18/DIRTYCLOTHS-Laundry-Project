const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust path as needed

async function cleanInvalidAddress() {
  try {
    await mongoose.connect('mongodb+srv://LaundryAdmin:gQFW3MUj9Yi17wRX@laundrycluster.ixcg45u.mongodb.net/?retryWrites=true&w=majority&appName=LaundryCluster');
    console.log('✅ Connected to MongoDB Atlas');

    const users = await User.find({});
    let cleanedCount = 0;

    for (const user of users) {
      if (user.addresses && user.addresses.length > 0) {
        const originalLength = user.addresses.length;
        
        // Filter out invalid addresses
        user.addresses = user.addresses.filter(addr => 
          addr.label && 
          ['home', 'work', 'favorite', 'other'].includes(addr.label) &&
          addr.address && 
          typeof addr.lat === 'number' && 
          typeof addr.lng === 'number'
        );

        if (originalLength !== user.addresses.length) {
          await user.save();
          cleanedCount++;
          console.log(`🧹 Cleaned ${originalLength - user.addresses.length} invalid addresses from user ${user.email}`);
        }
      }
    }

    console.log(`✅ Cleaned ${cleanedCount} users with invalid addresses`);
  } catch (error) {
    console.error('❌ Error cleaning addresses:', error);
  } finally {
    await mongoose.disconnect();
    console.log('💾 Disconnected from MongoDB');
  }
}

cleanInvalidAddress();