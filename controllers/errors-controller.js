exports.handlesCustomErrors = (err, req, res, next) => {
  //console.log(err);
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlesPSQLErrors = (err, req, res, next) => {
  //console.log(err.code);
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  } else if (err.code === "23503") {
    res.status(400).send({ msg: "invalid input" });
  } else {
    next(err);
  }
};

exports.handles500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
};
