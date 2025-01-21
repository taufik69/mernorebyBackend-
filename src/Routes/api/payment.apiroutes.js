const express = require("express");
const _ = express.Router();
const {
  sucessPayment,
  failPayment,
  canclePayment,
} = require("../../Controller/payment.controller");
_.route("/success/:id").post(sucessPayment);

_.route("/fail/:id").post(failPayment);
_.route("/cancel/:id").post(canclePayment);
_.route("/ipn/:id").post((req, res) => {
  res.send("Payment ipn");
});
module.exports = _;
