const express = require("express");

// import routers
authRouter = require("./src/routes/auth");
postRouter = require("./src/routes/post");
likeRouter = require("./src/routes/postLike");

app = express();

// app middlewares
app.use(express.json());

// set router middlewares
app.use("/user/auth", authRouter);
app.use("/post", postRouter);
app.use("/post/like", likeRouter);

app.listen(5000, () => console.log("Server listening"));
