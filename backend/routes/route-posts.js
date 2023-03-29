const express = require("express");

const Post = require("../models/posts");
const multer = require("multer");

const router = express.Router();

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

router.post(
  "",
  multer({ storage: upload }).single("image"),
  (req, res, next) => {
    //const post = req.body;
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
    });
    post.save().then((addedPost) => {
      res.status(201).json({
        message: "Post added successfully.",
        post: {
          id: addedPost._id,
          title: addedPost.title,
          content: addedPost.content,
          imagePath: addedPost.imagePath,
        },
      });
    });
    console.log(post);
  }
);

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json({
        posts: post,
        message: "Posts fetched successfully.",
      });
    } else {
      res.status(404).json({
        message: "Posts not found.",
      });
    }
  });
});

router.get("", (req, res, next) => {
  //res.send("Hello world from express!");
  Post.find()
    .then((posts) => {
      res.status(200).json({
        posts: posts,
        message: "Posts fetched successfully.",
      });
    })
    .catch((v) => {
      console.log("Error Occurred!");
    });
});

router.delete("/:id", (req, res, next) => {
  //console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(201).json({
      message: "Post deleted successfully.",
    });
  });
});
router.put(
  "/:id",
  multer({ storage: upload }).single("image"),
  (req, res, next) => {
    //console.log(req.params.id);
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.params.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
    });
    Post.updateOne({ _id: req.params.id }, post).then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Post edited successfully.",
        post: post,
      });
    });
  }
);

module.exports = router;
