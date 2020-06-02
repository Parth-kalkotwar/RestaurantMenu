const express = require("express");
const bodyParser = require("body-parser");
const dishIdRouter = express.Router();

dishIdRouter.use(bodyParser.json());

dishIdRouter
  .route("/:dishId")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    console.log(req.params);
    res.end("DishID" + req.params.dishId);
  })
  .post((req, res, next) => {
    res.end("POST request for " + req.params.dishId);
  })
  .put((req, res, next) => {
    res.end("PUT request for " + req.params.dishId);
  })
  .delete((req, res, next) => {
    res.end("Delete request for " + req.params.dishId);
  });

module.exports = dishIdRouter;
