const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const tokenVerify = req.headers.authorization.split(" ")[1];
    const tokenDecoded = jwt.verify(tokenVerify, process.env.JWT_SECRET_KEY);
    req.userData = { email: tokenDecoded.email, userId: tokenDecoded.userId };
    next();
  } catch (error) {
    res.status(401).json({
      message: "AUTH_FAILED",
    });
  }
};
