const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl } = require("../middleware");
const { signUp, login } = require("../controllers/user");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(signUp));

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post("/login", saveRedirectUrl, passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true,
}),login);

 
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
