const reviewsRouter = require("express").Router();
const {
  getReviewById,
  getUpdatedReview,
} = require("../controllers/reviews-controller.js");

reviewsRouter.route("/:review_id").get(getReviewById).patch(getUpdatedReview);

module.exports = reviewsRouter;
