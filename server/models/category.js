// models/category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // Name of the category
}, {
    timestamps: true // Automatically create createdAt and updatedAt fields
});

const CategoryModel = mongoose.model('Category', categorySchema);

module.exports = CategoryModel;
