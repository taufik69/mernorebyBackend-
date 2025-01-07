const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const cartSchmea = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  size: {
    type: String,
    enum: ["S", "M", "L", "XL", "XXL"],
    default: "S",
  },
  color: {
    type: String,

    default: null,
  },

  quantity: {
    type: Number,
    default: 1,
  },
  subTotal: {
    type: Number,
  },
});

module.exports = mongoose.model("Cart", cartSchmea);
