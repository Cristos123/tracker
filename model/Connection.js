const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConnectionSchema = new Schema(
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
    isnewTopic: {
      type: Boolean,
      required: true,
      default: false,
    },
    topic: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      // required: true,
    },
    hostURL: {
      type: String,
      // required: true,
    },
    port: {
      type: String,
      // required: true,
    },
    password: {
      type: String,
      // required: true,
    },
    iotConnectionForEnergyORFuel: {
      type: String,
      required: true,
    },
    iotServices: {
      fuelTank: {
        isFuelIOT: {
          type: Boolean,
          required: true,
          default: false,
        },
        siteName: {
          type: String,
          // required: true,
          default: "",
        },
      },
      energyIOT: {
        isEnergyIOT: { type: Boolean, required: true, default: false },

        siteName: {
          type: String,
          // required: true,
          default: "",
        },
      },
    },
  },
  { timestamps: true }
);

const Connection = mongoose.model("Connection", ConnectionSchema);
module.exports = Connection;
