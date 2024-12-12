const express = require("express");
const _ = express.Router();
const {
  createFlashSale,
  getAllFlashSaleProduct,
  updatFlashsale,
} = require("../../Controller/flashSale.controller");
_.route("/flashsale").post(createFlashSale).get(getAllFlashSaleProduct);
_.route("/flashSale/:id").put(updatFlashsale);
module.exports = _;
