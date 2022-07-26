var createError = require("http-errors");
var express = require("express");

var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var db = require("./database/conn");
var session = require("express-session");
var flash = require("express-flash");
var methodOverride = require("method-override");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");
var billingRouter = require("./routes/billing");
var bookingRouter = require("./routes/booking");
var customerRouter = require("./routes/customer");
var jadwalRouter = require("./routes/jadwal");
var kapsterRouter = require("./routes/kapster");
var modelRambutRouter = require("./routes/modelRambut");
var servicesRouter = require("./routes/services");
var transaksiRouter = require("./routes/transaksi");
var logRouter = require("./routes/log");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use((req, res, next) => {
  req.db = db;
  next();
});
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 600000 },
  })
);
app.use(flash());
app.use(methodOverride("_method"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.redirect("/auth/login");
});
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/billing", billingRouter);
app.use("/booking", bookingRouter);
app.use("/customer", customerRouter);
app.use("/jadwal", jadwalRouter);
app.use("/model-rambut", modelRambutRouter);
app.use("/services", servicesRouter);
app.use("/transaksi", transaksiRouter);
app.use("/kapster", kapsterRouter);
app.use("/log", logRouter);
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
