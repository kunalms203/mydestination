
const User = require("../models/user");

module.exports.signUp = async (req, res, next) => {
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
  };

module.exports.login =  async (req, res) => {
    req.flash("success", "You are now logged in!");
    const redirectUrl = res.locals.redirectUrl || "/Listings"; // Fallback to /Listings if undefined
    res.redirect(redirectUrl);
  };

  module.exports.logout =  (req, res) => {
    req.logout((err)=>{
      if(err){
        next(err);
      }
      req.flash("success", "You are now logged out!");
      res.redirect("/Listings"); 
    });
  };

