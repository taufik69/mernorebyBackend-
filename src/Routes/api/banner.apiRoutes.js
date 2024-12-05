const express = require("express");
const _ = express.Router();
const {
  createBanner,
  getAllBanner,
  updateBanner,
} = require("../../Controller/banner.controller");
const { upload } = require("../../middeware/multer.middleware");
_.route("/banner")
  .post(upload.fields([{ name: "image", maxCount: 1 }]), createBanner)
  .get(getAllBanner);

_.route("/banner/:id").put(
  upload.fields([{ name: "image", maxCount: 1 }]),
  updateBanner
);
module.exports = _;
