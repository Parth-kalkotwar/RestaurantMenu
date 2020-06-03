const express = require("express");
const bodyParser = require("body-parser");
const FavoriteRouter = express.Router();
const mongoose = require("mongoose");
var authenticate = require("../authenticate");
const cors = require("../cors");
const Dishes = require("../models/dishSchema");
const Favorites = require("../models/favorites");
FavoriteRouter.use(bodyParser.json());

FavoriteRouter.route("/")
  .options(cors.corsOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    console.log("Get");
    Favorites.find({ user: req.user })
      .then(
        (favorites) => {
          console.log(favorites);
          if (favorites.length > 0) {
            console.log("Not Null");
            Favorites.findById(favorites[0]._id)
              .populate("dish user")
              .then((favs) => {
                res.statusCode = 200;
                res.setHeader("Content-type", "application/json");
                res.json(favs);
              });
          } else {
            res.statusCode = 200;
            res.setHeader("Content-type", "application/json");
            res.json(favorites);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({ user: req.user })
      .then(
        (favorites) => {
          //console.log(favorites);
          if (favorites.length > 0) {
            Dishes.findById(req.body._id).then((dishes) => {
              //console.log(favorites[0].dish, dishes);
              if (favorites[0].dish.length > 0) {
                const index = favorites[0].dish.indexOf(dishes._id);
                //console.log(index);
                if (index < 0) {
                  favorites[0].dish.push(dishes);
                }
              } else {
                favorites[0].dish.push(dishes);
              }
              //console.log(favorites);
              favorites[0].save().then((favorites) => {
                Favorites.findById(favorites._id)
                  .populate("dish user")
                  .then((favs) => {
                    res.statusCode = 200;
                    res.setHeader("Content-type", "application/json");
                    res.json(favs);
                  });
              });
            });
          } else {
            //console.log("New");
            //console.log(req.body);
            req.body.user = req.user;
            Favorites.create(req.body).then((favorite) => {
              Favorites.findById(favorite._id)
                .populate("dish user")
                .then((favs) => {
                  res.statusCode = 200;
                  res.setHeader("Content-type", "application/json");
                  res.json(favs);
                });
            });
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({ user: req.user })
      .then(
        (favorite) => {
          Favorites.remove({ _id: favorite[0]._id }).then((resp) => {
            res.statusCode = 200;
            res.setHeader("Content-type", "application/json");
            res.json(resp);
          });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

FavoriteRouter.route("/:dishId")
  .options(cors.corsOptions, (req, res) => {
    res.sendStatus(200);
  })
  .post(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({ user: req.user })
      .then(
        (favorites) => {
          //console.log(favorites);
          if (favorites.length > 0) {
            Dishes.findById(req.params.dishId).then((dishes) => {
              //console.log(favorites[0].dish, dishes);
              if (favorites[0].dish.length > 0) {
                const index = favorites[0].dish.indexOf(dishes._id);
                //console.log(index);
                if (index < 0) {
                  favorites[0].dish.push(dishes);
                }
              } else {
                favorites[0].dish.push(dishes);
              }
              //console.log(favorites);
              favorites[0].save().then((favorites) => {
                Favorites.findById(favorites._id)
                  .populate("dish user")
                  .then((favs) => {
                    res.statusCode = 200;
                    res.setHeader("Content-type", "application/json");
                    res.json(favs);
                  });
              });
            });
          } else {
            //console.log("New");
            //console.log(req.body);
            req.body.user = req.user;
            const data = { user: req.user, dish: [{ _id: req.params.dishId }] };
            Favorites.create(data).then((favorite) => {
              Favorites.findById(favorite._id)
                .populate("dish user")
                .then((favs) => {
                  res.statusCode = 200;
                  res.setHeader("Content-type", "application/json");
                  res.json(favs);
                });
            });
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({ user: req.user })
      .then(
        (favorites) => {
          console.log(favorites);
          if (favorites.length > 0) {
            Dishes.findById(req.params.dishId).then((dishes) => {
              console.log(favorites[0].dish, dishes);
              if (favorites[0].dish.length > 0) {
                const index = favorites[0].dish.indexOf(dishes._id);
                //console.log(index);
                if (index > -1) {
                  favorites[0].dish.splice(index, 1);
                }
              }
              //console.log(favorites);
              favorites[0].save().then((favorites) => {
                Favorites.findById(favorites._id)
                  .populate("dish user")
                  .then((favs) => {
                    res.statusCode = 200;
                    res.setHeader("Content-type", "application/json");
                    res.json(favs);
                  });
              });
            });
          } else {
            err = new Error("Favorites not Found");
            res.statusCode = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = FavoriteRouter;
