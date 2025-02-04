const jwt = require("jsonwebtoken");
const { apiError } = require("../Utils/ApiError");
const authGuard = async (req, res, next) => {
  try {
    if (req.cookies.token) {
      const decoded = await jwt.verify(
        req.cookies.token,
        process.env.TOKEN_SECRET
      );
      if (decoded) {
        const user = {
          userId: decoded.id,
          useremail: decoded.email,
        };
        req.user = { ...user, token: req.cookies.token };
        next();
      }
    }

    if (req.headers.authorization) {
      const decoded = await jwt.verify(
        req.headers.authorization.replace("Bearer", "").trim(),
        process.env.TOKEN_SECRET
      );

      if (decoded) {
        const user = {
          userId: decoded.id,
          useremail: decoded.email,
        };
        req.user = {
          ...user,
          token: req.headers.authorization.replace("Bearer", "").trim(),
        };
        next();
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "token expire",
    });
  }
};
module.exports = { authGuard };
