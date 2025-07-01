const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const PackageSchema = new mongoose.Schema({
    packageID: {
        type: String, 
        required: true, 
        unique: true, 
        default: uuidv4
    },
    package_name: {
        type: String, 
        required: true
    },
    package_description: {
        type: String, 
        required: true
    },
    package_time: {
        type: String,  // String to accept values like "24 hours", "2-3 days"
        required: true
    },
    features: {
        type: [String],  // Array of strings to match frontend
        required: true,
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: 'At least one feature is required'
        }
    },
    pricing: {
        below_1: {
            type: Number,
            required: true,
            min: 0
        },
        between_1And10: {
            type: Number,
            required: true,
            min: 0
        },
        above_10: {
            type: Number,
            required: true,
            min: 0
        }
    }
}, {
    timestamps: true
});

// Make sure to use the correct model name
const Package = mongoose.model("Package", PackageSchema);
module.exports = Package;