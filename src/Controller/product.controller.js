const prouductModel = require("../Model/product.model.js");
const { apiResponse } = require("../Utils/ApiResponse.js");
const { apiError } = require("../Utils/ApiError.js");
const { staticFileGenerator } = require("../Helpers/staticfileGenerator.js");
const {
  uploadCloudinaryFile,
  deleteCloudinaryFile,
} = require("../Utils/cloudinary.js");
const NodeCache = require("node-cache");
const productModel = require("../Model/product.model.js");
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
    let allUploadedImg = [];
    for (let image of allImage) {
      let uploadFIle = await uploadCloudinaryFile(image?.path);
      allUploadedImg.push(uploadFIle.secure_url);
    }

    // setup cloudinary
    // const allImageWithDoamin = staticFileGenerator(allImage);

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
      image: allUploadedImg,
      ...req.body,
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

// const updateProduct  controller
const updateProduct = async (req, res) => {
  try {
    const { productid } = req.params;
    const isExistProduct = await productModel.findById(productid);
    if (!isExistProduct) {
      return res
        .status(401)
        .json(new apiError(false, null, `Product Not Found !!`));
    }

    let delete_resourcesCloudinary = null;
    let allUploadedImg = [];
    if (req.files?.image) {
      for (let image of isExistProduct.image) {
        const splitImageAdress = image.split("/");
        const cloudinaryFilePath =
          splitImageAdress[splitImageAdress.length - 1]?.split(".")[0];
        delete_resourcesCloudinary =
          await deleteCloudinaryFile(cloudinaryFilePath);
      }

      if (delete_resourcesCloudinary) {
        for (let image of req.files?.image) {
          let uploadFIle = await uploadCloudinaryFile(image?.path);
          allUploadedImg.push(uploadFIle.secure_url);
        }
        const updateProduct = await productModel.findOneAndUpdate(
          { _id: productid },
          { ...req.body, image: allUploadedImg },
          { new: true }
        );
        return res
          .status(200)
          .json(
            new apiResponse(
              true,
              updateProduct,
              "allProduct Retrived  Sucessfull"
            )
          );
      }
    }
    //without image
    const updateProduct = await productModel.findOneAndUpdate(
      { _id: productid },
      { ...req.body },
      { new: true }
    );
    return res
      .status(200)
      .json(
        new apiResponse(true, updateProduct, "allProduct Retrived  Sucessfull")
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          null,
          `From update Product controller Error :  ${error}`
        )
      );
  }
};
// const getSingleProduct
const getsingleProduct = async (req, res) => {
  try {
    const { productid } = req.params;
    const singleProduct = await productModel
      .findById(productid)
      .populate(["category", "subcategory"])
      .lean();
    if (singleProduct) {
      return res
        .status(200)
        .json(
          new apiResponse(
            true,
            singleProduct,
            "singleProduct Retrived  Sucessfull"
          )
        );
    }
    return res
      .status(400)
      .json(new apiError(false, null, `Single product retrive Failed`));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          null,
          `From update Product controller Error :  ${error}`
        )
      );
  }
};

// const delteproduct
const deleteProduct = async (req, res) => {
  try {
    const { productid } = req.params;
    const delteProduct = await productModel.findOneAndDelete({
      _id: productid,
    });
    if (delteProduct) {
      return res
        .status(200)
        .json(new apiResponse(true, delteProduct, "product Delete Sucessfull"));
    }
    return res.status(401).json(new apiError(false, null, `Delte Failed`));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          null,
          `From  Delte  Product controller Error :  ${error}`
        )
      );
  }
};

module.exports = {
  createProduct,
  getAllproducts,
  updateProduct,
  getsingleProduct,
  deleteProduct,
};
