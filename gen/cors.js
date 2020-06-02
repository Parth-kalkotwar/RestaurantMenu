const express = require("express");
const cors = require("cors");
const app = express();

const whiteList = ["http://localhost:3000", "https://localhost:3443"];

var corsDelegateoptions = (req, callback) => {
  var corsOptions;
  if (whiteList.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  return null, corsOptions;
};

exports.cors = cors();
exports.corsOptions = cors(corsDelegateoptions);
