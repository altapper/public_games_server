const db = require("../db/connection.js");

exports.addCommentToReview = (review_id, reqBody) => {
  const { username, body } = reqBody;
  if (username === undefined || body === undefined) {
    return Promise.reject({
      status: 400,
      msg: "bad request",
    });
  }
  return db
    .query(
      `INSERT INTO comments (author, body, review_id)
    VALUES ($1, $2, $3) RETURNING *;`,
      [username, body, review_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
