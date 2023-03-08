const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    googleId: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    email_verification: {
      type: Boolean,
      required: true,
      default: false,
    },
    userid: {
      type: String,

      required: true,
    },

    walletid: {
      type: String,
      unique: true,
      required: true,
    },
    fuelid: {
      type: String,
      // unique: true,
      // required: true,
      default: 0,
    },

    serviceid: {
      type: String,
      unique: true,
      required: true,
    },

    energy: {
      type: Boolean,

      required: true,
      default: false,
    },
    water: {
      type: Boolean,

      required: true,
      default: false,
    },
    companyId: {
      type: mongoose.ObjectId,
      required: true,
    },
    energySensorId: {
      type: mongoose.ObjectId,
    },
    tankId: {
      type: mongoose.ObjectId,
    },
    iotservice: {
      type: Boolean,
      required: true,
      default: false,
    },
    iotserviceType: {
      fuelIot: {
        type: Boolean,
        required: true,
        default: false,
      },
      energyIot: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
    userType: {
      type: String,

      // required: true,
    },
    role: {
      type: String,
      required: true,
      default: "user",
    },
    service_start: {
      type: Date,
    },
    service_end: {
      type: Date,
    },

    username: {
      type: String,
    },
    company: {
      type: String,
    },
    address: {
      type: String,
    },
    phonenumber: {
      type: String,
      required: true,
    },

    restriction: {
      type: String,
    },

    notification: {
      type: [Object],
    },
    pics: {
      type: String,
    },

    auth: {
      type: String,
    },
    lastlogin: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
