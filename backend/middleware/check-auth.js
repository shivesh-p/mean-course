const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const tokenVerify = req.headers.authorization.split(" ")[1];
    const tokenDecoded = jwt.verify(tokenVerify, "THIS_IS_A_SECRET_KEY_LONG");
    req.userData = { email: tokenDecoded.email, userId: tokenDecoded.userId };
    next();
  } catch (error) {
    res.status(401).json({
      message: "AUTH_FAILED",
    });
  }
};
