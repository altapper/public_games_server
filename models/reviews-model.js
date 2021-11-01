const db = require("../db/connection.js");

exports.fetchReviewById = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = ${review_id};`)
    .then(({ rows }) => {
      return rows[0];
    });
};
