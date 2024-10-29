const bcrypt = require("bcrypt");
const makeHashPassword = async (plainPassword) => {
  try {
    return await bcrypt.hash(plainPassword, 10);
  } catch (error) {
    console.log("Failed make to hash Password");
  }
};

const comparePaword = async (plainPassword, hashpassword) => {
  try {
    return bcrypt.compare(plainPassword, hashpassword);
  } catch (error) {
    console.log("Failed  to compare Password");
  }
};

module.exports = { makeHashPassword, comparePaword };
