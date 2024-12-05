const express = require("express");
const _ = express.Router();
const registraionRoutes = require("./api/auth.apiRoutes");
const categoryApiRoutes = require("./api/category.apiRoutes.js");
const subcategoryApiRoutes = require("./api/subcategory.apiRoutes.js");
const productApiRoutes = require("./api/product.apiRoutes.js");
const bannerApiRoutes = require("./api/banner.apiRoutes.js");
const baseApi = process.env.BASE_API;
_.use(baseApi, registraionRoutes);
_.use(baseApi, categoryApiRoutes);
_.use(baseApi, subcategoryApiRoutes);
_.use(baseApi, productApiRoutes);
_.use(baseApi, bannerApiRoutes);
_.use("*", (req, res) => {
  return res.status(404).json({
    sucess: false,
    data: null,
    message: "Your Route is Invalid",
    error: true,
  });
});

module.exports = _;
