const initData = require('./data.js',);
const  Listing = require('../models/listing.js');
const mongoose = require("mongoose");
const Review = require('../models/review.js');

main();
async function main() {
    try {
      await mongoose.connect("mongodb://127.0.0.1:27017/mydestination");
      console.log("Connected to MongoDB");
    } catch (error) {
      console.log("Error connecting to MongoDB:", error.message);
    }
  }


  // const initDb = async () => {
  //   await Listing.deleteMany({});
  //   await Listing.insertMany(initData.data);
  //   console.log("Database initialized with sample data");
  // };
  // initDb();

  const fakeReviews= [
    {
      comment: "Amazing product! Really loved the experience.",
      rating: 5,
      createdAt: "2024-09-30T12:15:23.000Z",
      user: "650e6e911e15e6d294b87b45"
    },
    {
      comment: "It was decent but could be improved in certain aspects.",
      rating: 3,
      createdAt: "2024-09-28T09:47:12.000Z",
      user: "650e6e911e15e6d294b87c78"
    },
    {
      comment: "Not satisfied with the quality. Too expensive for what it offers.",
      rating: 2,
      createdAt: "2024-10-01T17:25:36.000Z",
      user: "650e6e911e15e6d294b87d09"
    },
    {
      comment: "Excellent service and quality! Will recommend to others.",
      rating: 4,
      createdAt: "2024-09-29T13:14:11.000Z",
      user: "650e6e911e15e6d294b87e32"
    },
    {
      comment: "Had a bad experience. The product stopped working within a week.",
      rating: 1,
      createdAt: "2024-09-27T11:33:55.000Z",
      user: "650e6e911e15e6d294b87f43"
    }
  ];

  const addReviews = async () => {
    const listings = await Listing.find({});
      for(i=0; i< fakeReviews.length; i++) {
        let review1 = new Review(fakeReviews[i]);
        for (const listing of listings) {
          await listing.reviews.push(review1);
          await listing.save();
        }
      await review1.save();
      }
    
    console.log("Reviews added to listings");
  };

  addReviews();