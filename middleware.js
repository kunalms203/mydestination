const Listing = require("./models/listing.js")
module.exports.isLoggedIn = (req , res , next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to access this page");
        return res.redirect("/login");
    }
    next(); 
};

module.exports.saveRedirectUrl = (req , res , next) => { 
    if (req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }else{
        res.locals.redirectUrl = "/Listings"
    };
    next();
};

module.exports.isOwner = async (req , res , next)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.crrUser._id)){
        req.flash("error","You are mot Owner of this Listing");
        res.redirect(`/Listings/${id}`)
      }
      next();
}