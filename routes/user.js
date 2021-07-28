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
    if (restaurants) return res.status(200).send({ message: restaurants });
    else return res.status(400).send({ message: "Error in retrieving restaurants data" });
});

// get info of specific restaurant
router.get("/:restaurantId", validateUserToken, async (req, res) => {
    const restaurant = await Restaurant.find({ _id: req.params.restaurantId }, { password: 0 });
    if (restaurant) return res.status(200).send({ message: restaurant });
    else return res.status(400).send({ message: "Error in retrieving restaurant data" });
});

// get info of specific item
router.get("/:restaurantId/:itemId", validateUserToken, async (req, res) => {
    const restaurant = await await Restaurant.findById(req.params.restaurantId);

    const specificItem = restaurant.menu.find(function (item, index) {
        if (item._id == req.params.itemId) return true;
        else return false;
    });

    if (specificItem) return res.status(200).send({ message: specificItem });
    else return res.status(400).send({ message: "Item does not exist" });
});

// add item to cart
router.post("/:restaurantId/:itemId", validateUserToken, async (req, res) => {
    const user = await User.findById(req.user._id);
    const restaurant = await Restaurant.findById(req.params.restaurantId);

    const specificItem = restaurant.menu.find(function (item, index) {
        if (item._id == req.params.itemId) return true;
        else return false;
    });

    if (specificItem) var cartItem = { ...specificItem, quantity: 1 };
    else return res.status(400).send({ message: "Item does not exist" });

    try {
        const update = await user.updateOne({
            $push: { bag: cartItem }
        });
        if (update) return res.status(200).send({ message: user.bag });
    } catch (err) {
        res.status(400).send({ message: err });
    }
});

// TODO: get user's bag
// TODO: get user's order history
// TODO: delete from cart
// TODO: update quantity 
// TODO: checkout 
// TODO: update user's order history after checkout

module.exports = router;