const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: String, // You can adjust the type or length as needed
        default: '' // Default to an empty string
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('user', UserSchema);
