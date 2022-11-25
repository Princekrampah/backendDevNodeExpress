const express = require("express");

// import routers
authRouter = require("./routes/auth");
postRouter = require("./routes/post");
likeRouter = require("./routes/postLike");

app = express();

// app middlewares
app.use(express.json());

// set router middlewares
app.use("/user/auth", authRouter);
app.use("/post", postRouter);
app.use("/post/like", likeRouter);

app.listen(5000, () => console.log("Server listening"));
