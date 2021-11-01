const reviewsRouter = require("express").Router();
const { getReviewById } = require("../controllers/reviews-controller.js");

reviewsRouter.route("/:review_id").get(getReviewById);

module.exports = reviewsRouter;
