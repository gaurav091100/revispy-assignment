const AuthModel = require("../models/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const crypto = require('crypto'); 
require("dotenv").config();


// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    port : process.env.SMPT_PORT,
    service:process.env.SMPT_SERVICE,
    auth: {
        user: process.env.SMPT_MAIL,
        pass: process.env.SMPT_PASSWORD
    }
});

// Function to send OTP email
const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: email,
        subject: 'ECOMMERCE | Email Vertification',
        text: `Your OTP code is: ${otp}`
    };

    await transporter.sendMail(mailOptions);
};

// Function to generate an 8-digit OTP
const generateOtp = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
};

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation 
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Please fill all the details" });
        }

        // Check if user exists
        const existingUser = await AuthModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "User already exists with this email address" });
        }

        // Hash the password asynchronously
        const hashPassword = await bcrypt.hash(password, 10);

        // Generate an OTP
        const otp = generateOtp();

        // Save user data (consider adding a field for OTP and its expiration if needed)
        const newUser = new AuthModel({ name, email, password: hashPassword, otp, isVerified: false });
        await newUser.save();

        // Send OTP email
        await sendOtpEmail(email, otp);

        return res.status(201).json({ message: "Successfully registered. Please check your email for the OTP." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong, an internal error occurred" });
    }
};

// Function to verify OTP
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await AuthModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.otp === otp) {
            user.isVerified = true;
            user.otp = null; // Clear OTP after verification
            await user.save();
            return res.status(200).json({ message: "OTP verified successfully!" });
        } else {
            return res.status(400).json({ error: "Invalid OTP" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong" });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Fill all the details
        if (!email || !password) {
            return res.status(400).json({ error: "Please fill all the details" });
        }

        // Check if user exists
        const existingUser = await AuthModel.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the email is verified
        if (!existingUser.isVerified) {
            return res.status(403).json({ error: "Please verify your email before logging in." });
        }

        // Compare passwords
        const comparePassword = await bcrypt.compare(password, existingUser.password);
        if (!comparePassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET, { expiresIn: '1d' });

        return res.status(200).json({
            message: "Successfully logged in",
            result: { user: { userId: existingUser._id, name: existingUser.name, email: existingUser.email }, token }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong, an internal error occurred" });
    }
}


// const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Fill all the details
//         if (!email || !password) {
//             return res.status(400).json({ error: "Please fill all the details" });
//         }

//         // Check if user exists
//         const existingUser = await AuthModel.findOne({ email });
//         if (!existingUser) {
//             return res.status(404).json({ error: "User not found" });
//         }

//         // Compare passwords
//         const comparePassword = await bcrypt.compare(password, existingUser.password);
//         if (!comparePassword) {
//             return res.status(401).json({ error: "Invalid credentials" });
//         }

//         // Generate a JWT token (consider adjusting the payload as necessary)
//         const token = jwt.sign({ id: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET, { expiresIn: '1d' });

//         return res.status(200).json({
//             message: "Successfully logged in",
//             result: { user:{userId:existingUser._id,name: existingUser.name, email: existingUser.email}, token }
//         });

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ error: "Something went wrong, an internal error occurred" });
//     }
// }

// Get single user data
const getSingleUserData = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Assuming Bearer token
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const userDetails = await AuthModel.findById(userId).select({ password: 0, role: 0 });
        if (!userDetails) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({ message: "Successfully retrieved user profile", userDetails });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}

// Exports
module.exports = { register, login, getSingleUserData,verifyOtp };
