const express = require("express");
const router = express.Router();
const Post = require("../models/posts");

router.post("", (req, res, next) => {
  //const post = req.body;

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save().then((v) => {
    res.status(201).json({
      message: "Post added successfully.",
      postId: v._id,
    });
  });
  console.log(post);
});

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
router.put("/:id", (req, res, next) => {
  //console.log(req.params.id);
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
  });
  Post.updateOne({ _id: req.params.id }, post).then((result) => {
    console.log(result);
    res.status(201).json({
      message: "Post edited successfully.",
    });
  });
});

module.exports = router;
