const express = require("express");
const _ = express.Router();
const { authGuard } = require("../../middeware/authguard.middle.js");
const {
  addToCart,
  getCartItemuser,
  incrementCartItem,
  decrementCartItem,
  userCart,
  deleteCartItem,
} = require("../../Controller/cart.controller.js");

_.route("/addtocart").post(authGuard, addToCart);
_.route("/getuseritem").get(authGuard, getCartItemuser);
_.route("/increment/:cartid").post(authGuard, incrementCartItem);
_.route("/decrement/:cartid").post(authGuard, decrementCartItem);
_.route("/useritem").get(authGuard, userCart);
_.route("/removecart").delete(authGuard, deleteCartItem);
module.exports = _;
