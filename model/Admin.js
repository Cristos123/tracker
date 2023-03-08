const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminSchema = new Schema(
  {
    adminid: {
      type: String,

      required: true,
    },
    level: {
      type: String,

      required: true,
    },
    lastlogin: {
      type: String,
    },
    role: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },
    tag: {
      type: [String],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;
