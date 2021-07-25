const Joi = require("@hapi/joi");

// user register validation
const userRegisterValidation = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required().min(2),
        lastName: Joi.string().required().min(2),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required().pattern(new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])")),
        location: Joi.object().required(),
        phone: Joi.string().required()
    });
    return schema.validate(data);
};

// user login validation
const userLoginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
};

// restaurant register validation
const restaurantRegisterValidation = (data) => {
    const schema = Joi.object({
        restaurantName: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().pattern(new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])")),
        location: Joi.object().required(),
        phone: Joi.string().required(),
    });
    return schema.validate(data);
};

// restaurant login validation
const restaurantLoginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
    });
    return schema.validate(data);
};

module.exports.userRegisterValidation = userRegisterValidation;
module.exports.userLoginValidation = userLoginValidation;
module.exports.restaurantRegisterValidation = restaurantRegisterValidation;
module.exports.restaurantLoginValidation = restaurantLoginValidation;
