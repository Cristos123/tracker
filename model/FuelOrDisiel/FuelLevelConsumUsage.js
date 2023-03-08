const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fuelLevelConsumptionTotalUsageSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["active", "pending", "deleted", "completed"],
      default: "active",
      required: true,
    },
    FuelTotalUsage: {
      type: Number,
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
    serviceid: {
      type: String,

      required: true,
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
    dateCreatedAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const FuelLevelConsumptionTotalUsage = mongoose.model(
  "FuelLevelConsumptionTotalUsage",
  fuelLevelConsumptionTotalUsageSchema
);
module.exports = FuelLevelConsumptionTotalUsage;
