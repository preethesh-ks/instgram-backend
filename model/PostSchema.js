const mongoose = require("mongoose");


const CommentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const PostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  image: {
    type: Array,
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
  likes: {
    type: Number,
    default: 0,
  },
  comments: {
    type: [CommentSchema],
    default: [],
  },
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;