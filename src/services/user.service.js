const prisma = require("../model/prismaClient");

// bcrypt password hashing
const bcrypt = require("bcryptjs");

// jwt
const jwt = require("jsonwebtoken");

const userRegistration = async (req) => {
  // check if the email and user name exist
  const userEmail = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (userEmail) return 400;

  // check if the email and user name exist
  const username = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
  });
  if (username) return 400;

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
    // return created user 201
    return user;
  } catch (e) {
    console.log(e);
    return 500;
  }
};

const userLogin = async (req) => {
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
    if (!validation) return 400;
    // console.log(console.log(user));
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    return { status: 200, token: token };
  } else {
    return 400;
  }
};

module.exports = {
  userRegistration,
  userLogin,
};
