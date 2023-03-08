const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");

const walletSchema = new Schema(
  {
    walletid: {
      type: String,
      unique: true,
      required: true,
    },

    companyId: {
      type: mongoose.ObjectId,
      required: true,
    },

    owner: {
      type: String,

      // required: true,
      // default: crypto.randomInt(10000000, 99999999),
    },
    role: {
      type: String,

      required: true,
      default: "user",
    },
    balance: {
      type: Number,

      required: true,
      default: 0,
    },
    bonus: {
      type: Number,

      required: true,
      default: 0,
    },
    percentage: {
      type: Number,

      required: true,
      default: 0,
    },
    progress: {
      type: Number,

      required: true,
      default: 0,
    },
    rating: {
      type: Number,

      required: true,
      default: 0,
    },
    txnpin: {
      type: Number,

      required: true,
      default: 0,
    },
    pinset: {
      type: Boolean,

      required: true,
      default: false,
    },
    company: {
      type: String,

      required: true,
    },
    tag: {
      type: String,

      required: true,
    },
    status: {
      type: String,

      required: true,
    },
  },
  { timestamps: true }
);

const Wallet = mongoose.model("Wallet", walletSchema);
module.exports = Wallet;
