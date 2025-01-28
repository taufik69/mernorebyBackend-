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
    const { firstName, email, mobile, password } = req.body;
    if (!firstName || !email || !mobile || !password) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, "User Credential Missing !!"));
    }
    // check if email or password format is right or wrong
    if (
      !mailChecker(email) ||
      !passwordChecker(password) ||
      !bdNumberchecker(mobile)
    ) {
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
    console.log(isSendMail);

    if (!isSendMail?.response) {
      return res
        .status(501)
        .json(
          new apiError(false, null, "Mail Does Not Send internal Server error")
        );
    }
    // now save the data to database
    const otpExpireTime = new Date().getTime() + 10 * 60 * 1000;
    const saveUserData = await new userModel({
      firstName,
      email,
      mobile,
      password: hashpassword,
      Otp: otp,
      otpExpire: otpExpireTime,
    }).save();

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
    const { email, Otp } = req.body;
    if (!email || !Otp) {
      return res
        .status(401)
        .json(new apiError(false, `Your email or Otp Missing!!`, 401, null));
    }

    const checkIsUserAlradyRegister = await userModel.findOne({ email: email });

    if (checkIsUserAlradyRegister) {
      if (
        checkIsUserAlradyRegister.Otp === parseInt(Otp) &&
        new Date().getTime() <= checkIsUserAlradyRegister.otpExpire
      ) {
        // remove otp and otpExpireTime removed from database
        checkIsUserAlradyRegister.Otp = null;
        checkIsUserAlradyRegister.otpExpire = null;
        checkIsUserAlradyRegister.isVerified = true;
        await checkIsUserAlradyRegister.save();

        return res
          .status(200)
          .json(new apiResponse(false, "User Verified Sucessfull", 200, null));
      } else {
        // remove otp and otpExpireTime removed from database
        checkIsUserAlradyRegister.Otp = null;
        checkIsUserAlradyRegister.otpExpire = null;
        await checkIsUserAlradyRegister.save();

        return res
          .status(401)
          .json(
            new apiResponse(false, "Otp Not Match or time expired ", 200, null)
          );
      }
    }
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          `Error from verifyOtp controller  ${error}`,
          501,
          null
        )
      );
  }
};

// resend otp
const resendOpt = async (req, res) => {
  try {
    const { email } = req.body;
    const isRegisterUser = await userModel.findOne({ email });
    if (!isRegisterUser) {
      return res
        .status(501)
        .json(new apiError(false, `Email Not Found `, 501, null));
    }

    // now save the data to database
    const otpExpireTime = new Date().getTime() + 10 * 60 * 1000;
    // generate new Otp
    const otp = await numberGenerator();
    // now send mail
    const sendemail = await sendMail(email, otp, "Resend Opt");
    if (sendemail) {
      isRegisterUser.Otp = otp;
      isRegisterUser.otpExpire = otpExpireTime;
      await isRegisterUser.save();
      return res
        .status(200)
        .json(
          new apiResponse(false, "Otp Resend Sucessfull Check email", 200, null)
        );
    }
    return res
      .status(501)
      .json(new apiError(false, `Otp Resend Failed !!`, 501, null));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          `Error from resendOpt controller  ${error}`,
          501,
          null
        )
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
  resendOpt,
};
