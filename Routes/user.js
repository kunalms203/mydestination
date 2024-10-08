const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res) => {
  try {
  const { username, email, password } = req.body;
  const newUser = new User({username, email});
  const registeredUser = await User.register(newUser, password);
  console.log(registeredUser); 
  req.flash(
    "success",
    "Account created successfully! You are now able to log in."
  );
  res.redirect("/Listings");} catch (e) { 
    req.flash("error", e.message);
  }
}));

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post("/login", passport.authenticate("local",{
    failureRedirect: "/login", failureFlash: true ,
}), async(req , res)=>{
    req.flash("success", "You are now logged in!");
    res.redirect("/Listings");
})

module.exports = router;
