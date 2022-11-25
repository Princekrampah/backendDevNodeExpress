const jwt = require("jsonwebtoken");

const verifyTokenMiddleware = async (req, res, next) => {
  const token = req.header("access-token");
  if (!token) return res.status(401).send("Acess denied");

  try {
    const isVerified = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(isVerified.token)
    req.user = isVerified;
    // call next to go to the next middleware
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};

module.exports = verifyTokenMiddleware;
