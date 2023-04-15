const express = require("express");

const Post = require("../models/posts");

const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const multer = require("../middleware/multer-mw");

router.post("", checkAuth, multer, (req, res, next) => {
  //const post = req.body;
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    createdBy: req.userData.userId,
  });
  post
    .save()
    .then((addedPost) => {
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
    })
    .catch((err) => {
      res.status(500).json({
        error: {
          message: "Couldn't create a Post!",
        },
      });
    });
  console.log(post);
});

router.get("/:id", checkAuth, (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
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
    })
    .catch((err) => {
      res.status(500).json({
        error: {
          message: "Couldn't get a Post!",
        },
      });
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
    .catch((err) => {
      res.status(500).json({
        error: {
          message: "Couldn't get Posts!",
        },
      });
    });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  //console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id, createdBy: req.userData.userId })
    .then((result) => {
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
    })
    .catch((err) => {
      res.status(500).json({
        error: {
          message: "Couldn't delete a Post!",
        },
      });
    });
});

router.put("/:id", checkAuth, multer, (req, res, next) => {
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
    if (result.matchedCount > 0) {
      res.status(201).json({
        message: "EDIT_SUCCESS",
        post: post,
      });
    } else {
      res.status(401).json({
        error: {
          message: "NOT_AUTHORIZED",
        },
      });
    }
  });
});

module.exports = router;
