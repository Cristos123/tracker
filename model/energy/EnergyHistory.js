const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EnergyHistorySchema = new Schema(
  {
    status: {
      type: String,
      enum: ["active", "pending", "deleted", "completed"],
      default: "active",
      required: true,
    },
    generatorConsumpCurrentValue: {
      type: Number,
      //   required: true,
    },
    gridConsumpCurrentValue: {
      type: Number,
      //   required: true,
    },
    genRuntimefor: {
      type: Number,
      //   required: true,
    },
    gridRuntimefor: {
      type: Number,
      //   required: true,
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

const EnergyHistory = mongoose.model("EnergyHistory", EnergyHistorySchema);
module.exports = EnergyHistory;
