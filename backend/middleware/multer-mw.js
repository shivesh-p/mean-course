const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
};

const upload = multer.diskStorage({
  destination: (req, file, cb) => {
    let error = new Error("Invalid MIME Type");
    const isValid = MIME_TYPE_MAP[file.mimetype];
    if (isValid) {
      error = null;
    }

    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

module.exports = multer({ storage: upload }).single("image");
