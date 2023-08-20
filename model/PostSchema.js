const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId  },
      postId: { type: mongoose.Schema.Types.ObjectId },
      // You can include other fields like timestamp, etc.
    },
  ],
  comments: {
    type: [CommentSchema],
    default: [],
  },
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
