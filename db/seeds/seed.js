const db = require("../connection.js"); ///check this
const format = require("pg-format");
// reference object stuff?

const seed = (data) => {
  const { categoryData, commentData, reviewData, userData } = data;
  // 0. delete tables if exist
  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS reviews;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS categories`);
    }) // 1. create tables
    .then(() => {
      return db.query(`CREATE TABLE categories (
        slug VARCHAR(40) NOT NULL UNIQUE,
        description TEXT
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE users (
        username VARCHAR(40) NOT NULL UNIQUE,
        avatar_url TEXT,
        name VARCHAR(40)
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE reviews (
        review_id SERIAL PRIMARY KEY,
        title VARCHAR(40),
        review_body TEXT,
        designer VARCHAR(40),
        review_img_url TEXT DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
        votes INT DEFAULT 0,
        category VARCHAR(40) REFERENCES categories(slug),
        owner VARCHAR(40) REFERENCES users(username),
        created_at DATE DEFAULT CURRENT_TIMESTAMP
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        author VARCHAR(40) REFERENCES users(username),
        review_id INT REFERENCES reviews(review_id),
        votes INT DEFAULT 0,
        created_at DATE DEFAULT CURRENT_TIMESTAMP,
        body TEXT
      );`);
    })
    .then(() => {
      const queryStr = format(
        `INSERT INTO categories (slug, description)
        VALUES 
        %L
        RETURNING *;`,
        categoryData.map((category) => [category.slug, category.description])
      );
      return db.query(queryStr);
    })
    .then(({ rows }) => {
      console.log(rows);
    });

  // 2. insert data
};

module.exports = seed;
