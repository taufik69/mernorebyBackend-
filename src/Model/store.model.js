const mongoose = require("mongoose");
const { Schema } = mongoose;

const storeSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  storeName: {
    type: String,
    required: true,
    trim: true,
  },
  storeAdress: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "product",
  },
  status: {
    type: String,
    enum: ["pending", "active", "rejected"],
  },
});

module.exports = mongoose.model("store", storeSchema);
