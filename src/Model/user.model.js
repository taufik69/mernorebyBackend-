const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "FirstName Missing !!"],
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email Missing !!"],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "mobile Missing !!"],
      trim: true,
      max: [11, "max length is 11"],
      min: [11, "minx length is 11"],
    },
    adress1: {
      type: String,
      required: [true, "adress1 Missing !!"],
      trim: true,
    },
    adress2: {
      type: String,

      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    postCode: {
      type: String,

      trim: true,
    },

    divison: {
      type: String,

      trim: true,
    },

    district: {
      type: String,

      trim: true,
    },
    password: {
      type: String,
      required: [true, "district Missing !!"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "marchant"],
      default: "user",
    },
    avatar: {
      type: String,
    },
    Otp: {
      type: Number,
    },
    resetOtp: {
      type: Number,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);
