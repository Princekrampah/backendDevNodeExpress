const Joi = require("@hapi/joi");

const registrationDataValidator = Joi.object({
  username: Joi.string().min(4).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5),
});

module.exports = registrationDataValidator;
