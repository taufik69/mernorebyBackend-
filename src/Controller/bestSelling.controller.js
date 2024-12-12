const bestSellingModel = require("../Model/bestSelling.model.js");
const { apiResponse } = require("../Utils/ApiResponse.js");
const { apiError } = require("../Utils/ApiError.js");

// create new flashSale
const createBestSelling = async (req, res) => {
  try {
    const { product } = req.body;
    if (!product) {
      return res
        .status(401)
        .json(new apiError(false, null, `product id Missing`));
    }

    // seach alrady exist this product in database
    const isAlreadyExist = await bestSellingModel.findOne({ product: product });
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
    const savebestSellingProduct = await bestSellingModel.create({
      product: product,
    });
    if (!savebestSellingProduct) {
      return res
        .status(501)
        .json(new apiError(false, null, `bestSelling product upload Failed `));
    }

    return res
      .status(200)
      .json(
        new apiResponse(
          true,
          savebestSellingProduct,
          "bestSelling Created  Sucessfull"
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(false, null, `from bestSelling controller  :  ${error}`)
      );
  }
};

// get allFlashSaleProduct
const getAllBestSellingProduct = async (req, res) => {
  try {
    const allBestSEllingProduct = await bestSellingModel.find().populate({
      path: "product",
    });
    if (!allBestSEllingProduct?.length) {
      return res
        .status(501)
        .json(new apiError(false, null, ` Best Sellling Porduct Not Found !`));
    }
    return res
      .status(200)
      .json(
        new apiResponse(
          true,
          allBestSEllingProduct,
          "allFlashBest SelllingSaleProduct  Retrive   Sucessfull"
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(false, null, `from Best Sellling controller  :  ${error}`)
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

module.exports = { createBestSelling, getAllBestSellingProduct };
