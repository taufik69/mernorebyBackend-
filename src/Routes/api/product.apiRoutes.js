const express = require("express");
const _ = express.Router();
const {
  createProduct,
  getAllproducts,
  updateProduct,
} = require("../../Controller/product.controller");
const { upload } = require("../../middeware/multer.middleware");
_.route("/product")
  .post(upload.fields([{ name: "image", maxCount: 10 }]), createProduct)
  .get(getAllproducts);

_.route("/product/:productid").put(
  upload.fields([{ name: "image", maxCount: 10 }]),
  updateProduct
);

module.exports = _;
