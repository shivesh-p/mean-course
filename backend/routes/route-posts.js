const express = require("express");

const Post = require("../models/posts");
const multer = require("multer");

const router = express.Router();
const checkAuth = require("../middleware/check-auth");

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
  checkAuth,
  multer({ storage: upload }).single("image"),
  (req, res, next) => {
    //const post = req.body;
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      createdBy: req.userData.userId,
    });
    post.save().then((addedPost) => {
      res.status(201).json({
        message: "CREATE_SUCCESS",
        post: {
          id: addedPost._id,
          title: addedPost.title,
          content: addedPost.content,
          imagePath: addedPost.imagePath,
          createdBy: addedPost.createdBy,
        },
      });
    });
    console.log(post);
  }
);

router.get("/:id", checkAuth, (req, res, next) => {
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
  debugger;
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let paginatedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  postQuery
    .then((posts) => {
      paginatedPosts = posts;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        posts: paginatedPosts,
        totalPosts: count,
        message: "Posts fetched successfully.",
      });
    })
    .catch((v) => {
      console.log("Error Occurred!");
    });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  //console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id, createdBy: req.userData.userId }).then(
    (result) => {
      console.log(result);
      if (result.deletedCount > 0) {
        res.status(201).json({
          message: "DELETE_SUCCESS",
        });
      } else {
        res.status(401).json({
          message: "NOT_AUTHORIZED",
        });
      }
    }
  );
});

router.put(
  "/:id",
  checkAuth,
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
      createdBy: req.userData.userId,
    });
    Post.updateOne(
      { _id: req.params.id, createdBy: req.userData.userId },
      post
    ).then((result) => {
      console.log(result);
      if (result.modifiedCount > 0) {
        res.status(201).json({
          message: "EDIT_SUCCESS",
          post: post,
        });
      } else {
        res.status(401).json({
          message: "NOT_AUTHORIZED",
        });
      }
    });
  }
);

module.exports = router;
