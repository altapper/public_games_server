const {
  fetchReviewById,
  updateReview,
  fetchAllReviews,
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
  if (!req.body.hasOwnProperty("inc_votes")) {
    console.log("in here!");
    return Promise.reject({
      status: 400,
      msg: "bad request",
    }).catch((err) => {
      next(err);
    });
  }

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
  fetchAllReviews(sort_by, order, category).then((reviews) => {
    res.status(200).send({ reviews });
  });
};
