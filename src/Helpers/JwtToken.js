const jwt = require("jsonwebtoken");

const makeJWTToken = async (userInfo = {}) => {
  try {
    const token = await jwt.sign(
      {
        ...userInfo,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.TOKEN_EXPRIRY_DATE }
    );
    return token;
  } catch (error) {
    console.log("Error From MakeJWTtoken", err);
  }
};

module.exports = { makeJWTToken };
