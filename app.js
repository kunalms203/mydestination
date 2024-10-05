const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressErrors.js');


const listing = require('./Routes/listing.js');
const reviews = require('./Routes/review.js');

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


app.use("/Listings", listing);
app.use("/Listings/:id/reviews", reviews);

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

