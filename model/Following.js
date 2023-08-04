const mongoose = require('mongoose')
const imageSchema =  new mongoose.Schema({
name:String,
image :String,
})
const Image = mongoose.model("image", imageSchema);
module.exports = Image;