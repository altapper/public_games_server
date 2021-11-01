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

describe("PATCH api/reviews/:review_id", () => {
  describe("happy path", () => {
    it("Status 200, returns the corresponding review object with the votes updated", () => {
      const patchObj = { inc_votes: 3 };
      return request(app)
        .patch("/api/reviews/2")
        .send(patchObj)
        .expect(200)
        .then(({ body }) => {
          const review = body.review;
          expect(review.votes).toBe(8);
        });
    });
  });
  describe("error handling", () => {
    it("Status 404, review not found if a review_id is a number but does not exist", () => {
      const patchObj = { inc_votes: 3 };
      return request(app)
        .patch("/api/reviews/999")
        .send(patchObj)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("review not found");
        });
    });
    it("Status 400, bad request if review_id is not a number", () => {
      const patchObj = { inc_votes: 3 };
      return request(app)
        .patch("/api/reviews/dog")
        .send(patchObj)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    it("Status 400, bad request if there is no inc_votes key on the patch Object", () => {
      const patchObj = { no_inc_votes: 3 };
      return request(app)
        .patch("/api/reviews/2")
        .send(patchObj)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    it("Status 400, bad request if there inc_votes is not a number", () => {
      const patchObj = { inc_votes: "hello" };
      return request(app)
        .patch("/api/reviews/2")
        .send(patchObj)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
  });
});

describe("GET api/reviews", () => {
  describe("happy path with no queries etc", () => {
    it("Status 200, returns an object with an array of reviews sorted by date by default, with total comments as a new key", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          const reviews = body.reviews;
          expect(reviews.length).toBe(13);
          expect(reviews[0].comment_count).toBe("0");
          expect(reviews[6].comment_count).toBe("3");
          expect(reviews).toBeSortedBy("created_at", { descending: true });
          //console.log(reviews);
        });
    });
    it("Status 200, returns an object with an array of reviews sorted by a different key - e.g. designer", () => {
      return request(app)
        .get("/api/reviews?sort_by=review_body")
        .expect(200)
        .then(({ body }) => {
          const reviews = body.reviews;
          //console.log(reviews);
          expect(reviews.length).toBe(13);
          expect(reviews).toBeSortedBy("review_body", { descending: true });
        });
    });
    it("Status 200, returns an object with an array of reviews sorted default key but ascending order", () => {
      return request(app)
        .get("/api/reviews?order=asc")
        .expect(200)
        .then(({ body }) => {
          const reviews = body.reviews;
          //console.log(reviews);
          expect(reviews.length).toBe(13);
          expect(reviews).toBeSortedBy("created_at", { descending: false });
        });
    });
    it("Status 200, returns an object with an array of reviews sorted by a different key - e.g. designer - and ascending order!", () => {
      return request(app)
        .get("/api/reviews?sort_by=review_body&&order=asc")
        .expect(200)
        .then(({ body }) => {
          const reviews = body.reviews;
          //console.log(reviews);
          expect(reviews.length).toBe(13);
          expect(reviews).toBeSortedBy("review_body", { descending: false });
        });
    });
    it("Status 200, returns an object in default sort order with category='social deduction'", () => {
      return request(app)
        .get("/api/reviews?category=social deduction")
        .expect(200)
        .then(({ body }) => {
          const reviews = body.reviews;
          //console.log(reviews);
          expect(reviews.length).toBe(11);
          reviews.forEach((review) => {
            expect(review.category).toBe("social deduction");
          });
          expect(reviews).toBeSortedBy("created_at", { descending: true });
        });
    });
    it("Status 200, returns an object sorted by designer in ascending order, with category='social deduction'", () => {
      return request(app)
        .get(
          "/api/reviews?sort_by=designer&&order=asc&&category=social deduction"
        )
        .expect(200)
        .then(({ body }) => {
          const reviews = body.reviews;
          //console.log(reviews);
          expect(reviews.length).toBe(11);
          reviews.forEach((review) => {
            expect(review.category).toBe("social deduction");
          });
          expect(reviews).toBeSortedBy("designer", { descending: false });
        });
    });
  });
  describe("error handling", () => {
    it("Status 400, invalid sort query for sort_by", () => {
      return request(app)
        .get(
          "/api/reviews?sort_by=designerwoo&&order=asc&&category=social deduction"
        )
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid sort query");
        });
    });
    it("Status 400, invalid sort query for order", () => {
      return request(app)
        .get(
          "/api/reviews?sort_by=designer&&order=ascending&&category=social deduction"
        )
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid sort query");
        });
    });
    it("Status 404, category not in database/not found", () => {
      return request(app)
        .get("/api/reviews?category=nonexistent category")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("category not found");
        });
    });
    it("Status 404, no reviews found with that category", () => {
      return request(app)
        .get("/api/reviews?category=children's games")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("no reviews found with that category");
        });
    });
  });
});
