const jwt = require('jsonwebtoken');

const validateUserToken = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) return res.status(401).send({ message: "Access Denied" });
    try {
        const verified = jwt.verify(token, process.env.USER_TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send({ message: "Invalid Token" });
    }
};

const validateRestaurantToken = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) return res.status(401).send({ message: "Access Denied" });
    try {
        const verified = jwt.verify(token, process.env.RESTAURANT_TOKEN_SECRET);
        req.restaurant = verified;
        next();
    } catch (err) {
        res.status(400).send({ message: "Invalid Token" });
    }
};

module.exports.validateUserToken = validateUserToken;
module.exports.validateRestaurantToken = validateRestaurantToken;