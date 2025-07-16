const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderID: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  postalCode: {
    type: String
  },
  location: {
    type: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    required: true
  },
  selectedService: {
    type: String,
    required: true
  },
  serviceDetails: {
    type: Object
  },
  preferredDate: {
    type: String,
    required: true
  },
  preferredTime: {
    type: String
  },
  weight: {
    type: Number,
    required: true
  },
  specialInstructions: {
    type: String
  },
  addOns: [{
    type: String
  }],
  addOnDetails: [{
    type: Object
  }],
  paymentMethod: {
    type: String,
    default: 'cash'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  userEmail: {
    type: String,
    required: true // Add field to store logged-in user's email
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);