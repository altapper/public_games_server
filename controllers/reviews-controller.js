const {
  fetchReviewById,
  updateReview,
  fetchAllReviews,
  addCommentToReview,
} = require("../models/reviews-model.js");

exports.getReviewById = (req, res, next) => {
  const review_id = req.params.review_id;
  fetchReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUpdatedReview = (req, res, next) => {
  const inc_votes = req.body.inc_votes;
  const review_id = req.params.review_id;
  updateReview(inc_votes, review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllReviews = (req, res, next) => {
  const sort_by = req.query.sort_by;
  const order = req.query.order;
  const category = req.query.category;
  fetchAllReviews(sort_by, order, category)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentToReview = (req, res, next) => {
  const review_id = req.params.review_id;
  const reqBody = req.body;
  addCommentToReview(review_id, reqBody)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
