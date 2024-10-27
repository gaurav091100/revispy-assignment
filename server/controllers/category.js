const AuthModel = require("../models/auth");
const CategoryModel = require("../models/category");
const jwt = require("jsonwebtoken");
require("dotenv").config();



// Get categories
const getCategories = async (req, res) => {
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

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6; // Default to 6 categories per page
        const skip = (page - 1) * limit;

        // Assuming you have a CategoryModel for categories
        const categories = await CategoryModel.find().skip(skip).limit(limit);
        const totalCategories = await CategoryModel.countDocuments();

        return res.status(200).json({
            message: "Categories retrieved successfully",
            categories,
            totalCategories,
            currentPage: page,
            totalPages: Math.ceil(totalCategories / limit)
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

// save user selections
// const saveUserSelections = async (req, res) => {
//     try {
//         const token = req.headers.authorization?.split(' ')[1]; // Assuming Bearer token
//         if (!token) {
//             return res.status(401).json({ error: "No token provided" });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const userId = decoded.id;

//         const userDetails = await AuthModel.findById(userId).select({ password: 0, role: 0 });
//         if (!userDetails) {
//             return res.status(404).json({ error: "User not found" });
//         }

//         const { selectedCategories } = req.body; // Expecting an array of category IDs
//         if (!Array.isArray(selectedCategories)) {
//             return res.status(400).json({ error: "Invalid selection format" });
//         }

//         // Update user's selected categories (assuming you have a field for this)
//         userDetails.selectedCategories = selectedCategories; // Adjust according to your schema
//         await userDetails.save();

//         return res.status(200).json({ message: "User selections saved successfully", userDetails });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ error: "Something went wrong" });
//     }
// };


// Save user selections
const saveUserSelections = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const { selectedCategories } = req.body; 
        if (!Array.isArray(selectedCategories)) {
            return res.status(400).json({ error: "Invalid selection format" });
        }

        // Find user and save selections
        const userDetails = await AuthModel.findById(userId);
        if (!userDetails) {
            return res.status(404).json({ error: "User not found" });
        }

        userDetails.selectedCategories = selectedCategories;
        await userDetails.save();

        return res.status(200).json({ message: "User selections saved successfully", userDetails });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

// Fetch user selections
const getUserSelections = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const userDetails = await AuthModel.findById(userId).select('selectedCategories');
        if (!userDetails) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({ selectedCategories: userDetails.selectedCategories });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Something went wrong" });
    }
};




// Exports
module.exports = { getCategories,saveUserSelections,getUserSelections  };
