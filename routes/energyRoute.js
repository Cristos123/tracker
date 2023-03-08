var express = require("express");
const { isCurrentUserLoggedIn } = require("../controller/authenticate");
const {
  EnergySubscribeAndPublishMqtt,
  getGridEnergyChat,
  getGridAndGenEnergyConsumption,
  getGridRuntimePerDay,
  getGridRunTimeStatus,
  getVoltage,
  getCurrent,
  getPower,
  getGenRuntimePerDay,
  getGenRunTimeStatus,
} = require("../controller/mqtt/energySubscribed");

var energyRouter = express.Router();

EnergySubscribeAndPublishMqtt();

energyRouter.get(
  "/gen-runtime-status",
  isCurrentUserLoggedIn,
  getGridRunTimeStatus
);
energyRouter.get(
  "/grid-runtime-status",
  isCurrentUserLoggedIn,
  getGenRunTimeStatus
);
energyRouter.get("/gen-run-time", isCurrentUserLoggedIn, getGenRuntimePerDay);
energyRouter.get(
  "/grid-gen-runtime",
  isCurrentUserLoggedIn,
  getGridRuntimePerDay
);

// energy route

energyRouter.get(
  "/energy-consumption-chat",
  isCurrentUserLoggedIn,
  getGridEnergyChat
);
energyRouter.get(
  "/energy-consumption",
  isCurrentUserLoggedIn,
  getGridAndGenEnergyConsumption
);
energyRouter.get("/energy-voltage", isCurrentUserLoggedIn, getVoltage);
energyRouter.get("/energy-power", isCurrentUserLoggedIn, getPower);
energyRouter.get("/energy-current", isCurrentUserLoggedIn, getCurrent);

module.exports = energyRouter;
