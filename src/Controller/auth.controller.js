const { apiResponse } = require("../Utils/ApiResponse.js");
const { apiError } = require("../Utils/ApiError.js");

const Registration = async (req, res) => {
  try {
    res.status(200).json(new apiResponse(true, "data is dat5a", "mern 2304"));
  } catch (error) {
    return res.status(501).json(new apiError(false, null, error));
  }
};

module.exports = { Registration };
