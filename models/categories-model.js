const db = require("../db/connection.js");

exports.fetchAllCategories = () => {
  return db.query(`SELECT * FROM categories;`).then(({ rows }) => {
    return rows;
  });
};
