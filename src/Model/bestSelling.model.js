const mongoose = require("mongoose");
const { Schema } = mongoose;
const bestSellingSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "product",
  },
});

module.exports = mongoose.model("bestselling", bestSellingSchema);
