const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
require("dotenv").config();
const multer =require("multer");
const path = require("path");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json())
app.use(express.static('public'));
const Post = require("./model/PostSchema")
const db = require("./config/database"); //db conneection data
const User = require("./model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("./middleware/auth");
const image = require("./model/Following");
const { log } = require("console");
const { publicDecrypt } = require("crypto");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/Images/' )
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname)) 
    }
})
const upload =multer({
  storage: storage
})


app.post("/register", async (req, res) => {
  
  try {
    //get user input
    const { full_name, email, password } = req.body;
    console.log(req.body);
    //validate input
    if (!full_name || !email || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }
    //check if user already exists
    //validate user if already exist in db
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).json({ msg: "User already exists" });
    }
    //encrypt user password
    encryptPassword = await bcrypt.hash(password, 10);
    //create user in our database
    const user = await User.create({
      full_name,
      email: email.toLowerCase(),
      password: encryptPassword,
    });
    //create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    //save user token
    user.access_token = token;
    //refresh token
    const refresh_token = jwt.sign(
      { user_id: user._id, email },
      process.env.REFRESH_TOKEN_KEY,
      { expiresIn: "7d" } // Refresh token expires in 7 days
    );

    // Save the refresh token on the user object
    user.refresh_token = refresh_token;
    const responseUser = {
      id: user._id,
      full_name: user.full_name,
      email: user.email,
      access_token: user.access_token,
      refresh_token: user.refresh_token,
      followers: user.followers,
      following: user.following,
    };
    await user.save();
    //return new user
    res.status(201).json(responseUser);
  } catch (err) {
    console.log(err);
  }
});

app.post("/login",  async (req, res) => {
  try {
    const { email, password } = req.body;
     console.log(req.body);

    if (!(email && password)) {
      res.status(404).send("All input is required");
    }
    else{
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        { expiresIn: "2h" }
      );

      //save user token
      user.access_token = token;
      //refresh token
      const refresh_token = jwt.sign(
        { user_id: user._id, email },
        process.env.REFRESH_TOKEN_KEY,
        { expiresIn: "7d" } // Refresh token expires in 7 days
      );

      // Save the refresh token on the user object
      user.refresh_token = refresh_token;

      //user
      const responseUser = {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        access_token: user.access_token,
        refresh_token: user.refresh_token,
        followers: user.followers,
        following: user.following,
      };
      await user.save();
      res.status(200).json(responseUser);
    } else {
      res.status(401).send("Invalid credentials");
    }}
  }
   catch (err) {
    console.log(err);
  }
}
);

app.post('/upload',upload.array('file'),async (req, res) => {
console.log(req.file)
try{
const res = await image.create({ image: req.file.filename });
}catch(err){
  console.log(err.message);
}
})

app.get("/getimage",async (req, res) => {
 try {
   const response = await image.find();
  // console.log(response);
   res.json(response);

 }
 catch(err) {
  console.log(err),"failed to get image";
  res.json(err);
 }
})



app.post("/posts", async (req, res) => {
  

  try {
    // Check if the userId exists in the User collection
    const { userId, image_link, caption } = req.body;
    console.log("s");

    if (!userId ||!image_link ||!caption) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }
    else {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create a new post and save it to the database
    if()
    const newPost = new Post({ userId, image_link, caption });
    await newPost.save();

    res.status(201).json(newPost);}
  } catch (error) {
    res.status(500).json({ error: "Error creating post" });
  }
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
