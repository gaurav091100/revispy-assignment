// seed.js
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const CategoryModel = require('./models/category'); // Adjust path as necessary
require('dotenv').config();

const seedCategories = async (numCategories) => {
    const categories = new Set();

    while (categories.size < numCategories) {
        const name = faker.commerce.department();
        categories.add(name);
    }

    const categoryArray = Array.from(categories).map(name => ({ name }));

    console.log(`Generated ${categoryArray.length} unique categories. Starting insertion...`);

    try {
        // Clear existing categories (uncomment if you want to clear)
        await CategoryModel.deleteMany({}); // Clear existing categories

        // Insert each category, handling duplicates
        for (const category of categoryArray) {
            try {
                await CategoryModel.create(category);
            } catch (insertError) {
                if (insertError.code === 11000) {
                    console.warn(`Duplicate category name: ${category.name}. Skipping...`);
                } else {
                    throw insertError; // rethrow if it's another error
                }
            }
        }

        console.log(`${categoryArray.length} unique categories seeded successfully!`);
    } catch (err) {
        console.error("Error during seeding:", err);
    }
};

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        await seedCategories(20); // Adjust the number of categories as needed
    })
    .catch(err => {
        console.error("Error connecting to MongoDB:", err);
    })
    .finally(() => {
        mongoose.disconnect();
    });
