const mongoose = require("mongoose");
const invoiceSchema = new mongoose.Schema(
  {
    subtotal: Number,
    cus_details: Object,
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "order" },
    tran_id: { type: String, unique: true },
    val_id: String,
    delivery_status: {
      type: String,
      enum: ["Pending", "Delivered", "canceled"],
      default: "Pending",
    },
    payment_status: {
      type: String,
      enum: ["Pending", "Success", "Failed", "Cancel"],
      default: "Pending",
    },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
