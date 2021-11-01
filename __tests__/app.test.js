const request = require("supertest");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET api/categories", () => {
  describe("happy path", () => {
    it("Status 200, returns an object with an array of categories under the 'category' key", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          const categories = body.categories;
          expect(categories.length).toBe(4);
          categories.forEach((category) => {
            expect(category).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
  });
  describe("error handling", () => {
    it("Status 404, path not found when putting in an invalid endpoint", () => {
      return request(app)
        .get("/apiwooo")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("path not found");
        });
    });
  });
});

describe("GET api/reviews/:review_id", () => {
  describe("happy path", () => {
    it("Status 200, returns the corresponding review object", () => {
      return request(app)
        .get("/api/reviews/2")
        .expect(200)
        .then(({ body }) => {
          const review = body.review;
          expect(review).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              title: expect.any(String),
              review_body: expect.any(String),
              designer: expect.any(String),
              review_img_url: expect.any(String),
              votes: expect.any(Number),
              category: expect.any(String),
              owner: expect.any(String),
            })
          );
        });
    });
  });
  describe("error handling", () => {
    it("Status 404, review not found if a review_id is a number but does not exist", () => {
      return request(app)
        .get("/api/reviews/999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("review not found");
        });
    });
    it("Status 400, bad request if review_id is not a number", () => {
      return request(app)
        .get("/api/reviews/dog")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
  });
});
