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
const Post = require("./model/PostSchema");

app.use('/api',loginRoute);
app.use('/api',registerRoute);
// app.use('/api',UploadRoute);
app.use('/api',PostRoute);



app.get("/getimage", async (req, res) => {
  try {
    //  const userdetails = await db.collection('users')
    // const response = await db.collection('posts');

 const pipeline = [
   {
     $lookup: {
       from: "users",
       localField: "userId",
       foreignField: "_id",
       as: "userDetails",
     },
   },
   {
     $unwind: "$userDetails",
   },
    {
  $addFields: {
   "username": "$userDetails.full_name",
   "profilepic": "$userDetails.profilePic",
   "email": "$userDetails.email",
  }
 },
   {
     $project: {
       _id: 1,
       title: 1,
       content: 1,
       "username": 1,
       "profilepic": 1,
       "path": 1,
       "caption": 1,
       "likes": 1,
       "comments": 1,
       "createdAt": 1,
       "email": 1,
      

       
     },
   },
 ];
    const result = await Post.aggregate(pipeline);
    // console.log(response);
    res.json(result)
  } catch (err) {
    console.log(err), "failed to get image";
    res.json(err);
  }
});


      



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
