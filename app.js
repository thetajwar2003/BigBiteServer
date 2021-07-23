const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv/config');

// listen to server
app.listen(3000);

// routes
app.get('/', (req, res) => {
    res.send('hello world');
});

// connect to mongodb
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log("connected to db"))
    .catch((err) => console.log(err));