const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CurrentSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["active", "pending", "deleted", "completed"],
      default: "active",
      required: true,
    },

    current: {
      type: Number,
      required: true,
      default: 0,
    },
    energyOrGenType: {
      type: String,
      enum: ["gridCurrent", "genCurrent"],
      required: true,
    },
    current2: {
      type: Number,
      required: true,
      default: 0,
    },
    serviceid: {
      type: String,

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
    dateCreatedAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Current = mongoose.model("Current", CurrentSchema);
module.exports = Current;
