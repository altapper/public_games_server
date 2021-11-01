const { fetchReviewById } = require("../models/reviews-model.js");

exports.getReviewById = (req, res, next) => {
  const review_id = req.params.review_id;
  fetchReviewById(review_id).then((review) => {
    res.status(200).send({ review });
  });
};
