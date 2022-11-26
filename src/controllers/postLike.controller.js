const postQuery = require("../services/postLike.service");

async function post(req, res, next) {
  try {
    const { post, likedPost } = await postQuery.findUnique(req);

    if (!post) {
      return res.status(404).send("Post Not Found");
    }

    if (likedPost) {
      return res.status(403).send("User already liked post");
    }

    await postQuery.createLike(req);
    return res.status(201).send();
  } catch (err) {
    console.log(err);
    next(err);
    // return res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  post,
};
