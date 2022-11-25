const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const prisma = require("../model/prismaClient");

router.post("/:postId", verifyToken, async (req, res) => {
  try {
    // find if the post exits
    const post = await prisma.post.findUnique({
      where: {
        id: req.params.postId,
      },
    });

    // find if the post has already been liked by this user
    const likedPost = await prisma.like.findUnique({
      where: {
        user_id_post_id: { user_id: req.user.id, post_id: post.id },
      },
    });

    if (likedPost) {
      return res.status(403).send("User already liked post");
    }

    if (post) {
      const like = await prisma.like.create({
        data: {
          user_id: req.user.id,
          post_id: req.params.postId,
        },
      });

      return res.status(201).send();
    }

    return res.status(404).send("Post Not Found");
  } catch (e) {
    console.log(e);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
