const postQuery = require("../services/post.service");

const post = async (req, res, next) => {
  try {
    const response = await postQuery.createPost(req);

    // handle responses
    if (response === 404) {
      return res.status(404).send("Not Found");
    } else if (response === 500) {
      return res.status(500).send("Internal Server Error");
    } else if (response === 403) {
      return res.status(403).send("Not Authorized");
    } else {
      return res.status(201).json({ data: response });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const get = async (req, res, next) => {
  try {
    const response = await postQuery.retrievePosts(req);

    // handle responses
    if (response === 404) {
      return res.status(404).send("Not Found");
    } else if (response === 500) {
      return res.status(500).send("Internal Server Error");
    } else if (response === 403) {
      return res.status(403).send("Not Authorized");
    } else {
      return res.status(201).json({ data: response });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const put = async (req, res, next) => {
  try {
    const response = await postQuery.updatePost(req);

    // handle responses
    if (response === 404) {
      return res.status(404).send("Not Found");
    } else if (response === 500) {
      return res.status(500).send("Internal Server Error");
    } else if (response === 403) {
      return res.status(403).send("Not Authorized");
    } else {
      return res.status(201).json({ data: response });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const Delete = async (req, res, next) => {
  try {
    const response = await postQuery.deletePost(req);
    console.log(typeof response, response);

    // handle responses
    if (response === 404) {
      return res.status(404).send("Not Found");
    } else if (response === 500) {
      return res.status(500).send("Internal Server Error");
    } else if (response === 403) {
      return res.status(403).send("Not Authorized");
    } else {
      return res.status(204).send();
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  post,
  get,
  put,
  Delete,
};
