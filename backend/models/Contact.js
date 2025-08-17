const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    contactID: {
    type: String,
    default: () => 'contact_${Date.now()}',
    unique: true
  },
    email: {
        type: String,
        required: true,
       
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    service: {
        type: String,
        required: true
    },
    message: {  
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Contact', contactSchema);