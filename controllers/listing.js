const express = require("express");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressErrors.js");


module.exports.indexRoute = async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("Listings/index.ejs", { alllistings });
  }

module.exports.showRoute = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({path:"reviews",
        populate: { path: "author"}
      })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing that you have requested for does not exist");
      res.redirect("/listings");
    }
    res.render("Listings/show.ejs", { listing });
  }

module.exports.newRoute = async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Please Entere the valid listing");
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // Adding the user id to the listing owner field
    await newListing.save();
    req.flash("success", "Successfully new listing created");
    console.log(newListing);
    res.redirect("/Listings");
  }

  module.exports.createRoute = (req, res) => {
    console.log(req.user);
    res.render("Listings/new.ejs");
  }

module.exports.editRoute = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing that you have requested for does not exist");
      res.redirect("/listings");
    }
    res.render("Listings/edit.ejs", { listing });
  }

module.exports.updateRoute = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    let updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, {
      new: true,
    });
    req.flash("success", "Listing successfully updated");
    console.log(updatedListing);
    res.redirect("/Listings");
  }

module.exports.deleteRoute = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing successfully Deleted");
    res.redirect("/Listings");
  }