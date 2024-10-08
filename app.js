const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressErrors.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./Routes/listing.js");
const reviewsRouter = require("./Routes/review.js");
const userRouter = require("./Routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main();
async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/mydestination");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error.message);
  }
}

app.get("/", (req, res) => {
  res.send("you are on the Root ports");
});

const sessionOption = {
  secret: "secretKey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.crrUser = req.user;
  next();
});

app.get("/demouser", async (req, res) => {
  let fakeUser = new User({
    email: "demo@example.com",
    username: "demouser",
  });
  let registeredUser = await User.register(fakeUser, "HelloWorld");
  res.send(registeredUser);
});

app.use("/Listings", listingRouter);
app.use("/Listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went wrong" } = err;
  res.render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
