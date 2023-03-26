const express = require("express");

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Post = require("./models/posts");

const app = express();
const db = mongoose
  .connect("mongodb://127.0.0.1:27017/node-angular")
  .then(() => {
    console.log("Db Connected");
  })
  .catch(() => {
    console.log("Db connection failed");
  });
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,PUT,DELETE,OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
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

app.get("/api/posts", (req, res, next) => {
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

app.delete("/api/posts/:id", (req, res, next) => {
  //console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(201).json({
      message: "Post deleted successfully.",
    });
  });
});
module.exports = app;
