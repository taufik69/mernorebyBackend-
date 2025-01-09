const express = require("express");
const _ = express.Router();
const { authGuard } = require("../../middeware/authguard.middle.js");
const {
  addToCart,
  getCartItemuser,
  incrementCartItem,
} = require("../../Controller/cart.controller.js");

_.route("/addtocart").post(authGuard, addToCart);
_.route("/getuseritem").get(authGuard, getCartItemuser);
_.route("/increment/:cartid").post(incrementCartItem);
module.exports = _;
