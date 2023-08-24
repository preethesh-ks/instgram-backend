const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
require("dotenv").config();
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = require("./config/database"); //db conneection data
const User = require("./model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("./middleware/auth");

// const { log } = require("console");
const { publicDecrypt } = require("crypto");
const loginRoute = require("./Routes/Login/login");
const registerRoute = require("./Routes/Register/register");
const UploadRoute = require("./Routes/Post/postImageUpload");
const PostRoute = require("./Routes/Post/post");
const HomeRoute = require("./Routes/Home/HomeData");
const CommentRoute = require("./Routes/Comments/comment");
const Post = require("./model/PostSchema");
const LikesRoute = require("./Routes/Likes/Likes");
const { access } = require("fs");

app.use("/api", loginRoute);
app.use("/api", registerRoute);
// app.use('/api',UploadRoute);
app.use("/api", PostRoute);
app.use("/api", HomeRoute);
app.use("/api", LikesRoute);
app.use("/api", CommentRoute);
// app.post("/welcome", (req, res) => {
//   const files = req.files;
//     console.log(req);
//   res.status(200).send("Welcome 🙌 ");
// });
app.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

app.get("/", (req, res) => {
  res.send("hello");
});

app.post("api/auth",auth,(req,res)=>{
  res.status(200).send("jj")
})

app.post("/refresh", async (req, res) => {
  const refreshToken = req.body.rtoken;

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);

    // Generate a new access token
    const accessToken = jwt.sign(
      { user_id: decoded.user_id, email: decoded.email },
      process.env.TOKEN_KEY,
      { expiresIn: "2h" }
    );

    // Generate a new refresh token
    const newRefreshToken = jwt.sign(
      { user_id: decoded.user_id, email: decoded.email },
      process.env.REFRESH_TOKEN_KEY,
      { expiresIn: "7d" }
    );

    res
      .status(200)
      .json({ token: accessToken, refresh_token: newRefreshToken });
  } catch (err) {
   

    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Refresh token has expired" });
    } else if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid refresh token" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});
  


app.listen(process.env.API_PORT, function () {
  console.log(`server started on port ${process.env.API_PORT}`);
});
