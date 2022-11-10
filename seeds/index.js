const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price= Math.floor(Math.random() * 28) + 10;
    const camp = new Campground({
      author: "63608952c75877f9629d1019",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum velit exercitationem non architecto animi. Iusto sequi excepturi ut dolorem similique laudantium laborum vel nemo sed rerum eaque molestia",
      price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dk2zl15vw/image/upload/v1667946288/YelpCamp/f5tzejmmsp4aui57vaqz.jpg",
          filename: "YelpCamp/f5tzejmmsp4aui57vaqz",
        },
        {
          url: "https://res.cloudinary.com/dk2zl15vw/image/upload/v1667946322/YelpCamp/hgryskj8ah0s7lyhuslp.jpg",
          filename: "YelpCamp/hgryskj8ah0s7lyhuslp",
        },
      ],
    });
    await camp.save();
  }
};

//seedDB();
seedDB().then(() => {
  mongoose.connection.close();
});