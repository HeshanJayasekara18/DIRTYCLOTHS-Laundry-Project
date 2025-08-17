const mongoose = require('mongoose');
const User = require('../models/User');


async function fixImagePaths() {
  try {
    // Use the correct connection string with mongodb+srv:// prefix
    await mongoose.connect('mongodb+srv://LaundryAdmin:gQFW3MUj9Yi17wRX@laundrycluster.ixcg45u.mongodb.net/LaundryDB?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB Atlas');

    const users = await User.find({ profileImage: /^\/Uploads\// });
    
    for (const user of users) {
      // Remove leading slash to match static serving
      user.profileImage = user.profileImage.substring(1);
      await user.save();
      console.log(`Fixed path for ${user.email}`);
    }
    
    console.log('✅ Image paths fixed successfully');
  } catch (error) {
    console.error('❌ Error fixing image paths:', error);
  } finally {
    await mongoose.disconnect();
    console.log('💾 Disconnected from MongoDB');
  }
}

fixImagePaths();