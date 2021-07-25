const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    restaurantName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        min: 6
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    location: {
        address: {
            type: String,
            required: true,
            min: 6
        },
        apt: {
            type: String,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        zip: {
            type: String,
            required: true,
            min: 5
        }

    },
    phone: {
        type: String,
        min: 10
    },
    schedule: [],
    menu: []
});

module.exports = mongoose.model("Restaurant", restaurantSchema);