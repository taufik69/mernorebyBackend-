const categoryModel = require("../Model/category.model");
const { apiResponse } = require("../Utils/ApiResponse.js");
const { apiError } = require("../Utils/ApiError.js");

/**
 * todo : make createCategory Controoler
 * @params({req,res})
 */

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, "Category Credential Missing !!"));
    }

    // check is upcoming category is alrady exist or not
    const isExistCategory = await categoryModel.find({ name: name });
    if (isExistCategory?.length) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, `${name} is Alrady Exist`));
    }
    // now save the data into database
    const saveCategory = await categoryModel.create({
      name,
      description,
    });
    if (saveCategory) {
      return res
        .status(200)
        .json(
          new apiResponse(true, saveCategory, "Category Created  Sucessfull")
        );
    }
    return res
      .status(501)
      .json(new apiError(false, 501, null, `${name} Category Created Failed`));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          null,
          `From createCategory controller Error :  ${error}`
        )
      );
  }
};

// get all category
const getAllCategory = async (req, res) => {
  try {
    const allCategory = await categoryModel.find({}).populate("subCategory");
    if (!allCategory?.length) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, `Category Not Found`));
    }
    return res
      .status(200)
      .json(
        new apiResponse(true, allCategory, "allCategory Fetch  Sucessfully")
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          null,
          `From getAllCategory controller Error :  ${error}`
        )
      );
  }
};

// get single catagory
const getSingleCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const singleCategory = await categoryModel.findById(id);
    if (!singleCategory) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, `Single Category Not Found`));
    }
    return res
      .status(200)
      .json(
        new apiResponse(true, singleCategory, "allCategory Fetch  Sucessfully")
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          null,
          `From getSingleCategory controller Error :  ${error}`
        )
      );
  }
};

// update category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = await categoryModel.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true }
    );
    if (updatedCategory) {
      return res
        .status(200)
        .json(
          new apiResponse(true, updatedCategory, "Category Update  Sucessfully")
        );
    }
    return res
      .status(501)
      .json(new apiError(false, null, `Category Update Failed`));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          null,
          `From updateCategory controller Error :  ${error}`
        )
      );
  }
};

module.exports = {
  createCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
};
