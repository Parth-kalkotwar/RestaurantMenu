var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var config = require("./config");
var passport = require("passport");
var session = require("express-session");
var authenticate = require("./authenticate");
var fileStore = require("session-file-store")(session);
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var dishRouter = require("./routes/dishRouter");
var favoritesRouter = require("./routes/favoritesRouter");
const mongoose = require("mongoose");
const dishes = require("./models/dishSchema");
const imageRouter = require("./routes/imageUpload");
const url = config.mongoUrl;
var cons = require("consolidate");
var morgan = require("morgan");
const connect = mongoose.connect(url);
var app = express();

app.all("*", (req, res, next) => {
  if (req.secure) {
    next();
  } else {
    res.redirect(
      307,
      "https://" + req.hostname + ":" + app.get("secPort") + req.url
    );
  }
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(express.static(path.join(__dirname, "public")));

// Set 'views' directory for any views
// being rendered res.render()
/*app.set("views", path.join(__dirname, "views"));

// Set view engine as EJS
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
*/
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//app.use(cookieParser("12345-67890-09876-54321"));

app.use(passport.initialize());

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use("/dishes", dishRouter);
app.use("/imageUpload", imageRouter);
app.use("/favorites", favoritesRouter);

connect.then(
  (db) => {
    console.log("Connected to Database");
  },
  (err) => {
    console.log(err);
  }
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
