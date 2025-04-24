const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'tailor', 'retailer'],
        default: 'user'
    },
    measurements: {
        height: Number,
        chest: Number,
        waist: Number,
        hips: Number,
        shoulder: Number,
        armLength: Number,
        neckSize: Number
    },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String
    },
    phone: String,
    profileImage: String
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);