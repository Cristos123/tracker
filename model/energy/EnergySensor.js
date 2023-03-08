const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EnergySensorSchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    siteName: {
      type: String,
      required: true,
    },
    deviceId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "pending", "deleted", "completed"],
      default: "active",
      required: true,
    },

    companyId: {
      type: mongoose.ObjectId,
      required: true,
    },

    authToken: {
      auth_token: {
        unique: true,

        type: String,
        required: true,
      },
      authTokenStatus: {
        type: String,
        enum: ["active", "used", "expired"],
        default: "active",
        required: true,
      },
    },

    dataReievedAt: {
      type: Date,
      default: new Date(),
    },

    topic: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    serviceid: {
      type: String,
      unique: true,
      required: true,
    },
    isHavingGenAndGrid: {
      type: Boolean,
      required: true,
      default: false,
    },
    isHavingCalculation: {
      type: Boolean,
      required: true,
      default: false,
    },

    monitorRuntime: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const EnergySensor = mongoose.model("EnergySensor", EnergySensorSchema);
module.exports = EnergySensor;
