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

const { log } = require("console");
const { publicDecrypt } = require("crypto");
const loginRoute = require("./Routes/Login/login");
const registerRoute = require("./Routes/Register/register");
const UploadRoute = require("./Routes/Post/postImageUpload");
const PostRoute = require("./Routes/Post/post");
const HomeRoute = require("./Routes/Home/HomeData");
const CommentRoute = require("./Routes/Comments/comment");
const Post = require("./model/PostSchema");
const LikesRoute = require("./Routes/Likes/Likes");

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

app.listen(process.env.API_PORT, function () {
  console.log(`server started on port ${process.env.API_PORT}`);
});
