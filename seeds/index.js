if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const dbUrl= process.env.DB_URL;


mongoose.connect(String(dbUrl), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '64ddfe170136f0bcedb2e220',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)}`,
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude,
                cities[random1000].latitude,]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dnqh5zrrr/image/upload/v1686342550/YelpCamp/gp6llomsfewmrqj2ndmb.jpg',
                  filename: 'YelpCamp/nn2vh8yz05dfbxyfrgjy'
                }
              ],
            description: 'Join us on this exhilarating journey, where the ring becomes a canvas for self-expression, determination is your greatest asset, and victory starts with stepping through our doors. Experience the heart-pounding energy of our MMA Gym – where warriors become legends.',
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})