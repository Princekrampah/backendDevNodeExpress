const router = require("express").Router();
const prisma = require("../model/prismaClient.js");

// bcrypt password hashing
const bcrypt = require("bcryptjs");

// jwt
const jwt = require("jsonwebtoken");

// data validation
const Joi = require("@hapi/joi");
const registrationDataValidator = require("../validators/userRegistrationValidator");
const loginDataValidator = require("../validators/userLoginValidator.js");

router.post("/register", async (req, res) => {
  // validate user data
  const dataValidation = registrationDataValidator.validate(req.body);
  // console.log(dataValidation)
  if (dataValidation.error)
    return res.status(400).send(dataValidation.error.details[0].message);

  // check if the email and user name exist
  const userEmail = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (userEmail)
    return res
      .status(400)
      .send("Email already exists, please choose a different one");

  // check if the email and user name exist
  const username = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
  });
  if (username)
    return res
      .status(400)
      .send("Username already exists, please choose a different one");

  //hash user password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  try {
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
    // create user profile
    const userProfile = await prisma.profile.create({
      data: {
        userId: user.id,
      },
    });
    // return created user
    res.status(201).send(user);
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
});

// login functionality
router.post("/login", async (req, res) => {
  // validate the login data
  const dataValidation = loginDataValidator.validate(req.body);
  if (dataValidation.error)
    return res.status(400).send(dataValidation.error.details[0].message);

  // check if username exists in DB
  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
    select: {
      id: true,
      username: true,
      password: true,
    },
  });
  if (user) {
    // check if password is valid
    const validation = await bcrypt.compare(req.body.password, user.password);
    if (!validation) return res.status(400).send("Invalid user password");
    // console.log(console.log(user));
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    return res.header("access-token", token).status(200).send(token);
  } else {
    return res.status(400).send("Email or password does not exist");
  }
});

// export the router
module.exports = router;
