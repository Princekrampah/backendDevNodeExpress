const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const prisma = require("../model/prismaClient");
const postLikeController = require("../controllers/postLike.controller");

router.post("/:postId", verifyToken, postLikeController.post);

module.exports = router;
