const { apiResponse } = require("../Utils/ApiResponse.js");
const { apiError } = require("../Utils/ApiError.js");
const subCatoryModel = require("../Model/subcategory.model.js");
const subcategoryModel = require("../Model/subcategory.model.js");
const createSubCategory = async (req, res) => {
  try {
    for (let key in req.body) {
      if (!req.body[key]) {
        return res
          .status(401)
          .json(
            new apiError(
              false,
              401,
              null,
              `${key} subCategory Credential Missing !!`
            )
          );
      }
    }
    // now check the alrayd exist in subcategory
    const alreadyExistSubCategory = await subcategoryModel.find({
      name: req.body.name,
    });

    if (alreadyExistSubCategory?.length) {
      return res
        .status(401)
        .json(
          new apiError(
            false,
            401,
            null,
            `Already Exist ${req.body.name} subCategory !!`
          )
        );
    }

    // now save the subcategory into database
    const saveSubCategory = await subCatoryModel.create({ ...req.body });
    if (saveSubCategory) {
      return res
        .status(200)
        .json(
          new apiResponse(
            true,
            saveSubCategory,
            "saveSubCategory Created  Sucessfull"
          )
        );
    }
    return res
      .status(401)
      .json(
        new apiError(false, 401, null, `saveSubCategory Created  Failed !!`)
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          null,
          `From subCategory create  controller Error :  ${error}`
        )
      );
  }
};

// get all subCategory
const getAllSubCategory = async (req, res) => {
  try {
    const allSubCategory = await subcategoryModel.find().populate("category");
    if (allSubCategory?.length) {
      return res
        .status(200)
        .json(
          new apiResponse(
            true,
            allSubCategory,
            "saveSubCategory Created  Sucessfull"
          )
        );
    }
    return res
      .status(401)
      .json(new apiError(false, 401, null, `SubCategory Not Found !!`));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          null,
          `From subCategory get  controller Error :  ${error}`
        )
      );
  }
};

// get single subCategory
const getSingleSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const singleSubCategory = await subcategoryModel
      .findById(id)
      .populate(["category"]);
    if (singleSubCategory) {
      return res
        .status(200)
        .json(
          new apiResponse(
            true,
            singleSubCategory,
            "singleSubCategory Retirve  Sucessfull"
          )
        );
    }
    return res
      .status(401)
      .json(new apiError(false, 401, null, `SubCategory Not Found !!`));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          null,
          `From getSinglesubCategory  controller Error :  ${error}`
        )
      );
  }
};

// delte subcategbory
const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await subCatoryModel
      .findOneAndDelete({ _id: id })
      .select("-category");
    if (deletedItem) {
      return res
        .status(200)
        .json(
          new apiResponse(true, deletedItem, "SubCategory Deleted  Sucessfull")
        );
    }
    return res
      .status(401)
      .json(
        new apiError(
          false,
          401,
          null,
          `SubCategory Deleted  Failed or not Found SubCategory !!`
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          null,
          `From subCategory Delete  controller Error :  ${error}`
        )
      );
  }
};

// update the subCategory controoler
const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = await subCatoryModel
      .findOneAndUpdate({ _id: id }, { ...req.body }, { new: true })
      .populate("category");

    if (updatedItem) {
      return res
        .status(200)
        .json(
          new apiResponse(
            true,
            updatedItem,
            "saveSubCategory Update  Sucessfull"
          )
        );
    }
    return res
      .status(401)
      .json(new apiError(false, 401, null, `SubCategory Update Failed!!`));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          null,
          `From subCategory get  controller Error :  ${error}`
        )
      );
  }
};
module.exports = {
  createSubCategory,
  getAllSubCategory,
  getSingleSubCategory,
  deleteSubCategory,
  updateSubCategory,
};
