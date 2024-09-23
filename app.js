const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

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
  const listing = await Listing.findById(id);
  res.render("Listings/show.ejs", { listing });
}));

// Create Route
app.post("/Listings", wrapAsync(async (req, res) => {
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
  let updatedListing=await Listing.findByIdAndUpdate(id, req.body.listing, {
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

app.use((err,req,res,next)=>{
  res.send("Something Went wrong");
})

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
// app.get("/testlistings",async (req, res) => {
//     let sampelListing = new Listing({
//         title: "My Home Listing",
//         description: "This is a sample listing",
//         img:"https://plus.unsplash.com/premium_photo-1682377521753-58d1fd9fa5ce?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         price: 100,
//         location: "New York, NY",
//         country:"USA"
//     });
//     await sampelListing.save();
//     res.send("Saved");
// })
