const router = require("express").Router();
const userController = require("../controllers/user.controller");

// user registration
router.post("/register", userController.post);

// login functionality
router.post("/login", userController.loginUser);

// export the router
module.exports = router;
