const express = require("express");
const {getCategories, saveUserSelections,getUserSelections} = require("../controllers/category");
const requireLogin = require("../middlewares/requireLogIn");
const categoryRouter = express.Router();


// routes-
categoryRouter.get("/categories", requireLogin, getCategories);
categoryRouter.get("/selections", requireLogin, getUserSelections);
categoryRouter.post("/selections", requireLogin, saveUserSelections);


// exports-
module.exports = categoryRouter;