const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
router.post("/login", async (req, res) => {
  // Your logic for handling the POST request for user creation
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

module.exports = router;