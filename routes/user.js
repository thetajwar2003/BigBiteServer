const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const { userRegisterValidation, userLoginValidation } = require("../validation");
const { validateUserToken } = require("./validateToken");

router.post("/register", async (req, res) => {
    // validate the data that is being sent
    const { error } = userRegisterValidation(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    // check if user has already signed up
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).send({ message: "Account already exists with this email" });

    // if user hasn't signed up, salt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    // create new user
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPass,
        location: req.body.location,
        phone: req.body.phone,
    });

    // save the user doc to mongodb
    try {
        const saved = await user.save();
        res.status(200).send({ id: user._id });
    } catch (err) {
        res.status(400).send({ message: err });
    }

});

router.post('/login', async (req, res) => {
    // validate the data that is being passed in
    const { error } = userLoginValidation(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    // check if there is a user with the credentials
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send({ message: "No user in our record. Please sign up." });

    // check the password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send({ message: "Incorrect password. Try again." });

    // create and sign token if email and password are valid
    const token = jwt.sign({ _id: user._id }, process.env.USER_TOKEN_SECRET);
    res.status(200).header("auth-token", token).send({ "token": token });
});

// get list of restaurants
router.get("/", validateUserToken, async (req, res) => {
    const restaurants = await Restaurant.find({}, { _id: 1, restaurantName: 1, location: 1 });
    if (restaurants) return res.status(200).send({ restaurants: restaurants });
    else return res.status(400).send({ message: "Error in retrieving restaurants data" });
});

// get user's bag
router.get("/bag", validateUserToken, async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) return res.status(200).send({ "bag": user.bag });
    else return res.status(400).send({ "message": "User not found" });
});

// get user's order history
router.get("/pastOrders", validateUserToken, async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) return res.status(200).send({ "pastOrders": user.pastOrders });
    else return res.status(400).send({ "message": "User not found" });
});

// get info of specific restaurant
router.get("/:restaurantId", validateUserToken, async (req, res) => {
    const restaurant = await Restaurant.find({ _id: req.params.restaurantId }, { password: 0 });
    if (restaurant) return res.status(200).send(restaurant[0]);
    else return res.status(400).send({ message: "Error in retrieving restaurant data" });
});

// get info of specific item
router.get("/:restaurantId/:itemId", validateUserToken, async (req, res) => {
    const restaurant = await await Restaurant.findById(req.params.restaurantId);

    // find specific item from the restaurant's menu
    const specificItem = restaurant.menu.find(function (item, index) {
        if (item._id == req.params.itemId) return true;
        else return false;
    });

    if (specificItem) return res.status(200).send(specificItem);
    else return res.status(400).send({ message: "Item does not exist" });
});

// add item to cart
router.post("/:restaurantId/:itemId", validateUserToken, async (req, res) => {
    const user = await User.findById(req.user._id);
    const restaurant = await Restaurant.findById(req.params.restaurantId);

    // find specific item from the restaurant's menu
    const specificItem = restaurant.menu.find(function (item, index) {
        if (item._id == req.params.itemId) return true;
        else return false;
    });

    // if there is an item create an object with all the info plus the quantity 
    if (specificItem) var cartItem = { ...specificItem, quantity: req.body.quantity };
    else return res.status(400).send({ message: "Item does not exist" });

    // add item to the user's bag in the db
    try {
        const update = await user.updateOne({
            $push: { bag: cartItem }
        });
        if (update) return res.status(200).send(user.bag);
    } catch (err) {
        res.status(400).send({ message: err });
    }
});

// checkout 
router.post("/checkout", validateUserToken, async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user.bag.length > 0) {
        // clear out bag
        try {
            const clear = await user.updateOne({
                $set: { bag: [] }
            });
        } catch (err) {
            res.status(400).send({ message: err });
        }

        // move order to pastOrder
        try {
            const update = await user.updateOne({
                $push: { pastOrders: [{ ...user.bag, date: Date.now() }] }
            });
            if (update) return res.status(200).send({ pastOrders: user.pastOrders });
        } catch (err) {
            res.status(400).send({ message: err });
        }
    }
    else return res.status(400).send({ "message": "Bag is empty" });
});
// delete from cart
router.delete("/:itemId", validateUserToken, async (req, res) => {
    const user = await User.findById(req.user._id);

    // find item that will be deleted
    const deletingItem = user.bag.find(function (item, index) {
        if (item._id == req.params.itemId) return true;
        else return false;
    });

    // delete the item from the bag
    try {
        const remove = await user.updateOne({
            $pull: { bag: deletingItem }
        });
        res.status(200).send({ "message": "Removed" });
    } catch (err) {
        res.status(400).send({ message: err });
    }
});
// update quantity 
router.patch("/:restaurantId/:itemId", validateUserToken, async (req, res) => {
    const user = await User.findById(req.user._id);
    const restaurant = await Restaurant.findById(req.params.restaurantId);

    // find specific item from the restaurant's menu
    const specificItem = restaurant.menu.find(function (item, index) {
        if (item._id == req.params.itemId) return true;
        else return false;
    });

    // if there is an item create an object with all the info plus the quantity 
    if (specificItem) var cartItem = { ...specificItem, quantity: req.body.quantity };
    else return res.status(400).send({ message: "Item does not exist" });

    // find item from the user's bag that will be deleted
    const deletingItem = user.bag.find(function (item, index) {
        if (item._id == req.params.itemId) return true;
        else return false;
    });

    // delete the item from the bag
    try {
        const remove = await user.updateOne({
            $pull: { bag: deletingItem }
        });
    } catch (err) {
        res.status(400).send({ message: err });
    }

    // add item to the user's bag in the db
    try {
        const update = await user.updateOne({
            $push: { bag: cartItem }
        });
        if (update) return res.status(200).send({ "message": "Updated quantity" });
    } catch (err) {
        res.status(400).send({ message: err });
    }
});

module.exports = router;