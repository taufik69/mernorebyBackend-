const { apiResponse } = require("../Utils/ApiResponse.js");
const { apiError } = require("../Utils/ApiError.js");
const { mailChecker, passwordChecker } = require("../Helpers/validator");
const userModel = require("../Model/user.model");

const { makeHashPassword } = require("../Helpers/brycpt.js");
const { numberGenerator } = require("../Helpers/numberGenerator.js");
const Registration = async (req, res) => {
  try {
    const { firstName, email, mobile, adress1, password } = req.body;
    if (!firstName || !email || !mobile || !adress1 || !password) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, "User Credential Missing !!"));
    }
    // check if email or password format is right or wrong
    if (!mailChecker(email) || !passwordChecker(password)) {
      return res
        .status(401)
        .json(
          new apiError(
            false,
            401,
            null,
            "User Eamil or password Format Invalid !!"
          )
        );
    }
    // now encrypt the password
    const hashpassword = await makeHashPassword(password);
    // make otp
    const otp = await numberGenerator();
    console.log("otp", otp.subString(0, 3));

    return;
    await sendMail();
    // now save the data to database
    const saveUserData = await new userModel({
      firstName,
      email,
      mobile,
      adress1,
      password: hashpassword,
    }).save();

    res
      .status(200)
      .json(new apiResponse(true, saveUserData, "Registratin Sucessfull"));
  } catch (error) {
    return res.status(501).json(new apiError(false, null, error));
  }
};

module.exports = { Registration };
