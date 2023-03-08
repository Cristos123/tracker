const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TankSchema = new Schema(
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
    serviceid: {
      type: String,
      unique: true,
      required: true,
    },

    dataReievedAt: {
      type: Date,
      default: new Date(),
    },

    tankLevel: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },

    isHavingTwoGen: {
      type: Boolean,
      required: true,
      default: false,
    },

    isHavingTamper: {
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

const Tank = mongoose.model("Tank", TankSchema);
module.exports = Tank;
