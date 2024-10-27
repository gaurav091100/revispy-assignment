const express = require("express");
const {register, login, getSingleUserData, verifyOtp} = require("../controllers/auth");
const requireLogin = require("../middlewares/requireLogIn");
const authRouter = express.Router();


// routes-
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post('/verify-otp', verifyOtp);
authRouter.get("/single-user-detail", requireLogin, getSingleUserData);


// exports-
module.exports = authRouter;