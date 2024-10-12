const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review")
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {type: String,
    set: (v) =>
      v === ""
        ? "https://plus.unsplash.com/premium_photo-1682377521753-58d1fd9fa5ce?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        : v,
    default:
      "https://plus.unsplash.com/premium_photo-1682377521753-58d1fd9fa5ce?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",}   
  ,
  price: Number,
  location: String,
  country: String,
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review"  // referencing Review model  // this reference is used to fetch the related review document when listing document is fetched from db.
  }],
  owner : {
    type: Schema.Types.ObjectId,
    ref: "User"  // referencing User model  // this reference is used to fetch the related user document when listing document is fetched from db.
  }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }

});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
