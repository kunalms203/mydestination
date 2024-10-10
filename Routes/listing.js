const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require("../models/listing.js");
const ExpressError = require('../utils/ExpressErrors.js');
const flash = require('connect-flash');
const {isLoggedIn, isOwner} = require("../middleware.js");


// new Route
router.get("/new", isLoggedIn , (req, res) => {
  console.log(req.user); 
  res.render("Listings/new.ejs");
});

  
  // Index Route
  router.get("/", wrapAsync(async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("Listings/index.ejs", { alllistings });
  }));
  
  // Listing Detail
  router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
      req.flash("error","Listing that you have requested for does not exist");
      res.redirect("/listings");
    }
    res.render("Listings/show.ejs", { listing });
  }));
  
  // Create Route
  router.post("/", isLoggedIn ,  wrapAsync(async (req, res) => {
    if(!req.body.listing){ 
      throw new ExpressError(400,"Please Entere the valid listing");
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;  // Adding the user id to the listing owner field
    await newListing.save();
    req.flash("success","Successfully new listing created");
    console.log(newListing);
    res.redirect("/Listings");
  }));
  
  // Edit  Route
  router.get("/:id/edit",isLoggedIn, isOwner , wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing that you have requested for does not exist");
      res.redirect("/listings");
    }
    res.render("Listings/edit.ejs", { listing });
  }));
  
  // Update Route
  router.put("/:id", isLoggedIn , isOwner ,  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    let updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, {
      new: true,
    });
    req.flash("success","Listing successfully updated");
    console.log(updatedListing);
    res.redirect("/Listings");
  }));
  
  // Delete Route 
  router.delete("/:id",isLoggedIn , isOwner , wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing successfully Deleted");
    res.redirect("/Listings");
  }));

  module.exports = router;