const express = require("express");
const _ = express.Router();
const {
  Registration,
  verifyOtp,
  login,
} = require("../../Controller/auth.controller");
_.route("/auth/registration").post(Registration);
_.route("/auth/verify-otp").post(verifyOtp);
_.route("/auth/login").post(login);

module.exports = _;
