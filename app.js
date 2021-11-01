const express = require("express");
const app = express();
const apiRouter = require("./routers/api-router.js");
const {
  handlesCustomErrors,
  handlesPSQLErrors,
  handles500s,
} = require("./controllers/errors-controller.js");

app.use(express.json());

app.use("/api", apiRouter);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

app.use(handlesCustomErrors);
app.use(handlesPSQLErrors);
app.use(handles500s);

module.exports = app;
