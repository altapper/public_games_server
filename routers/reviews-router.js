const reviewsRouter = require("express").Router();
const {
  getReviewById,
  getUpdatedReview,
  getAllReviews,
} = require("../controllers/reviews-controller.js");

reviewsRouter.route("/:review_id").get(getReviewById).patch(getUpdatedReview);

reviewsRouter.route("/").get(getAllReviews);

module.exports = reviewsRouter;
