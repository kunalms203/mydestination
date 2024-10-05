const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressErrors.js');
const Review = require('./models/review.js');


// Review Post Route
router.post("/", wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review)
  
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    
    console.log("new review Saved");
    res.redirect(`/Listings/${listing.id}`);
  }));
  
  // delete review route
  
  router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/Listings/${id}`);
  }));
  

  module.exports = router;
