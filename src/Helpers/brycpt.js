const bcrypt = require("bcrypt");
const makeHashPassword = async (plainPassword) => {
  try {
    return await bcrypt.hash(plainPassword, 10);
  } catch (error) {
    console.log("Failed make to hash Password");
  }
};

module.exports = { makeHashPassword };
