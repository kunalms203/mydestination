const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressErrors.js");
const flash = require("connect-flash");
const { isLoggedIn, isOwner } = require("../middleware.js");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })


const {
  indexRoute,
  showRoute,
  newRoute,
  createRoute,
  editRoute,
  updateRoute,
  deleteRoute,
} = require("../controllers/listing.js");


// create Route
router.get("/new", isLoggedIn, wrapAsync(createRoute));

// Index Route
// new Route
router
  .route("/")
  .get(wrapAsync(indexRoute))
  .post(isLoggedIn, wrapAsync(newRoute));


// Update Route
// Delete Route
// Listing Detail
router
  .route("/:id")
  .get(wrapAsync(showRoute))
  .put(isLoggedIn, isOwner, wrapAsync(updateRoute))
  .delete(isLoggedIn, isOwner, wrapAsync(deleteRoute));




// Edit  Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editRoute));





module.exports = router;
