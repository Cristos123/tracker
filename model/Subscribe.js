const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscribeSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["active", "pending", "deleted", "completed"],
      default: "pending",
      required: true,
    },
    sixChar: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    eightWords: {
      type: [Object],
      required: true,
    },
  },
  { timestamps: true }
);

const Subscribes = mongoose.model("Subscribes", subscribeSchema);
module.exports = Subscribes;
