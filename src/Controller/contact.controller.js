const { apiResponse } = require("../Utils/ApiResponse.js");
const { apiError } = require("../Utils/ApiError.js");
const contactModel = require("../Model/contact.model.js");

const createContact = async (req, res) => {
  try {
    const { name, email, message, phone } = req.body;
    if (!name || !email || !message || !phone) {
      return res
        .status(401)
        .json(
          new apiError(
            false,
            401,
            null,
            "name, email, message or phone Missing!"
          )
        );
    }

    // now save the contact information into datbase
    const saveContactData = new contactModel({
      name: name,
      email: email,
      message: message,
      phone: phone,
    }).save();
    if (!saveContactData) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, "Faild to Upload Try Again!"));
    }
    return res
      .status(200)
      .json(
        new apiResponse(
          true,
          saveContactData,
          "Contact Upload Sucessfull",
          false
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(false, null, `from cratecontact controller  :  ${error}`)
      );
  }
};

// get all comment
const getallContact = async (req, res) => {
  try {
    const allContact = await contactModel.find();
    if (!allContact) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, "Faild to get Contact!"));
    }
    return res
      .status(200)
      .json(new apiResponse(true, allContact, "Contact get Sucessfull", false));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(false, null, `from getallContact controller  :  ${error}`)
      );
  }
};

module.exports = { createContact, getallContact };
