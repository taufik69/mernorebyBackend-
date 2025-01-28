const express = require("express");
const _ = express.Router();
const {
  Registration,
  verifyOtp,
  login,
  logout,
  resetpassword,
  setRecoveryEmail,
  resendOpt,
} = require("../../Controller/auth.controller");
const { authGuard } = require("../../middeware/authguard.middle");
_.route("/auth/registration").post(Registration);
_.route("/auth/verify-otp").post(verifyOtp);
_.route("/auth/login").post(login);
_.route("/auth/resendOpt").post(resendOpt);
_.route("/auth/logout").get(authGuard, logout);
_.route("/auth/reset-password").post(resetpassword);
_.route("/auth/recovery-email").post(authGuard, setRecoveryEmail);

module.exports = _;
