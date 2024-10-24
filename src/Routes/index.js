const express = require("express");
const _ = express.Router();
const registraionRoutes = require("./api/auth.apiRoutes");
const baseApi = process.env.BASE_API;
_.use(baseApi, registraionRoutes);
_.use("*", (req, res) => {
  return res.status(404).json({
    sucess: false,
    data: null,
    message: "Your Route is Invalid",
    error: true,
  });
});

module.exports = _;
