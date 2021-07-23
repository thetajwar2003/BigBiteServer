const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    menuName: {
        type: String,
        required: true
    },
    price: {
        type: Double,
        required: true
    },
    description: {
        type: String,
    },
    restaurantName: {
        type: String,
        required: true
    },
    restaurantId: {
        type: String
    }
});

module.exports = mongoose.model("MenuItem", menuItemSchema);