const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressErrors.js');
const Review = require('./models/review.js');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main();
async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/mydestination");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error.message);
  }
}

app.get("/", (req, res) => {
  res.send("you are on the Root ports");
});

// New Listing Route
app.get("/Listings/new", (req, res) => {
  res.render("Listings/new.ejs");
});

// Index Route
app.get("/Listings", wrapAsync(async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("Listings/index.ejs", { alllistings });
}));

// Listing Detail
app.get("/Listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");;
  res.render("Listings/show.ejs", { listing });
}));

// Create Route
app.post("/Listings", wrapAsync(async (req, res) => {
  if(!req.body.listing){
    throw new ExpressError(400,"Please Entere the valid listing");
  }
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  console.log(newListing);
  res.redirect("/Listings");
}));

// Edit  Route
app.get("/Listings/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  res.render("Listings/edit.ejs", { listing });
}));

// Update Route
app.put("/Listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, {
    new: true,
  });
  console.log(updatedListing);
  res.redirect("/Listings");
}));

// Delete Route 
app.delete("/Listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/Listings");
}));

// Review Post Route
app.post("/Listings/:id/reviews", wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review)

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  
  console.log("new review Saved");
  res.redirect(`/Listings/${listing.id}`);
}));

// delete review route

app.delete("/Listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/Listings/${id}`);
}));

app.all("*", (req, res, next) => { 
  next(new ExpressError( 404,"Page Not Found"));
});



app.use((err, req, res, next) => {
  let { statusCode=500, message="Something Went wrong" } = err;
  // res.status(statusCode).send(message);
  res.render("error.ejs", { message});
})

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

