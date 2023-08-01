const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const session = require("express-session");
const usersRouter = require("./routes/users");
const orderRouter = require("./routes/orders");
const orderItemRouter = require("./routes/order-item");

const app = express();
app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/orders", orderRouter);
app.use("/users", usersRouter);
app.use("/order-items", orderItemRouter);

// catch 404 and forward to error handler
app.use(function (request, response, next) {
  next(createError(404));
});

// error handler
app.use(function (err, request, response, next) {
  // set locals, only providing error in development
  response.locals.message = err.message;
  response.locals.error = request.app.get("env") === "development" ? err : {};

  process.env.TOKEN_SECRET;

  app.use(
    session({
      secret: "your_secret_key_here", // Replace with a random secret key
      resave: false,
      saveUninitialized: true,
    })
  );

  // render the error page
  response.status(err.status || 500);
  response.render("error");
});

module.exports = app;
