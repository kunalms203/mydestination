const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require("../models/listing.js");
const ExpressError = require('../utils/ExpressErrors.js');
const flash = require('connect-flash');



router.get("/new", (req, res) => {
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
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
      req.flash("error","Listing that you have requested for does not exist");
      res.redirect("/listings");
    }
    res.render("Listings/show.ejs", { listing });
  }));
  
  // Create Route
  router.post("/", wrapAsync(async (req, res) => {
    if(!req.body.listing){ 
      throw new ExpressError(400,"Please Entere the valid listing");
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","Successfully new listing created");
    console.log(newListing);
    res.redirect("/Listings");
  }));
  
  // Edit  Route
  router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing that you have requested for does not exist");
      res.redirect("/listings");
    }
    res.render("Listings/edit.ejs", { listing });
  }));
  
  // Update Route
  router.put("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, {
      new: true,
    });
    req.flash("success","Listing successfully updated");
    console.log(updatedListing);
    res.redirect("/Listings");
  }));
  
  // Delete Route 
  router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing successfully Deleted");
    res.redirect("/Listings");
  }));

  module.exports = router;