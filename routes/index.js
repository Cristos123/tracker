var express = require("express");
const { isCurrentUserLoggedIn } = require("../controller/authenticate");
const {
  EnergySubscribeAndPublishMqtt,
  getGridEnergyChat,
  getGridAndGenEnergyConsumption,
} = require("../controller/mqtt/energySubscribed");
const {
  FuelOrDieselSubscribeMqtt,
  getFuelLevel,
  getFuelLevelConsumption,
  getFuelLevelConsumptionChat,
  getFuelLevelChat,
  getFuelLevelHistory,
  exportToCsv,
  getGenRunTimeStatus,
  getGenRuntimePerDay,
} = require("../controller/mqtt/fuelSubscribe");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
// SubscribeMqtt();
FuelOrDieselSubscribeMqtt();

router.get("/fuel-level", isCurrentUserLoggedIn, getFuelLevel);
router.get(
  "/fuel-level-consumption",
  isCurrentUserLoggedIn,
  getFuelLevelConsumption
);
// router.get(
//   "/fuel-level-consumption-line-chat",
//   isCurrentUserLoggedIn,
//   getFuelLevelConsumptionLineChat
// );
// router.get(
//   "/iobotech/test",

//   getFuelLevelConsumptionLineChatTest
// );
router.get("/exporttocsv", isCurrentUserLoggedIn, exportToCsv);
router.get("/exporttocsv-fuel-consumption", isCurrentUserLoggedIn, exportToCsv);
router.get(
  "/fuel-level-consumption-chat",
  isCurrentUserLoggedIn,
  getFuelLevelConsumptionChat
);
router.get("/fuel-level-chat", isCurrentUserLoggedIn, getFuelLevelChat);
router.get("/fuel-level-history", isCurrentUserLoggedIn, getFuelLevelHistory);
router.get("/gen-runtime-status", isCurrentUserLoggedIn, getGenRunTimeStatus);
router.get("/gen-run-time", isCurrentUserLoggedIn, getGenRuntimePerDay);

module.exports = router;
