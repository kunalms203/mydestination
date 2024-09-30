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