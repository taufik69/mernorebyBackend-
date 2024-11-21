const cloudinary = require("cloudinary").v2;
const fs = require("fs");
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SCERECT,
});

const uploadCloudinaryFile = async (localFilePath) => {
  try {
    // Upload an image
    const uploadResult = await cloudinary.uploader.upload(localFilePath);
    if (uploadResult) {
      fs.unlinkSync(localFilePath);
    }
    return uploadResult;
  } catch (error) {
    console.log(`UploadCloudinaryfile Error`, error);
  }
};

const deleteCloudinaryFile = async (filepath) => {
  try {
    const delteItem = cloudinary.api.delete_resources([filepath], {
      type: "upload",
    });
    return delteItem;
  } catch (error) {
    console.log(`deleteCloudinaryFile Error`, error);
  }
};

module.exports = { uploadCloudinaryFile, deleteCloudinaryFile };
