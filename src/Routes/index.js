const express = require("express");
const _ = express.Router();
const registraionRoutes = require("./api/auth.apiRoutes");
const categoryApiRoutes = require("./api/category.apiRoutes.js");
const subcategoryApiRoutes = require("./api/subcategory.apiRoutes.js");
const productApiRoutes = require("./api/product.apiRoutes.js");
const bannerApiRoutes = require("./api/banner.apiRoutes.js");
const flashSaleApiRouts = require("./api/flashSale.apiRoutes.js");
const bestSellingApiRouts = require("./api/bestSelling.apiRoutes.js");
const contactApiRoutes = require("./api/contact.apiRoutes.js");
const cartapiRoutes = require("./api/cart.api.js");
const orderapiRoutes = require("./api/order.apiRoutes.js");
const paymentRoutes = require("./api/payment.apiroutes.js");
const baseApi = process.env.BASE_API;
_.use(baseApi, registraionRoutes);
_.use(baseApi, categoryApiRoutes);
_.use(baseApi, subcategoryApiRoutes);
_.use(baseApi, productApiRoutes);
_.use(baseApi, bannerApiRoutes);
_.use(baseApi, flashSaleApiRouts);
_.use(baseApi, bestSellingApiRouts);
_.use(baseApi, contactApiRoutes);
_.use(baseApi, cartapiRoutes);
_.use(baseApi, orderapiRoutes);
_.use(baseApi, paymentRoutes);
_.use("*", (req, res) => {
  return res.status(404).json({
    sucess: false,
    data: null,
    message: "Your Route is Invalid",
    error: true,
  });
});

module.exports = _;
