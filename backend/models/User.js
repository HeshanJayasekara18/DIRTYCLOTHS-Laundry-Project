const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  label: {
    type: String,
    required: true,
    enum: ['home', 'work', 'favorite', 'other']
  },
  address: {
    type: String,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  mobile: {
    type: String,
    default: ''  // Fixed: removed duplicate type declaration
  },
  profileImage: {
    type: String,
    default: null
  },
  addresses: {
    type: [addressSchema],
    default: []
  }
}, {
  timestamps: true
});

// Index for faster email lookups
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);