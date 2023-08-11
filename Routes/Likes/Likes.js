const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../../model/PostSchema")

router.post("/:postId", async (req, res) => {

try {
  const postId = req.params.postId;
  console.log(postId);
  const userId = req.body.userId;
  console.log(userId);

  const post = await Post.findById(postId);
  //console.log(post);
  if (!post) {
    return res.status(404).json({
      message: "post not found",
    });
  } else if (!userId) {
    console.log("userid not rev");
    res.send(404, { message: "user not logged in" });
  } else {
    const userlike = post.likes.findIndex((like) => like.userId.equals(userId));
    console.log(userlike);
    if (userlike !== -1) {
      post.likes.splice(userlike, 1);
      await post.save();
      res.json(200,"Unliked Succes");
    } else {
      post.likes.push({ userId, postId });
      await post.save();
      res.json(200,"Liked Succes");
    }
  }
} catch (err) {
  console.log(err);
  res.json(err,"post not found",404);
}
})









module.exports = router;