const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Menu = require("../models/MenuItem");
const Restaurant = require("../models/Restaurant");
const { validateRestaurantToken } = require("./validateToken");
const { restaurantAddItem } = require("../validation");

// gets the entire menu
router.get("/", validateRestaurantToken, async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.restaurant._id);
        res.status(200).send({ menu: restaurant.menu });
    } catch (err) {
        res.status(400).send({ message: err });
    }
});

// TODO: add item to menu
router.post("/add", validateRestaurantToken, async (req, res) => {
    // validate the item info that is coming in
    const { error } = restaurantAddItem(req.body);
    if (error) return res.status(400).send({ message: "Error adding item to your menu" });

    // create an item object
    const item = new Menu({
        itemName: req.body.itemName,
        price: req.body.price,
        description: req.body.description
    });

    // check if item is already in the menu
    const restaurant = await Restaurant.findById(req.restaurant._id);
    const itemExists = restaurant.menu.find(function (item, index) {
        if (item.itemName == req.body.itemName) return true;
        else return false;
    });
    if (itemExists) return res.status(400).send({ message: "Item is already in menu. Try adding a new item or updating this one." });

    // save item to db
    try {
        const update = await restaurant.updateOne({
            $push: { menu: item }
        });
        if (update) return res.status(200).send({ menu: restaurant.menu });
    } catch (err) {
        res.status(400).send({ message: err });
    }
});

// TODO: delete item to menu
router.delete("/delete", validateRestaurantToken, async (req, res) => {
    res.send("delete item");
});

// TODO: update item
router.patch("/update", validateRestaurantToken, async (req, res) => {
    res.send("update item");
});

module.exports = router;