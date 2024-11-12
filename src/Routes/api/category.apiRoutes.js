const express = require("express");
const _ = express.Router();
const {
  createCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
} = require("../../Controller/category.controller");
_.route("/category").post(createCategory).get(getAllCategory);
_.route("/category/:id").get(getSingleCategory).patch(updateCategory);
module.exports = _;
