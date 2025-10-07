// hash-admin.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

mongoose.connect("mongodb+srv://LaundryAdmin:gQFW3MUj9Yi17wRX@laundrycluster.ixcg45u.mongodb.net/?retryWrites=true&w=majority&appName=LaundryCluster", { useNewUrlParser: true, useUnifiedTopology: true });

async function hashAdminPassword() {
  try {
    const admin = await User.findOne({ email: "heshan@admin.com" });
    if (!admin) return console.log("Admin not found");

    // Hash the password
    admin.password = await bcrypt.hash(admin.password, 10);
    await admin.save();
    console.log("Admin password hashed successfully");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

hashAdminPassword();
