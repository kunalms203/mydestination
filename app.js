const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

main();
async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/mydestination");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error.message);
  }
}

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});

app.get("/", (req, res) => {
  res.send("you are on the same ports");
});

app.get("/testlistings",async (req, res) => {
    let sampelListing = new Listing({
        title: "My Home Listing",
        description: "This is a sample listing",
        img:"https://plus.unsplash.com/premium_photo-1682377521753-58d1fd9fa5ce?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: 100,
        location: "New York, NY",
        country:"USA"
    });
    await sampelListing.save();
    res.send("Saved");
})
