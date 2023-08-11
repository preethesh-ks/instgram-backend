const express = require("express");
const router = express.Router();
const User = require("../../model/user")
const Post = require("../../model/PostSchema");

const fs = require("fs"); 
router.post("/post", async(req, res) => {     
  
 const { userId, path, caption } = req.body;
  try {
    // Check if the userId exists in the User collection
    //const { userId, path, caption } = req.body;
    //console.log("s");

    if (!userId || !path || !caption) {
      return res.status(400).json({ msg: "Please enter all fields" });
    } else {
      const user = await User.findById(userId);
      console.log(user);
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
    
  // fs.unlink(path, (err) => {
  //   if (err) {
  //     console.error("Error deleting file:", err);
  //   }
  // });
  return 


}
});

module.exports = router;
