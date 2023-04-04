const express = require("express");
const path = require("path");
const postRoutes = require("./routes/route-posts");
const userRoutes = require("./routes/route-user");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

const db = mongoose
  .connect("mongodb://127.0.0.1:27017/node-angular")
  .then(() => {
    console.log("Db Connected.");
  })
  .catch(() => {
    console.log("Db connection failed.");
  });

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,PUT,DELETE,OPTIONS"
  );
  next();
});

app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
