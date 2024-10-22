require("dotenv").config();
const chalk = require("chalk");
const { dbConnect } = require("./Database/DBconnect.js");
const { app } = require("./app.js");
dbConnect()
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log(
        chalk.bgGreenBright.underline(
          `Server Running on Port ${process.env.PORT}`
        )
      );
    });
  })
  .catch((err) => {
    console.log(chalk.bgRedBright("index.js Connection Error", err));
  });
