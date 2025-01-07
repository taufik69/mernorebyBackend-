const express = require("express");
const _ = express.Router();
const { authGuard } = require("../../middeware/authguard.middle.js");
const { addToCart } = require("../../Controller/cart.controller.js");

_.route("/addtocart").post(authGuard, addToCart);
module.exports = _;
