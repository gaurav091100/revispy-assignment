const mongoose = require("mongoose");

// schema-
const authSchema = mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },  // For email verification
    otp: { type: String }, // For storing OTP, if necessary
    selectedCategories: { type: [String], default: [] }, 
});

// model-
const AuthModel = mongoose.model("user", authSchema); 

// exports-
module.exports = AuthModel;
