const express = require("express");
const _ = express.Router();
const {
  Registration,
  verifyOtp,
  login,
  logout,
} = require("../../Controller/auth.controller");
const { authGuard } = require("../../middeware/authguard.middle");
_.route("/auth/registration").post(Registration);
_.route("/auth/verify-otp").post(verifyOtp);
_.route("/auth/login").post(login);
_.route("/auth/logout").get(authGuard, logout);

module.exports = _;
