const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const generatorRunTimeSecondSchema = new Schema(
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
    generatorOnTime: {
      type: Number,
      // required: true,
    },
    isGenOnCount: {
      type: Number,
      required: true,
    },
    serviceid: {
      type: String,

      required: true,
    },
    generatorOffTime: {
      type: Number,
      // required: true,
    },

    isNewTimeDiff: {
      type: Boolean,
      required: true,
      default: false,
    },
    newTimeDiff: {
      type: Number,
      // required: true,
    },
    timeDiff: {
      type: Number,
      // required: true,
    },
    holdPreviousGenData: {
      type: Number,
    },
    tag: {
      type: String,
      required: true,
    },

    newDateCreatedAt: {
      type: Date,
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

const GeneratorRunTimeSecond = mongoose.model(
  "GeneratorRunTimeSecond",
  generatorRunTimeSecondSchema
);
module.exports = GeneratorRunTimeSecond;
