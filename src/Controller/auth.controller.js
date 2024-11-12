const { apiResponse } = require("../Utils/ApiResponse.js");
const { apiError } = require("../Utils/ApiError.js");
const {
  mailChecker,
  passwordChecker,
  bdNumberchecker,
} = require("../Helpers/validator");
const userModel = require("../Model/user.model");

const { makeHashPassword, comparePaword } = require("../Helpers/brycpt.js");
const { numberGenerator } = require("../Helpers/numberGenerator.js");
const { sendMail } = require("../Helpers/nodemailer.js");
const { makeJWTToken } = require("../Helpers/JwtToken.js");
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

    const isSendMail = await sendMail(email, otp);
    if (!isSendMail?.response) {
      return res
        .status(501)
        .json(
          new apiError(false, null, "Mail Does Not Send internal Server error")
        );
    }
    // now save the data to database
    const saveUserData = await new userModel({
      firstName,
      email,
      mobile,
      adress1,
      password: hashpassword,
      Otp: otp,
    }).save();

    // setTimeout(() => {
    //   saveUserData.Otp = null;
    //   saveUserData.save();
    //   console.log("opt removed");
    // }, 10000 * 10);
    return res
      .status(200)
      .json(new apiResponse(true, saveUserData, "Registratin Sucessfull"));
  } catch (error) {
    return res.status(501).json(new apiError(false, null, error));
  }
};

// verify otp
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, "Otp Credential Missing !!"));
    }
    const isExistUser = await userModel
      .findOne({
        $and: [{ email: email }, { Otp: otp }],
      })
      .select("-password -email");

    if (!isExistUser) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, "User not found!"));
    }
    isExistUser.isVerified = true;
    isExistUser.Otp = null;
    isExistUser.save();

    //
    return res
      .status(200)
      .json(new apiResponse(true, isExistUser, "Otp Verified Sucessfull"));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(false, null, `From verify controller Error :  ${error}`)
      );
  }
};

// make login controller
const login = async (req, res) => {
  try {
    const { emailorphone, password } = req.body;
    if (!emailorphone || !password) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, "Login Credential Missing !!"));
    }

    // check the info in database
    const loggedUser = await userModel.findOne({
      $or: [{ mobile: emailorphone }, { email: emailorphone }],
    });
    // decrypt the password
    const isCorrectPassword = await comparePaword(
      password,
      loggedUser?.password
    );

    if (!isCorrectPassword) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, "Login Credential invalid !!"));
    }
    const tokenPayload = {
      id: loggedUser._id,
      email: loggedUser.email,
    };
    const token = await makeJWTToken(tokenPayload);

    if (token) {
      return res
        .status(200)
        .cookie("token", token, { httpOnly: true, secure: true })
        .json(
          new apiResponse(
            true,
            {
              token: `Bearer ${token}`,
              userName: loggedUser.email,
              userId: loggedUser._id,
            },
            "Login Sucessfull"
          )
        );
    }
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(false, null, `From login controller Error :  ${error}`)
      );
  }
};

// make a logout controller
const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .clearCookie("token")
      .json(new apiResponse(true, null, "Logout Sucessfull"));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(false, null, `From logout controller Error :  ${error}`)
      );
  }
};

// reset password controller
const resetpassword = async (req, res) => {
  try {
    // const { emailorPhone, newspassword, oldPassword } = req.body;
    for (let key in req.body) {
      if (!req.body[key]) {
        return res
          .status(401)
          .json(new apiError(false, 401, null, `${key}  Missing !!`));
      }
    }

    if (!passwordChecker(req.body.newspassword)) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, `New Password Format invalid !!`));
    }

    // seach email or phone number in database
    const CheckUser = await userModel.findOne({
      $or: [
        { mobile: req.body.emailorPhone },
        { email: req.body.emailorPhone },
      ],
    });
    // check old password
    const passwordIsValid = comparePaword(
      req.body.oldPassword,
      CheckUser?.password
    );
    if (!CheckUser || !passwordIsValid) {
      return res
        .status(401)
        .json(
          new apiError(
            false,
            401,
            null,
            ` invalid Email or phone number or password !!`
          )
        );
    }

    // now  hash the new password
    const hashNewPassword = await makeHashPassword(req.body.newspassword);
    if (hashNewPassword) {
      CheckUser.password = hashNewPassword;
      await CheckUser.save();
      return res.status(200).json(
        new apiResponse(
          true,
          {
            data: {
              name: CheckUser.firstName,
              email: CheckUser.email,
            },
          },
          "Reset Password Sucessfull"
        )
      );
    }
    return res
      .status(401)
      .json(
        new apiError(
          false,
          401,
          null,
          `User Not Found Email or phone number is or invalid !!`
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          null,
          `From resetpassword controller Error :  ${error}`
        )
      );
  }
};

// set a recovery mail
const setRecoveryEmail = async (req, res) => {
  try {
    const { userId } = req.user;
    const { recoveryEmail } = req.body;
    if (!recoveryEmail || !mailChecker(recoveryEmail)) {
      return res
        .status(401)
        .json(
          new apiError(false, 401, null, "Recovery Email Missing or invalid !!")
        );
    }
    // const recovery = await userModel.findOneAndUpdate(
    //   { _id: userId },
    //   { $set: { recoveryEmail: recoveryEmail } },
    //   { new: true }
    // );
    const recovery = await userModel
      .findOneAndUpdate({ _id: userId })
      .select("-password -adress1 -mobile -role -Otp");
    if (recovery.recoveryEmail === recoveryEmail) {
      return res
        .status(401)
        .json(
          new apiError(false, 401, null, "Already Recovery Email is Exist")
        );
    }

    if (recovery) {
      recovery.recoveryEmail = recoveryEmail;
      await recovery.save();
      return res
        .status(200)
        .json(new apiResponse(true, recovery, "recovery Eamil set Sucessfull"));
    }
    return res
      .status(501)
      .json(new apiError(false, 501, null, " Server error user not found !!"));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          null,
          `From setRecoveryEmail controller Error :  ${error}`
        )
      );
  }
};
module.exports = {
  Registration,
  verifyOtp,
  login,
  logout,
  resetpassword,
  setRecoveryEmail,
};
