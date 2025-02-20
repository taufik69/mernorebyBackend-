const express = require("express");
const _ = express.Router();
const {
  createCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
} = require("../../Controller/category.controller");
_.route("/category").post(createCategory).get(getAllCategory);
_.route("/category/:id")
  .get(getSingleCategory)
  .put(updateCategory)
  .delete(deleteCategory);
module.exports = _;
