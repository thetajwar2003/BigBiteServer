const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
    }
});

module.exports = mongoose.model("MenuItem", menuItemSchema);