const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fuelLevelSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["active", "pending", "deleted", "completed"],
      default: "active",
      required: true,
    },
    currentValue: {
      type: Number,
      required: true,
    },
    firstdata: {
      type: Boolean,
      required: true,
      default: false,
    },
    lastForTheDay: {
      type: Boolean,
      required: true,
      default: false,
    },
    topic: {
      type: String,
      required: true,
    },
    serviceid: {
      type: String,

      required: true,
    },
    dateCreatedAt: {
      type: Date,
      required: true,
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
  },
  { timestamps: true }
);

const FuelLevel = mongoose.model("FuelLevel", fuelLevelSchema);
module.exports = FuelLevel;
