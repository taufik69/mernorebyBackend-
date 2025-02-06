const { apiResponse } = require("../Utils/ApiResponse.js");
const { apiError } = require("../Utils/ApiError.js");
const bannerModel = require("../Model/banner.model.js");
const {
  uploadCloudinaryFile,
  deleteCloudinaryFile,
} = require("../Utils/cloudinary.js");
const NodeCache = require("node-cache");
const myCache = new NodeCache();
const createBanner = async (req, res) => {
  try {
    const { name } = req.body;

    if (!req.files?.image || !name) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, "image or name Missing!"));
    }

    // upload the image of cloudinary
    const { secure_url } = await uploadCloudinaryFile(
      req.files?.image[0]?.path
    );

    // save the document of

    const savebannerData = await new bannerModel({
      name: name,
      image: secure_url,
    }).save();

    if (!savebannerData) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, "Faild to Upload Try Again!"));
    }
    // revidate cached memory
    myCache.del("banner");
    return res
      .status(200)
      .json(
        new apiResponse(
          true,
          savebannerData,
          "Bannner Upload Sucessfull",
          false
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(false, null, `from createbanner controller  :  ${error}`)
      );
  }
};

// get all banner
const getAllBanner = async (req, res) => {
  try {
    const cachedData = myCache.get("banner");
    if (cachedData === undefined) {
      const allBanner = await bannerModel.find();
      myCache.set("banner", allBanner);
      if (allBanner?.length) {
        return res
          .status(200)
          .json(
            new apiResponse(
              true,
              allBanner,
              "Bannner retrive Sucessfull",
              false
            )
          );
      }
    } else {
      return res
        .status(200)
        .json(
          new apiResponse(true, cachedData, "Bannner retrive Sucessfull", false)
        );
    }
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(false, null, `from getAllBanner controller  :  ${error}`)
      );
  }
};

// update bannr
const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const searchItem = await bannerModel.findById(id);
    if (!searchItem) {
      return res
        .status(401)
        .json(new apiError(false, null, `Banner not Found  !!`));
    }

    const image = req.files?.image;
    const updateobj = {};
    if (image) {
      // remove the coudinary image
      const cloudinaryImage = searchItem.image.split("/");
      const deletedUrl =
        cloudinaryImage[cloudinaryImage?.length - 1]?.split(".")[0];

      const delteobj = await deleteCloudinaryFile(deletedUrl);
      //   updateobj.image = sucureUrl;
      if (!delteobj?.deleted) {
        return res
          .status(501)
          .json(new apiError(false, null, `Old image NOt deleted`));
      }

      //   upload the new iamge to cloudinary
      const { secure_url } = await uploadCloudinaryFile(image[0].path);
      updateobj.image = secure_url;
    }

    if (req.body.name) {
      updateobj.name = req.body.name;
    }

    // finally update the update object in database
    const updateBanner = await bannerModel.findOneAndUpdate(
      { _id: id },
      { ...updateobj },
      { new: true }
    );
    if (updateBanner) {
      return res
        .status(200)
        .json(
          new apiResponse(
            true,
            updateBanner,
            "Bannner retrive Sucessfull",
            false
          )
        );
    }
    return res
      .status(501)
      .json(new apiError(false, null, `Banner updated Failed`));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(false, null, `from updatebanner controller  :  ${error}`)
      );
  }
};
module.exports = { createBanner, getAllBanner, updateBanner };
