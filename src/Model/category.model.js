const mongoose = require("mongoose");
const { Schema } = mongoose;
const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  subCategory: {
    type: Schema.Types.ObjectId,
    ref: "subCategory",
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("category", categorySchema);
