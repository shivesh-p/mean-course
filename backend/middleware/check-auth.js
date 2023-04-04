const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const tokenVerify = req.headers.authorization.split(" ")[1];
    jwt.verify(tokenVerify, "THIS_IS_A_SECRET_KEY_LONG");
    next();
  } catch (error) {
    res.status(401).json({
      message: "AUTH_FAILED",
    });
  }
};
