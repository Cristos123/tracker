const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GridRunTimeSchema = new Schema(
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
    gridOnTime: {
      type: Number,
      // required: true,
    },
    isGridOnCount: {
      type: Number,
      required: true,
    },
    gridOffTime: {
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
    holdPreviousGridData: {
      type: Number,
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
    serviceid: {
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

const GridRunTime = mongoose.model("GridRunTime", GridRunTimeSchema);
module.exports = GridRunTime;
