const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IotServiceFuelCalcuationSchema = new Schema(
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
    tankId: {
      type: mongoose.ObjectId,
      required: true,
    },
    serviceid: {
      type: String,
      unique: true,
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
    minimumValue: {
      type: Number,
      required: true,
    },
    numberToSubstract: {
      type: Number,
      required: true,
    },
    maximumValue: {
      type: Number,
      required: true,
    },
    numberToDivide: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const IotServiceFuelCalcuation = mongoose.model(
  "IotServiceFuelCalcuation",
  IotServiceFuelCalcuationSchema
);
module.exports = IotServiceFuelCalcuation;
