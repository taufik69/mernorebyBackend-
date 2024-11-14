const express = require("express");
const _ = express.Router();
const {
  createSubCategory,
  getAllSubCategory,
  getSingleSubCategory,
  deleteSubCategory,
  updateSubCategory,
} = require("../../Controller/subCategory.controller");
_.route("/subcategory").post(createSubCategory).get(getAllSubCategory);
_.route("/subcategory/:id")
  .get(getSingleSubCategory)
  .delete(deleteSubCategory)
  .patch(updateSubCategory);
module.exports = _;
