const express = require("express");
const app = express();
const AllRoutes = require("./Routes/index");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// using middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public/temp"));
app.use(AllRoutes);

module.exports = { app };
