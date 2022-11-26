const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const prisma = require("../model/prismaClient");
const postController = require("../controllers/post.controller");

// post post content
router.post("/", verifyToken, postController.post);

// get post
router.get("/", postController.get);

// update post
router.put("/:id", verifyToken, postController.put);

// delete post
router.delete("/:id", verifyToken, postController.Delete);

module.exports = router;
