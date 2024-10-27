const mongoose = require("mongoose");
require("dotenv").config();


// database connection-
const dbConnection = mongoose.connect(`${process.env.MONGO_URL}`)


// exports-
module.exports = dbConnection;