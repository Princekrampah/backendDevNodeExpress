const Joi = require("@hapi/joi");

const createPostValidator = Joi.object({
  content: Joi.string().required(),
  title: Joi.string().required(),
});

module.exports = createPostValidator;
