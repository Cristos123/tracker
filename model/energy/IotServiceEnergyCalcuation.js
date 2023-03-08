const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IotServiceEnergyServiceCalcuationSchema = new Schema(
  {
    companyName: {
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
    energyServiceId: {
      type: mongoose.ObjectId,
      required: true,
    },

    topic: {
      type: String,
      required: true,
    },
    deviceId: {
      type: String,
      required: true,
    },

    serviceid: {
      type: String,
      unique: true,
      required: true,
    },
    energy: {
      type: Number,
      required: true,
      default: 1,
    },
    power: {
      type: Number,
      required: true,
      default: 1,
    },
    current: {
      type: Number,
      required: true,
      default: 1,
    },
    voltage: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { timestamps: true }
);

const IotServiceEnergyServiceCalcuation = mongoose.model(
  "IotServiceEnergyServiceCalcuation",
  IotServiceEnergyServiceCalcuationSchema
);
module.exports = IotServiceEnergyServiceCalcuation;
