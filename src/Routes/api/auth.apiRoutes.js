const express = require("express");
const _ = express.Router();
const { Registration } = require("../../Controller/auth.controller");
_.route("/registraion").get(Registration);

module.exports = _;
