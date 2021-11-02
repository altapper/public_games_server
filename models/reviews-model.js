const db = require("../db/connection.js");

exports.fetchReviewById = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "review not found",
        });
      }
      return rows[0];
    });
};

exports.updateReview = (inc_votes, review_id) => {
  if (inc_votes === undefined) {
    return Promise.reject({
      status: 400,
      msg: "bad request",
    });
  }
  return db
    .query(
      `UPDATE reviews SET votes = votes + $1
        WHERE review_id = $2
        RETURNING *;`,
      [inc_votes, review_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "review not found",
        });
      }
      return rows[0];
    });
};

exports.fetchAllReviews = (
  sort_by = "created_at",
  order = "desc",
  category = undefined
) => {
  if (
    ![
      "created_at",
      "designer",
      "review_id",
      "title",
      "review_body",
      "review_img_url",
      "votes",
      "category",
      "owner",
      "comment_count",
    ].includes(sort_by)
  ) {
    return Promise.reject({ status: 400, msg: "invalid sort query" });
  }

  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "invalid sort query" });
  }

  const queryVals = [];

  let queryStr = `SELECT reviews.*, COUNT(comment_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id `;

  if (category) {
    queryStr += `WHERE category = $1 `;
    queryVals.push(category);
  }

  queryStr += `GROUP BY reviews.review_id ORDER BY ${sort_by} ${order};`;

  return Promise.all([
    db.query(queryStr, queryVals),
    db.query(`SELECT * FROM categories;`),
  ]).then(([{ rows }, categoryTable]) => {
    const categories = categoryTable.rows;
    const categorySlugs = categories.map((category) => category.slug);
    if (category) {
      if (!categorySlugs.includes(category)) {
        return Promise.reject({
          status: 404,
          msg: "category not found",
        });
      }
    }
    return rows;
  });

  // return db.query(queryStr, queryVals).then(({ rows }) => {
  //   if (rows.length === 0) {
  //     return Promise.reject({
  //       status: 404,
  //       msg: "no reviews found with that category",
  //     });
  //   }
  //   return rows;
  // });
};
