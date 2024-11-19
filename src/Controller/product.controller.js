const prouductModel = require("../Model/product.model.js");
const { apiResponse } = require("../Utils/ApiResponse.js");
const { apiError } = require("../Utils/ApiError.js");
const { staticFileGenerator } = require("../Helpers/staticfileGenerator.js");
const NodeCache = require("node-cache");
const myCache = new NodeCache();
// post product upload
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, subcategory } = req.body;
    if (!name || !description || !price || !category || !subcategory) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, "Product Credential Missing !!"));
    }

    if (!req?.files) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, "image  Missing !!"));
    }

    const allImage = req.files?.image;
    const allImageWithDoamin = staticFileGenerator(allImage);

    const alreadyExistProdut = await prouductModel.find({ name: name });
    if (alreadyExistProdut?.length) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, "Already Exist this product !!"));
    }
    const saveProducts = await new prouductModel({
      name,
      description,
      price,
      category,
      subcategory,
      image: allImageWithDoamin,
    }).save();

    if (saveProducts) {
      return res
        .status(200)
        .json(
          new apiResponse(true, saveProducts, "Product Created  Sucessfull")
        );
    }

    return res
      .status(401)
      .json(
        new apiError(false, 401, null, "Product upload Failed Try again !!")
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          null,
          `From Create Product controller Error :  ${error}`
        )
      );
  }
};

// get allProduct
const getAllproducts = async (req, res) => {
  try {
    const value = myCache.get("allproduct");
    if (value == undefined) {
      const allProduct = await prouductModel.find({});
      myCache.set("allproduct", JSON.stringify(allProduct), 60 * 60);

      if (allProduct) {
        return res
          .status(200)
          .json(
            new apiResponse(true, allProduct, "allProduct Retrived  Sucessfull")
          );
      }
    } else {
      return res
        .status(200)
        .json(
          new apiResponse(
            true,
            JSON.parse(value),
            "allProduct Retrived  Sucessfull"
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
          "all Product retirve Failed Try again !!"
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          null,
          `From get all Product controller Error :  ${error}`
        )
      );
  }
};

module.exports = { createProduct, getAllproducts };
