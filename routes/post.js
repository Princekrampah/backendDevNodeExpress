const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const prisma = require("../model/prismaClient");

router.post("/", verifyToken, async (req, res) => {
  // console.log(req.user);

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

    res.status(201).json({ data: newPost });
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/", async (req, res) => {
  // difference path parameters and query parameters
  // https://rapidapi.com/blog/api-glossary/parameters/query/#:~:text=The%20first%20difference%20between%20query,used%20to%20sort%2Ffilter%20resources.
  // console.log(req.params);
  // console.log(req.query);

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

    res.status(200).json({ data: postsQuery });
  } catch (e) {
    console.log(e);
    res.status(500).send("Interval Server Error");
  }
});

// update post
router.put("/:id", verifyToken, async (req, res) => {
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

    // console.log(post.user.id, req.user.id)

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
        console.log(updatePost);
        return res.status(201).json({ data: updatePost });
      }
      return res.status(403).send("Not Authorized");
    }

    return res.status(404).send("Post Content Not Found");
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
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
        return res.status(204).send();
      }
      return res.status(403).send("Not Authorized");
    }

    return res.status(404).send("Post Content Not Found");
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
