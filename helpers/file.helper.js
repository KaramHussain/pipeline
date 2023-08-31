var multer = require("multer");
const path=require("path");
const fs=require("fs");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync("./public/uploads", { recursive: true });
    return cb(null, `./public/uploads`);
  },
  filename: function (req, file, callback) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    callback(null, uniqueSuffix + path.extname(file.originalname));
  },
});

var upload = multer({
  storage: storage,
});

module.exports = upload;
