const mongoose = require("mongoose");
const { Schema } = mongoose;

const bannerSchema = new Schema(
  {
    image: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("banner", bannerSchema);
