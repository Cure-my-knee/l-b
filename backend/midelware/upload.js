const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let path = "upload";
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    cb(null, path);
  },
  filename: (req, file, cb) => {
    // console.log("file", file);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
var upload = multer({ storage: storage });
module.exports = upload;
