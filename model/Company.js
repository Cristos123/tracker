const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const companySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    apikey: {
      type: String,
      required: true,
    },
    Month: {
      type: Date,
    },
    Day: {
      type: Date,
    },
    Gen_Date: {
      type: Date,
      required: true,
    },
    notification: {
      type: String,
    },
    serviceType: {
      type: String,
      required: true,
    },
    howManySensor: {
      type: Number,
      required: true,
      default: 1,
    },
    suffix: {
      type: Number,
      required: true,
      default: 1,
    },
    logo: {
      type: String,
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

    source: {
      type: String,
      enum: ["internal", "external"],
      // default: "active",
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "Affilate",
    },
    walletid: {
      type: String,
    },
    iotservices: {
      type: [String],
    },

    threshold: {
      energy: {
        type: Number,
      },
      water: {
        type: Number,
      },
      iot: {
        type: Number,
      },
    },
    charges: {
      gatewaybill: {
        type: Number,
      },
      cap: {
        type: Boolean,
      },
      cap_max: { type: Number },
      cap_amount: { type: Number },
      vat: { type: Number },
      convinience: { type: Number },
    },
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);
module.exports = Company;
