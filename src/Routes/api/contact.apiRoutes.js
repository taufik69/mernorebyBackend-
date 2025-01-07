const express = require("express");
const _ = express.Router();
const {
  getallContact,
  createContact,
} = require("../../Controller/contact.controller.js");
_.route("/contact").post(createContact);

module.exports = _;
