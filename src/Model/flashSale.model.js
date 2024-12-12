const mongoose = require("mongoose");
const { Schema } = mongoose;
const flashSlaeSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "product",
  },
});

module.exports = mongoose.model("falshSale", flashSlaeSchema);
