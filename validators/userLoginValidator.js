const Joi = require("@hapi/joi");

const loginDataValidator = Joi.object({
  username: Joi.string().min(4).required(),
  password: Joi.string().min(5),
});

module.exports = loginDataValidator;