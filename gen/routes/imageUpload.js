const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
var authenticate = require("../authenticate");

const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(JPG|jpg|PNG|jpeg|png|gif)$/)) {
    cb(new Error("you Can Upload only Image Files"), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({ storage: Storage, fileFilter: imageFilter });

const imageRouter = express.Router();

imageRouter.use(bodyParser.json());

imageRouter
  .route("/")
  .post(authenticate.verifyUser, upload.single("imageFile"), (req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-type", "application/json");
    res.json(req.file);
  });

module.exports = imageRouter;
