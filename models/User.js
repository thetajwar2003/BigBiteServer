const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 2
    },
    lastName: {
        type: String,
        required: true,
        min: 2
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
    date: {
        type: Date,
        default: Date.now
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
    pastOrders: [],
    bag: [],
});

module.exports = mongoose.model('User', userSchema);