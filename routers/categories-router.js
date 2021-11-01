const categoriesRouter = require("express").Router();
const { getAllCategories } = require("../controllers/categories-controller.js");

categoriesRouter.route("/").get(getAllCategories);

module.exports = categoriesRouter;
