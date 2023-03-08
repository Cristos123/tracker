var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const mongoose = require("mongoose");
var cors = require("cors");
require("dotenv").config();

// const mongoURL = process.env.MONGOATLASURL;
const mongoURL =
  process.env.NODE_ENV === "development"
    ? process.env.LOCALMONGOURL
    : process.env.MONGOATLASURL;

const connect = mongoose.connect(mongoURL);
//0.0.0.0
connect
  .then(() =>
    console.log(
      "==============Mongodb Database Connected Successfully=============="
    )
  )
  .catch((err) => console.log("err", err, "Database Not Connected !!!"));

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const { authCheck } = require("./controller/authenticate");
const adminRouter = require("./routes/admin");
const energyRouter = require("./routes/energyRoute");

var app = express();

app.disable("x-powered-by");
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({ origin: "*" }));
app.use(authCheck);
app.use("/api/v2/admin", adminRouter);
app.use("/api/v2/", indexRouter);
app.use("/api/v2/users", usersRouter);
app.use("/api/v2/energyIot", energyRouter);

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
