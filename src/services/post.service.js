const prisma = require("../model/prismaClient");

const createPost = async (req) => {
  // console.log(req.user);
  // add data validation to this section

  try {
    const newPost = await prisma.post.create({
      data: {
        title: req.body.title,
        content: req.body.content,
        userId: req.user.id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        createdAt: true,
        comments: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return newPost;
  } catch (e) {
    console.log(e);
    return 500;
  }
};

const retrievePosts = async (req) => {
  let takeParam;
  let skipParam;

  try {
    // try block helps handle non int values during parsing
    req.query.take
      ? (takeParam = Number.parseInt(req.query.take))
      : (takeParam = 10);
    req.query.skip
      ? (skipParam = Number.parseInt(req.query.skip))
      : (skipParam = 0);

    console.log(takeParam);

    const postsQuery = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        createdAt: true,
        comments: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      take: takeParam,
      skip: skipParam,
    });

    return postsQuery;
  } catch (e) {
    console.log(e);
    return 500;
  }
};

const updatePost = async (req) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: req.params.id,
      },
      select: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    if (post) {
      if (post.user.id === req.user.id) {
        const updatePost = await prisma.post.update({
          where: {
            id: req.params.id,
          },
          data: {
            title: req.body.title,
            content: req.body.content,
          },
          select: {
            id: true,
            title: true,
            content: true,
            published: true,
            createdAt: true,
            comments: true,
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        });
        return updatePost;
      }
      return 403;
    }

    return 404;
  } catch (e) {
    console.log(e);
    return 500;
  }
};

const deletePost = async (req) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: req.params.id,
      },
      select: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    if (post) {
      if (post.user.id === req.user.id) {
        await prisma.post.delete({
          where: {
            id: req.params.id,
          },
        });
        return 204;
      }
      return 403;
    }

    return 404;
  } catch (e) {
    console.log(e);
    return 500;
  }
};
module.exports = {
  createPost,
  retrievePosts,
  updatePost,
  deletePost,
};
