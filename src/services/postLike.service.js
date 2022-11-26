const prisma = require("../model/prismaClient");

const findUnique = async (req) => {
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

  return {
    post,
    likedPost,
  };
};

const createLike = async (req) => {
  const like = await prisma.like.create({
    data: {
      user_id: req.user.id,
      post_id: req.params.postId,
    },
  });

  return like;
};

module.exports = {
  findUnique,
  createLike,
};
