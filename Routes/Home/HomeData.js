const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../../model/PostSchema")

router.get('/home', async (req, res) => {
   
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
              username: "$userDetails.full_name",
              profilepic: "$userDetails.profilePic",
              email: "$userDetails.email",
            },
          },
          {
            $project: {
              _id: 1,
              title: 1,
              content: 1,
              username: 1,
              profilepic: 1,
              path: 1,
              caption: 1,
              likes: 1,
              comments: 1,
              createdAt: 1,
              email: 1,
            },
          },
        ];
        const result = await Post.aggregate(pipeline);
        // console.log(response);
        res.json(result);
      } catch (err) {
        console.log(err), "failed to get image";
        res.json(err);
      }
    
})

module.exports = router;