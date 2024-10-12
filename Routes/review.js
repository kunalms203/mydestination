const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressErrors.js');
const Review = require('../models/review.js');
const Listing = require('../models/listing.js'); // Added the Listing model import
const { isLoggedIn, isAuthor } = require('../middleware.js');
const { postReview, deleteReview } = require('../controllers/review.js');


// Review Post Route
router.post("/",isLoggedIn , wrapAsync(postReview));

// Delete Review Route
router.delete("/:reviewId",isLoggedIn , isAuthor , wrapAsync(deleteReview));

module.exports = router;
