const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GridAndGenOnTogetherSchema = new Schema(
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
    genAndGridIsONTime: {
      type: Date,
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
    serviceid: {
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

const GridAndGenOnTogether = mongoose.model(
  "GridAndGenOnTogether",
  GridAndGenOnTogetherSchema
);
module.exports = GridAndGenOnTogether;
