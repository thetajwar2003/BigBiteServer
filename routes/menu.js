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

// add item to menu
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

// delete item from menu
router.delete("/:itemId", validateRestaurantToken, async (req, res) => {
    const restaurant = await Restaurant.findById(req.restaurant._id);

    // find item that will be deleted
    const deletingItem = restaurant.menu.find(function (item, index) {
        if (item._id == req.params.itemId) return true;
        else return false;
    });

    // delete the item from the menu
    try {
        const remove = await restaurant.updateOne({
            $pull: { menu: deletingItem }
        });
        res.status(200).send({ message: "Removed" });
    } catch (err) {
        res.status(400).send({ message: err });
    }
});

// update item in menu
router.patch("/:itemId", validateRestaurantToken, async (req, res) => {
    // validate the item info that is coming in
    const { error } = restaurantAddItem(req.body);
    if (error) return res.status(400).send({ message: "Error adding item to your menu" });

    const restaurant = await Restaurant.findById(req.restaurant._id);

    // delete the existing item
    const deletingItem = restaurant.menu.find(function (item, index) {
        if (item._id == req.params.itemId) return true;
        else return false;
    });

    // create a new item object with the same id
    const item = new Menu({
        _id: req.params.itemId,
        itemName: req.body.itemName,
        price: req.body.price,
        description: req.body.description
    });

    // update the item
    try {
        // delete method
        const deleted = await restaurant.updateOne(
            { $pull: { menu: deletingItem } },
        );
        // push method
        const replaced = await restaurant.updateOne({
            $push: { menu: item }
        });
        res.status(200).send({ message: "Updated" });
    } catch (err) {
        res.status(400).send({ message: err });
    }
});

module.exports = router;