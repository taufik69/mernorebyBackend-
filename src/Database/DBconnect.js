const mongoose = require("mongoose");
const chalk = require("chalk");
const { dbName } = require("../constant/constant");
const dbConnect = async () => {
  try {
    const databaseInstance = await mongoose.connect(
      `${process.env.MONGODB_DATABASE_URL}/${dbName}`
    );
    console.log(
      chalk.bgYellowBright(
        "database Connection Sucessfull",
        databaseInstance.connection.host
      )
    );
  } catch (error) {
    console.log("Database Connection Error ", error);
  }
};

module.exports = { dbConnect };
