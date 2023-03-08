const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GridCurrentAndVoltageSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["active", "pending", "deleted", "completed"],
      default: "active",
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    day: {
      type: Number,
      required: true,
    },
    currentData: {
      type: Number,
      // required: true,
    },
    voltage: {
      type: Number,
      // required: true,
    },
    companyName: {
      type: String,
      required: true,
    },

    deviceId: {
      type: String,
      required: true,
    },

    tag: {
      type: String,
      required: true,
    },
    companyId: {
      type: mongoose.ObjectId,
      required: true,
    },

    topic: {
      type: String,
      required: true,
    },
    dateCreatedAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const GridCurrentAndVoltage = mongoose.model(
  "GridCurrentAndVoltage",
  GridCurrentAndVoltageSchema
);
module.exports = GridCurrentAndVoltage;
