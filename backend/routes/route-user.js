const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((v) => {
    //console.log("hash===", v);
    const user = new User({
      email: req.body.email,
      password: v,
    });
    //console.log("user1===", user);
    user
      .save()
      .then((result) => {
        //console.log("user2===", result);
        res.status(201).json({
          message: "User created successfully.",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let loginUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          error: {
            message: "USER_NOT_EXIST",
          },
        });
      }
      loginUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          error: {
            message: "PASSWORD_MISMATCH",
          },
        });
      }
      const token = jwt.sign(
        {
          email: loginUser.email,
          userId: loginUser._id,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
      return res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: loginUser._id,
      });
    })
    .catch((error) => {
      return res.status(401).json({
        error: {
          message: "AUTH_FAILED",
        },
      });
    });
});

module.exports = router;
