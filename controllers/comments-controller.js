const { addCommentToReview } = require("../models/comments-model.js");

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
