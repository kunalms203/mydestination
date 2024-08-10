const initData = require('./data.js',);
const  Listing = require('../models/listing.js');
const mongoose = require("mongoose");

main();
async function main() {
    try {
      await mongoose.connect("mongodb://127.0.0.1:27017/mydestination");
      console.log("Connected to MongoDB");
    } catch (error) {
      console.log("Error connecting to MongoDB:", error.message);
    }
  }


  const initDb = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Database initialized with sample data");
  };

  initDb();
