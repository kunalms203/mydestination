const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl } = require("../middleware");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser); 
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash(
        "success",
        "Account created successfully! You are loggedin in."
      );
      return res.redirect("/Listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup"); // Ensure redirection in case of error
  } 
}));

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post("/login", saveRedirectUrl, passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true,
}), async (req, res) => {
  req.flash("success", "You are now logged in!");
  const redirectUrl = res.locals.redirectUrl || "/Listings"; // Fallback to /Listings if undefined
  res.redirect(redirectUrl);
});

 
router.get("/logout", (req, res) => {
  req.logout((err)=>{
    if(err){
      next(err);
    }
    req.flash("success", "You are now logged out!");
    res.redirect("/Listings"); 
  });
})
module.exports = router;
