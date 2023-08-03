const mongoose = require('mongoose')
const imageSchema =  new mongoose.Schema({
name:String,
image :String,
})
const image = mongoose.model("image", imageSchema);
module.exports = image;