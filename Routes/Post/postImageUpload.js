const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/Images/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
});
router.post("/upload", upload.single("file"), async (req, res) => {
  //logic
  
    //console.log(req.file);
 try {
     res.status(200).json(req.file.path);
 }catch(error){
    console.log(error);
    res.status(error.message);
 }


});

module.exports = router;
