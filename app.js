const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require("cors");
require('dotenv/config');

// routes
const userRoute = require("./routes/user");
const restaurantRoute = require("./routes/restaurant");

// middleware
app.use(cors());
app.use(express.json());

// listen to server
app.listen(5000);

// routes middleware
app.use("/api/user", userRoute);
app.use("/api/restaurant", restaurantRoute);

// routes
app.get('/', (req, res) => {
    res.send('hello world');
});

// connect to mongodb
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log("connected to db"))
    .catch((err) => console.log(err));