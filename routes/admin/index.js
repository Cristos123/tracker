var express = require("express");

const { isCurrentAdminLoggedIn } = require("../../controller/authenticate");

const {
  createNewCompany,
  createConnectionUrl,
  createCalculation,
  getCompanyDataByApiKey,
  createTenantAdmin,
} = require("../../controller/company/createNewCompany");
const {
  createNewEnergyService,
} = require("../../controller/IOTServices/energy/addEnergyService");
const {
  createNewTanks,
} = require("../../controller/IOTServices/tanks/addTanks");
const {
  getFuelLevel,
  getFuelLevelConsumption,
  getFuelLevelConsumptionLineChat,
  getFuelLevelConsumptionChat,
  getFuelLevelChat,
  getFuelLevelHistory,
  exportToCsv,
  getCompanyFuelDataByApiKey,
} = require("../../controller/mqtt/fuelSubscribe");

var adminRouter = express.Router();

/* GET home page. */
adminRouter.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// adminRouter.get("/subscribe", SubscribeMqtt);
adminRouter.get("/fuel-level", getFuelLevel);
adminRouter.get("/fuel-level-consumption", getFuelLevelConsumption);
adminRouter.get(
  "/fuel-level-consumption-line-chat",
  getFuelLevelConsumptionLineChat
);
adminRouter.get("/exporttocsv", exportToCsv);
adminRouter.get("/exporttocsv-fuel-consumption", exportToCsv);
adminRouter.get("/fuel-level-consumption-chat", getFuelLevelConsumptionChat);
adminRouter.get("/fuel-level-chat", getFuelLevelChat);
adminRouter.get("/fuel-level-history", getFuelLevelHistory);

//jakande route

// create new company
adminRouter.post("/create-new-company", createNewCompany);
adminRouter.post(
  "/create-new-tank",
  /* isCurrentAdminLoggedIn, */ createNewTanks
);
adminRouter.post(
  "/create-new-connection-url",
  /* isCurrentAdminLoggedIn */
  createConnectionUrl
);
adminRouter.post(
  "/create-fuel-calculation",
  /* isCurrentAdminLoggedIn, */
  createCalculation
);
adminRouter.post(
  "/create-energy-service-calculation",
  /* isCurrentAdminLoggedIn, */
  createCalculation
);
adminRouter.post(
  "/create-new-energy-service",
  /* isCurrentAdminLoggedIn, */
  createNewEnergyService
);

adminRouter.get(
  "/company",
  /* isCurrentAdminLoggedIn, */
  getCompanyDataByApiKey
);
adminRouter.get(
  "/company/fuelOrdiesel",
  /* isCurrentAdminLoggedIn, */
  getCompanyFuelDataByApiKey
);
adminRouter.post(
  "/create-tenant-admin",
  /* isCurrentAdminLoggedIn, */
  createTenantAdmin
);

module.exports = adminRouter;
