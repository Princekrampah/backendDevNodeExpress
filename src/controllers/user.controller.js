const postQuery = require("../services/user.service");

// data validation
const registrationDataValidator = require("../validators/userRegistrationValidator");
const loginDataValidator = require("../validators/userLoginValidator.js");

const post = async (req, res, next) => {
  // validate user data
  const dataValidation = registrationDataValidator.validate(req.body);
  // console.log(dataValidation)
  if (dataValidation.error)
    return res.status(400).send(dataValidation.error.details[0].message);

  try {
    const response = await postQuery.userRegistration(req);

    // handle responses
    if (response === 404) {
      return res.status(404).send("Not Found");
    } else if (response === 500) {
      return res.status(500).send("Internal Server Error");
    } else if (response === 403) {
      return res.status(403).send("Not Authorized");
    } else if (response === 400) {
      res
        .status(400)
        .send(
          "Username or Email already exists, please choose a different one"
        );
    } else {
      return res.status(201).json({ data: response });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  // validate user data
  const dataValidation = loginDataValidator.validate(req.body);
  // console.log(dataValidation)
  if (dataValidation.error)
    return res.status(400).send(dataValidation.error.details[0].message);

  try {
    const response = await postQuery.userLogin(req);

    // handle responses
    if (response === 404) {
      return res.status(404).send("Not Found");
    } else if (response === 500) {
      return res.status(500).send("Internal Server Error");
    } else if (response === 403) {
      return res.status(403).send("Not Authorized");
    } else if (response === 400) {
      res.status(400).send("Username Or Email Is Incorrect");
    } else {
      res
        .header("access-token", response.token)
        .status(response.status)
        .send(response.token);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  post,
  loginUser,
};
