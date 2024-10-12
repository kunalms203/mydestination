const ExpressError = require('../utils/ExpressErrors.js');
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');

module.exports.postReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError('Listing not found', 404);
    }
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","new review added");
    res.redirect(`/Listings/${listing.id}`);
}


module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    // Handle if the listing is not found
    if (!listing) {
        throw new ExpressError('Listing not found', 404);
    }
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," Review deleted");
    res.redirect(`/Listings/${id}`);
}
