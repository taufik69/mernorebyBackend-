const express = require("express");
const _ = express.Router();
const {
  createProduct,
  getAllproducts,
} = require("../../Controller/product.controller");
const { upload } = require("../../middeware/multer.middleware");
_.route("/product")
  .post(upload.fields([{ name: "image", maxCount: 10 }]), createProduct)
  .get(getAllproducts);

module.exports = _;
