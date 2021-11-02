const reviewsRouter = require("express").Router();
const {
  getReviewById,
  getUpdatedReview,
  getAllReviews,
} = require("../controllers/reviews-controller.js");

const {
  postCommentToReview,
} = require("../controllers/comments-controller.js");

reviewsRouter.route("/:review_id").get(getReviewById).patch(getUpdatedReview);

reviewsRouter.route("/").get(getAllReviews);

reviewsRouter.route("/:review_id/comments").post(postCommentToReview);

module.exports = reviewsRouter;
