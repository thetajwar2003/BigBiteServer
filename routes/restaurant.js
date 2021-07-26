const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Restaurant = require("../models/Restaurant");
const { restaurantRegisterValidation, restaurantLoginValidation } = require("../validation");
const menuRoute = require("./menu");

router.post("/", (req, res) => {
    res.send("restaurant account settings");
});

router.post("/register", async (req, res) => {
    // validate the data that is being sent
    const { error } = restaurantRegisterValidation(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    // check if restaurant has already signed up
    const emailExists = await Restaurant.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).send({ message: "Account already exists with this email" });

    // if restaurant hasn't signed up, salt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    // create new restaurant
    const restaurant = new Restaurant({
        restaurantName: req.body.restaurantName,
        email: req.body.email,
        password: hashedPass,
        location: req.body.location,
        phone: req.body.phone,
    });

    // save the restaurant doc to mongodb
    try {
        const saved = await restaurant.save();
        res.status(200).send({ id: restaurant._id });
    } catch (err) {
        res.status(400).send({ message: err });
    }

});

router.post('/login', async (req, res) => {
    // validate the data that is being passed in
    const { error } = restaurantLoginValidation(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    // check if there is a restaurant with the credentials
    const restaurant = await Restaurant.findOne({ email: req.body.email });
    if (!restaurant) return res.status(400).send({ message: "No restaurant in our record. Please sign up." });

    // check the password
    const validPassword = await bcrypt.compare(req.body.password, restaurant.password);
    if (!validPassword) return res.status(400).send({ message: "Incorrect password. Try again." });

    // create and sign token if email and password are valid
    const token = jwt.sign({ _id: restaurant._id }, process.env.RESTAURANT_TOKEN_SECRET);
    res.status(200).header("auth-token", token).send(token);
});


// middleware function
router.use("/menu", menuRoute);

module.exports = router;