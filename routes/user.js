const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { userRegisterValidation, userLoginValidation } = require("../validation");

router.post("/", (req, res) => {
    res.send("account settings");
});

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
    res.status(200).header("auth-token", token).send(token);
});

module.exports = router;