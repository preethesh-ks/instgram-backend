const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  full_name: { required: [true, "full name"], type: String },
  username: { required: false, type: String, lowercase: true },
  password: { required: true, type: String, minlength: 6 },
  email: { required: [true, "emaill"], type: String },
  profilePic: { type: String },
  bio: { type: String, maxlength: 130 },
  followers: Array,
  following: Array,
  private: {
    type: Boolean,
    default: false,
  },
  access_token: { type: String },
  refresh_token: { type: String },
});

module.exports = mongoose.model("user", userSchema);
