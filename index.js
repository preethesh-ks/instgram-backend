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
const Post = require("./model/PostSchema");
const db = require("./config/database"); //db conneection data

const fs = require("fs"); 
const User = require("./model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("./middleware/auth");
const Image = require("./model/Following");
const { log } = require("console");
const { publicDecrypt } = require("crypto");
const loginRoute = require("./Routes/Login/login");
const registerRoute = require("./Routes/Register/register");
const UploadRoute = require("./Routes/Post/postImageUpload");
app.use('/api',loginRoute);
app.use('/api',registerRoute);
app.use('/api',UploadRoute);
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/Images/");
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       file.fieldname + "_" + Date.now() + path.extname(file.originalname)
//     );
//   },
  
// });
// const upload = multer({storage}
// );

// app.post("/upload", upload.single('file') ,async (req, res) => {

  
  

//   console.log(req.file);
  
//   // console.log(req)
//    res.send(200,req.file);
// // const files = req.files;

// // const imagePromises = files.map(async (file) => {
// //   console.log(file);
// //   const image = await Image.create({ image: file.filename });
// //   return image;
// // });
// //   try {
// //     //const res = await Image.create({ image: req.file.filename });
// //   } catch (err) {
// //     console.log(err.message);
// //   }
//  });
// app.post("/upload", upload.array("file"), async (req, res) => {
  
// });

app.get("/getimage", async (req, res) => {
  try {
    const response = await Image.find();
    // console.log(response);
    res.json(response);
  } catch (err) {
    console.log(err), "failed to get image";
    res.json(err);
  }
});

app.post("/post", async (req, res) => {
  try {
    // Check if the userId exists in the User collection
    const { userId, path, caption } = req.body;
    console.log("s");

    if (!userId || !path || !caption) {
      return res.status(400).json({ msg: "Please enter all fields" });
    } else {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Create a new post and save it to the database
      const newPost = new Post({ userId, path, caption });
      await newPost.save();

      res.status(201).json(newPost);
    }
  } catch (error) {
    res.status(500).json({ error: "Error creating post" });
  }
}); 

app.post("/welcome", (req, res) => {
  const files = req.files;
    console.log(req);
  res.status(200).send("Welcome 🙌 ");
});
app.post("/welcome", auth, (req, res) => {

  res.status(200).send("Welcome 🙌 ");
});

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(process.env.API_PORT, function () {
  console.log(`server started on port ${process.env.API_PORT}`);
});
