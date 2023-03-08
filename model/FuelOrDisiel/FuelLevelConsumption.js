const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fuelLevelConsumptionSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["active", "pending", "deleted", "completed"],
      default: "active",
      required: true,
    },
    dailyConsumption: {
      type: Number,
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
    serviceid: {
      type: String,

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

const FuelLevelConsumption = mongoose.model(
  "FuelLevelConsumption",
  fuelLevelConsumptionSchema
);
module.exports = FuelLevelConsumption;
