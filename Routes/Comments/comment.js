const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../../model/PostSchema");


router.post("/add-comments", async (req, res) => {
const {userId,postId,username,comment} = req.body
try{
const post = await Post.findById(postId);
// console.log(post)
console.log(post.comments);
 if (!post) {
    return res.status(404).json({
      message: "post not found",
    });
  } else if (!userId) {
    console.log("userid not rev");
    res.send(404, { message: "user not logged in" });
  } else {
    try{
    post.comments.push({
        userId,postId,username,comment
    })
    console.log("hello")
     await post.save();
      return res.status(200).json({ message: "Comment added successfully" });
    }catch(error){
        console.log(error)
    }
    ;
    // await addcomment.save();
    // res.status(200)
    // console.log("Added")

  }


// console.log(req.body)
res.send("Working Bro !!!")}
catch(error){
    console.log(error)
}

});

module.exports = router;