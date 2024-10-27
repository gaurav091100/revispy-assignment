const express = require("express");
const authRouter = require("./routes/auth");
const categoryRouter = require("./routes/category");
const app = express();
const cors = require("cors");
require("dotenv").config();


// middleware-
app.use(express.json());
app.use(cors());


// routes-
app.use("/api/v1", authRouter)
app.use("/api/v1", categoryRouter)


// exports-
module.exports = app;