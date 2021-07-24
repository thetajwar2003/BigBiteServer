const Joi = require("@hapi/joi");

// user register validation
const userRegisterValidator = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required().min(2),
        lastName: Joi.string().required().min(2),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        location: Joi.object().required(),
        phone: Joi.string().required()
    });
    return schema.validate(data);
};

const userLoginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
};

module.exports.userRegisterValidator = userRegisterValidator;
module.exports.userLoginValidation = userLoginValidation;
