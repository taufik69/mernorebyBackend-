const jwt = require("jsonwebtoken");
const { apiError } = require("../Utils/ApiError");
const authGuard = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    var decoded = await jwt.verify(token, process.env.TOKEN_SECRET);

    if (decoded) {
      const user = {
        userId: decoded.id,
        useremail: decoded.email,
      };
      req.user = user;
      next();
    } else {
      return res
        .status(401)
        .json(new apiError(false, 401, null, "Token Invalid !!"));
    }
  } catch (error) {
    console.log("Error from authGuard Middleware", error);
  }
};
module.exports = { authGuard };
