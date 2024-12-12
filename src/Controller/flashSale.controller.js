const flashSaleModel = require("../Model/flashSale.model");
const { apiResponse } = require("../Utils/ApiResponse.js");
const { apiError } = require("../Utils/ApiError.js");

// create new flashSale
const createFlashSale = async (req, res) => {
  try {
    const { product } = req.body;
    if (!product) {
      return res
        .status(401)
        .json(new apiError(false, null, `product id Missing`));
    }

    // seach alrady exist this product in database
    const isAlreadyExist = await flashSaleModel.findOne({ product: product });
    if (isAlreadyExist) {
      return res
        .status(401)
        .json(
          new apiError(
            false,
            null,
            `Already this product added in flash Sale Try another product`
          )
        );
    }

    // now save the product id in database
    const saveFlashSaleProduct = await flashSaleModel.create({
      product: product,
    });
    if (!saveFlashSaleProduct) {
      return res
        .status(501)
        .json(new apiError(false, null, `FlashSale product upload Failed `));
    }

    return res
      .status(200)
      .json(
        new apiResponse(
          true,
          saveFlashSaleProduct,
          "FlashSale Created  Sucessfull"
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          null,
          `from CreateFlashSale controller  :  ${error}`
        )
      );
  }
};

// get allFlashSaleProduct
const getAllFlashSaleProduct = async (req, res) => {
  try {
    const allFlashSaleProduct = await flashSaleModel.find().populate({
      path: "product",
    });
    if (!allFlashSaleProduct?.length) {
      return res
        .status(501)
        .json(new apiError(false, null, `Flash Sale Porduct Not Found !`));
    }
    return res
      .status(200)
      .json(
        new apiResponse(
          true,
          allFlashSaleProduct,
          "allFlashSaleProduct  Retrive   Sucessfull"
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          null,
          `from getAllFalshSale controller  :  ${error}`
        )
      );
  }
};

// update flashSale
const updatFlashsale = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(501)
        .json(new apiError(false, null, `update flashSale params id Missing`));
    }

    // update the document
    const newupdatFlashSale = await flashSaleModel.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true }
    );
    if (!newupdatFlashSale) {
      return res
        .status(501)
        .json(new apiError(false, null, `Update flash sale Failed`));
    }

    return res
      .status(200)
      .json(
        new apiResponse(true, newupdatFlashSale, "FlashSale update  Sucessfull")
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(false, null, `from updateFlashSale controller ${error}`)
      );
  }
};

module.exports = { createFlashSale, getAllFlashSaleProduct, updatFlashsale };
