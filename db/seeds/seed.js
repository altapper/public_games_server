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
        title VARCHAR(100),
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
    .then(() => {
      const queryStr = format(
        `INSERT INTO users (username, avatar_url, name)
        VALUES 
        %L
        RETURNING *;`,
        userData.map((user) => [user.username, user.avatar_url, user.name])
      );
      return db.query(queryStr);
    })
    .then(() => {
      const queryStr = format(
        `INSERT INTO reviews (title, review_body, designer, review_img_url, votes, category, created_at, owner)
        VALUES 
        %L
        RETURNING *;`,
        reviewData.map((review) => [
          review.title,
          review.review_body,
          review.designer,
          review.review_img_url,
          review.votes,
          review.category,
          review.created_at,
          review.owner,
        ])
      );
      return db.query(queryStr);
    })
    .then(() => {
      const queryStr = format(
        `INSERT INTO comments (author, review_id, votes, created_at, body)
        VALUES 
        %L
        RETURNING *;`,
        commentData.map((comment) => [
          comment.author,
          comment.review_id,
          comment.votes,
          comment.created_at,
          comment.body,
        ])
      );
      return db.query(queryStr);
    })
    .then(({ rows }) => {
      console.log(rows);
    });

  // 2. insert data
};

module.exports = seed;
