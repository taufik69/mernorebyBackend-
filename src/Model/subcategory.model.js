const mongoose = require("mongoose");
const { Schema } = mongoose;
const subCategorySchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "category",
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "product",
  },
});

module.exports = mongoose.model("subcategory", subCategorySchema);
