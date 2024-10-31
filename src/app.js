const express = require("express");
const app = express();
const AllRoutes = require("./Routes/index");
const cookieParser = require("cookie-parser");

// using middleware
app.use(cookieParser());
app.use(express.json());
app.use(AllRoutes);

module.exports = { app };
