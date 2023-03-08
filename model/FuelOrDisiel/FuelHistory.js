const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fuelHistorySchema = new Schema(
  {
    status: {
      type: String,
      enum: ["active", "pending", "deleted", "completed"],
      default: "active",
      required: true,
    },
    fuelCurrentValue: {
      type: Number,
      //   required: true,
    },
    fuelDailyConsumption: {
      type: Number,
      //   required: true,
    },
    genRuntimefor: {
      type: Number,
      //   required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    serviceid: {
      type: String,

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
    topic: {
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
    tag: {
      type: String,
      required: true,
    },

    deviceId: {
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

const FuelHistory = mongoose.model("FuelHistory", fuelHistorySchema);
module.exports = FuelHistory;
