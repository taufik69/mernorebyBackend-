const express = require("express");
const _ = express.Router();
const {
  createBestSelling,
  getAllBestSellingProduct,
} = require("../../Controller/bestSelling.controller");
_.route("/bestSelling").post(createBestSelling).get(getAllBestSellingProduct);
// _.route("/flashSale/:id").put(updatFlashsale);
module.exports = _;
