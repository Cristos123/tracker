const mqtt = require("mqtt");
const dayjs = require("dayjs");
const Connection = require("../../model/Connection");
const Tank = require("../../model/FuelOrDisiel/Tanks");
const FuelHistory = require("../../model/FuelOrDisiel/FuelHistory");
const FuelLevel = require("../../model/FuelOrDisiel/FuelLevel");
const FuelLevelConsumption = require("../../model/FuelOrDisiel/FuelLevelConsumption");
const IotServiceFuelCalcuation = require("../../model/FuelOrDisiel/IotServiceFuelCalcuation");
const { fuelMonitoring } = require("../../helper/functions/fuelMonitoring");
const {
  genRuntimesLogicGeneral,
  genstatus,
  reconnects,
  calculateDuration2,
  publishAfter30Mins,
} = require("../../helper/helper");
const GeneratorRunTime = require("../../model/GeneratorRuntime");
const GeneratorRunTimeSecond = require("../../model/FuelOrDisiel/GeneratorRuntimeSecond");
const GeneratorRunTimeStatusSecond = require("../../model/FuelOrDisiel/GeneratorRuntimeStatusSecond");
const GeneratorRunTimeStatus = require("../../model/GeneratorRuntimeStatus");
const cron = require("node-cron");
const Company = require("../../model/Company");
let getConnection = {};

// let lastMessageTime = dayjs();
// let sendData30mins = dayjs();
// let lastMessageTimeZero = dayjs();
// let holdGenPreviousDiff = {};
let sendData30mins = dayjs();

const FuelOrDieselSubscribeMqtt = async () => {
  let host = "friendly-tailor.cloudmqtt.com";
  let port = "1883"; //process.env.PORT;
  try {
    getConnection = await Connection.find({
      "iotServices.fuelTank.isFuelIOT": true,
    });
    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
    const connectUrl = `mqtt://${host}:${port}`;

    const client = mqtt.connect(connectUrl, {
      clientId,
      clean: true,
      connectTimeout: 4000,
      username: "sfclxtvz",
      password: "vwfKM23GmMu6",
      reconnectPeriod: 1000,
      keepalive: 5000,
    });
    client.on("connect", () => {
      console.log("connected");
    });

    client.on("connect", async () => {
      console.log({ getConnection });
      getConnection.length > 0 &&
        getConnection.map((v) => {
          // console.log({ data });
          //  return v.topic;

          client.subscribe([v.topic], { qos: 1 }, (err, granted) => {
            if (err) {
              console.log(err, "err");
            }
            console.log(granted, "granted");
          });
        }),
        console.log("it subscribe");
    });
    //DI1
    client.on("message", async (topic, message, packet) => {
      var msgObject = JSON.parse(message.toString());
      console.log({ topic, message, msgObject });
      const years = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const days = new Date().getDate();

      // console.log({ getConnection });

      const { NewMinutess30 } = await publishAfter30Mins(sendData30mins);
      if (msgObject.data) {
        const getTanksByDeviceId = await Tank.findOne({
          deviceId: msgObject.devId,
          topic,
        });
        // console.log({ getTanksByDeviceId });
        if (!!getTanksByDeviceId) {
          const devicedata = {
            [getTanksByDeviceId.deviceId]: {
              lastMessageTime: dayjs(),
              sendData30mins: dayjs(),
              lastMessageTimeZero: dayjs(),
              holdGenPreviousDiff: {},
              checkISGridOn: msgObject.data.DI1,
            },
          };
          devices = devicedata;
          // console.log(devices);
          if (msgObject.data.AI1) {
            const getTankCalculation = await IotServiceFuelCalcuation.findOne({
              deviceId: msgObject.devId,
              topic: topic,
            });
            // console.log({ getTankCalculation });
            if (
              !!getTankCalculation &&
              getTankCalculation.deviceId === msgObject.devId
            ) {
              let responseData = msgObject.data.AI1 / 1000;
              // let minusBy4 = (responseData - 4) * 5400;
              // let divideBy6 = minusBy4 / 6;
              // let fuelLevel = divideBy6 - 80;

              let minusBy4 =
                getTankCalculation.minimumValue +
                getTankCalculation.maximumValue *
                  (responseData - getTankCalculation.numberToSubstract);
              // let divideBy6 = minusBy4 / 6;
              let fuelLevel = minusBy4 / getTankCalculation.numberToDivide;
              console.log({ minusBy4, responseData, fuelLevel });
              if (NewMinutess30 === "00:30") {
                await fuelMonitoring(
                  FuelLevel,
                  topic,
                  fuelLevel.toFixed(2),
                  FuelLevelConsumption,
                  FuelHistory,
                  getTanksByDeviceId,
                  GeneratorRunTimeSecond,
                  GeneratorRunTimeStatusSecond
                );
              } else if (NewMinutess30 >= "00:31") {
                sendData30mins = dayjs();
              }
            }
          } else if (msgObject.data.DI1 && msgObject.data.DI2) {
            if (getTanksByDeviceId.isHavingTamper === true) {
              if (msgObject.data.DI1 === "1") {
                await genRuntimesLogicGeneral(
                  GeneratorRunTime,
                  GeneratorRunTimeStatus,
                  msgObject.data,
                  topic,
                  GeneratorRunTimeSecond,
                  GeneratorRunTimeStatusSecond,
                  getTanksByDeviceId
                );
              }

              if (msgObject.data.DI1 === "0") {
                await genstatus(
                  GeneratorRunTimeStatus,
                  msgObject.data.DI1,
                  topic,
                  getTanksByDeviceId
                );
              }
              if (msgObject.data.DI2 === "1") {
                //reset timer
              }
              if (msgObject.data.DI2 === "0") {
                // send email for tampered
              }
            } else {
              if (msgObject.data.DI1 === "1" || msgObject.data.DI2 === "1") {
                await genRuntimesLogicGeneral(
                  GeneratorRunTime,
                  GeneratorRunTimeStatus,
                  msgObject.data,
                  topic,
                  GeneratorRunTimeSecond,
                  GeneratorRunTimeStatusSecond,
                  getTanksByDeviceId
                );
              }
              if (msgObject.data.DI1 === "0") {
                await genstatus(
                  GeneratorRunTimeStatus,
                  msgObject.data.DI1,
                  topic,
                  getTanksByDeviceId
                );
              }
              if (msgObject.data.DI2 === "0") {
                await genstatus(
                  GeneratorRunTimeStatusSecond,
                  msgObject.data.DI2,
                  topic,
                  getTanksByDeviceId
                );
              }
            }
          }

          getTanksByDeviceId.dataReievedAt = dayjs();
          const updateTimeRecived = getTanksByDeviceId.save();
          if (!!updateTimeRecived) {
            console.log("It updated successfully");
          } else {
            console.log("it did not updated, there is error");
          }
        }
        // reconnect();
      }
    });

    client.on("packetsend", (packet) => {
      console.log(packet, "packet2");
    });
    cron.schedule("* * * * *", async () => {
      console.log("it enter cron jobb");
      getConnection = await Connection.find({
        "iotServices.fuelTank.isFuelIOT": true,
      });
      getConnection.length > 0 && (await reconnects(getConnection, client));
    });
  } catch (error) {
    console.log({ error });
  }
};

const getFuelLevel = async (req, res) => {
  try {
    console.log("req.user.tag", req.user.companyId);
    const getfuelLevelFrmDb = await FuelLevel.findOne(
      {
        tag: req.user.tag,
        // companyId: req.user.companyId,
        status: "active",
        serviceid: req.user.serviceid,
        dateCreatedAt: {
          $gte: dayjs().startOf("d"),
          $lte: dayjs().endOf("d"),
        },
      },
      { currentValue: 1, dateCreatedAt: 1 }
    ).sort({ dateCreatedAt: -1 });
    console.log({ getfuelLevelFrmDb });
    if (!!getfuelLevelFrmDb) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        success: true,
        data: getfuelLevelFrmDb,
      });
    } else {
      res.statusCode = 403;
      return res.json({
        success: false,

        message: "Fuel level not available!!",
      });
    }
  } catch (error) {
    console.log("error ", error);
    if (!!error && typeof error.message === "string") {
      return res.json({ success: false, message: error.message });
    } else {
      return res.json({ success: false, message: "error inserting user 2" });
    }
  }
};
const getFuelLevelConsumption = async (req, res) => {
  try {
    const getfuelLevelConsumptionFrmDb = await FuelLevelConsumption.findOne(
      {
        tag: req.user.tag,
        // companyId: req.user.companyId,
        status: "active",
        serviceid: req.user.serviceid,
        dateCreatedAt: {
          $gte: dayjs().startOf("d"),
          $lte: dayjs().endOf("d"),
        },
      },
      { dailyConsumption: 1, dateCreatedAt: 1 }
    ).sort({ dateCreatedAt: -1 });
    if (!!getfuelLevelConsumptionFrmDb) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        success: true,
        data: getfuelLevelConsumptionFrmDb,
      });
    } else {
      res.statusCode = 403;
      return res.json({
        success: false,

        message: "fuel consumption level  not available!!",
      });
    }
  } catch (error) {
    console.log("error ", error);
    if (!!error && typeof error.message === "string") {
      return res.json({ success: false, message: error.message });
    } else {
      return res.json({ success: false, message: "error inserting user 2" });
    }
  }
};
const getFuelLevelConsumptionLineChat = async (req, res) => {
  try {
    const getfuelLevelConsumptionFrmDb = await FuelLevel.find(
      {
        status: "active",
        tag: req.user.tag,
        serviceid: req.user.serviceid,
        // companyId: req.user.companyId,
        dateCreatedAt: {
          $gte: dayjs().startOf("d"),
          $lte: dayjs().endOf("d"),
        },
      },
      { currentValue: 1, dateCreatedAt: 1 }
    );
    if (!!getfuelLevelConsumptionFrmDb) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        success: true,
        data: getfuelLevelConsumptionFrmDb,
      });
    } else {
      res.statusCode = 403;
      return res.json({
        success: false,

        message: "fuel consumption level  not available!!",
      });
    }
  } catch (error) {
    console.log("error ", error);
    if (!!error && typeof error.message === "string") {
      return res.json({ success: false, message: error.message });
    } else {
      return res.json({ success: false, message: "error inserting user 2" });
    }
  }
};
const getFuelLevelConsumptionLineChatTest = async (req, res) => {
  try {
    const getfuelLevelConsumptionFrmDb = await FuelLevel.find({
      status: "active",
      tag: req.user.tag,
      // companyId: req.user.companyId,
      dateCreatedAt: {
        $gte: dayjs().subtract(9, "day").startOf("d"),
        $lte: dayjs().subtract(9, "day").endOf("d"),
      },
    });
    console.log({ getfuelLevelConsumptionFrmDb });
    if (!!getfuelLevelConsumptionFrmDb) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        success: true,
        data: getfuelLevelConsumptionFrmDb,
      });
    } else {
      res.statusCode = 403;
      return res.json({
        success: false,

        message: "fuel consumption level  not available!!",
      });
    }
  } catch (error) {
    console.log("error ", error);
    if (!!error && typeof error.message === "string") {
      return res.json({ success: false, message: error.message });
    } else {
      return res.json({ success: false, message: "error inserting user 2" });
    }
  }
};

const getFuelLevelConsumptionChat = async (req, res) => {
  try {
    const getfuelLevelConsumptionChatFrmDb2 = await FuelLevelConsumption.find(
      {
        status: "active",
        tag: req.user.tag,
        serviceid: req.user.serviceid,
        // companyId: req.user.companyId,
        dateCreatedAt: {
          $gte: dayjs().subtract(7, "d").startOf("d"),
        },
      },
      { dailyConsumption: 1, dateCreatedAt: 1 }
    ).sort({ dateCreatedAt: -1 });

    if (!!getfuelLevelConsumptionChatFrmDb2) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        success: true,
        data: getfuelLevelConsumptionChatFrmDb2,
      });
    } else {
      res.statusCode = 403;
      return res.json({
        success: false,

        message: "fuel consumption level  not available!!",
      });
    }
  } catch (error) {
    console.log("error ", error);
    if (!!error && typeof error.message === "string") {
      return res.json({ success: false, message: error.message });
    } else {
      return res.json({ success: false, message: "error inserting user 2" });
    }
  }
};
const getFuelLevelChat = async (req, res) => {
  try {
    const getfuelLevelChatFrmDb = await FuelLevel.find(
      {
        status: "active",
        tag: req.user.tag,
        serviceid: req.user.serviceid,
        // companyId: req.user.companyId,
        dateCreatedAt: {
          $gte: dayjs().subtract(7, "d").startOf("d"),
        },
      },
      { currentValue: 1, dateCreatedAt: 1 }
    ).sort({ dateCreatedAt: -1 });

    console.log({
      getfuelLevelChatFrmDb,
    });
    if (!!getfuelLevelChatFrmDb) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        success: true,
        data: {
          getfuelLevelChatFrmDb,
        },
      });
    } else {
      res.statusCode = 403;
      return res.json({
        success: false,

        message: "fuel  level chat  not available!!",
      });
    }
  } catch (error) {
    console.log("error ", error);
    if (!!error && typeof error.message === "string") {
      return res.json({ success: false, message: error.message });
    } else {
      return res.json({ success: false, message: "error inserting user 2" });
    }
  }
};

const calculateDuration = (value) => {
  const dur = dayjs.duration(value, "minute");
  const hours = dur.hours();
  const minutes = dur.minutes();

  return {
    hours,
    minutes,
  };
};

const getFuelLevelHistory1 = async (req, res) => {
  try {
    const yesterday = dayjs().subtract(1, "day").endOf("d").toDate();
    const thirtyDaysAgo = dayjs(yesterday)
      .subtract(30, "days")
      .startOf("d")
      .toDate();

    const getfuelLevelConsumptionChatFrmDb = await FuelLevelConsumption.find({
      status: "active",
      lastForTheDay: true,
      // dateCreatedAt: {
      //   $gte: thirtyDaysAgo,
      //   $lte: yesterday,
      // },
    }).sort({ dateCreatedAt: -1 });

    // const agregate = [
    //   {
    //     $match: {
    //       generatorOnTime: 1,
    //       status: "active",
    //       dateCreatedAt: {
    //         $gte: new Date(
    //           dayjs().subtract(30, "day").startOf("day").valueOf()
    //         ),
    //         $lte: new Date(dayjs().subtract(1, "day").endOf("day").valueOf()),
    //       },
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: {
    //         date: {
    //           $dateToString: { format: "%Y-%m-%d", date: "$dateCreatedAt" },
    //         },
    //         generatorOnTime: "$generatorOnTime", // the $rating here will be the value you want to use to group, the property that has 0 or 1 in your db
    //       },
    //       genTime: { $sum: 1 },
    //     },
    //   },
    // ];

    // let genData = await GeneratorRunTime.aggregate(agregate);
    // let dura = calculateDuration(genData);
    // console.log("{ genData },", JSON.stringify(genData), { dura });
    const getGenRunTimeOn = await GeneratorRunTime.find({
      status: "active",
      generatorOnTime: 1,

      dateCreatedAt: {
        $gte: new Date(dayjs().subtract(30, "day").startOf("day").valueOf()),
        $lte: new Date(dayjs().subtract(1, "day").endOf("day").valueOf()),
      },
      // dateCreatedAt: {
      //   $gte: thirtyDaysAgo,
      //   $lte: yesterday,
      // },
    }).sort({ dateCreatedAt: -1 });
    console.log({ getGenRunTimeOn });
    const getfuelLevelChatFrmDb = await FuelLevel.find({
      status: "active",
      lastForTheDay: true,
      // dateCreatedAt: {
      //   $gte: thirtyDaysAgo,
      //   $lte: yesterday,
      // },
    }).sort({ dateCreatedAt: -1 });
    if (
      !!getfuelLevelConsumptionChatFrmDb ||
      !!getfuelLevelChatFrmDb ||
      !!getGenRunTimeOn
    ) {
      // let dats = calculateDuration(getGenRunTimeOn.length);
      // console.log({ dats }, "getGenRunTimeOn.length", getGenRunTimeOn.length);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        success: true,
        data: {
          getfuelLevelConsumptionChatFrmDb,
          getfuelLevelChatFrmDb,
          getGenRunTimeOn,
        },
      });
    } else {
      res.statusCode = 403;
      return res.json({
        success: false,

        message: "fuel  level  not available!!",
      });
    }
  } catch (error) {
    console.log("error ", error);
    if (!!error && typeof error.message === "string") {
      return res.json({ success: false, message: error.message });
    } else {
      return res.json({ success: false, message: "error inserting user 2" });
    }
  }
};
const getFuelLevelHistory = async (req, res) => {
  try {
    const getAllHistory = await FuelHistory.find(
      {
        status: "active",
        tag: req.user.tag,
        serviceid: req.user.serviceid,
        // companyId: req.user.companyId,
        dateCreatedAt: {
          $gte: new Date(dayjs().subtract(30, "day").startOf("day").valueOf()),
          $lte: new Date(dayjs().subtract(1, "day").endOf("day").valueOf()),
        },
      },
      {
        fuelCurrentValue: 1,
        fuelDailyConsumption: 1,
        genRuntimefor: 1,
        dateCreatedAt: 1,
      }
    ).sort({ dateCreatedAt: -1 });
    console.log({ getAllHistory });

    if (!!getAllHistory) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        success: true,
        data: getAllHistory,
      });
    } else {
      res.statusCode = 403;
      return res.json({
        success: false,

        message: "fuel  level  not available!!",
      });
    }
  } catch (error) {
    console.log("error ", error);
    if (!!error && typeof error.message === "string") {
      return res.json({ success: false, message: error.message });
    } else {
      return res.json({ success: false, message: "error inserting user 2" });
    }
  }
};

const getGenRunTimeStatus = async (req, res) => {
  try {
    const genRunTimeStatus = await GeneratorRunTimeStatus.findOne(
      {
        status: "active",
        tag: req.user.tag,
        serviceid: req.user.serviceid,
        // companyId: req.user.companyId,
        dateCreatedAt: {
          $gte: dayjs().startOf("d"),
          $lte: dayjs().endOf("d"),
        },
      },
      {
        generatorStatus: 1,
        dateCreatedAt: 1,
      }
    ).sort({ dateCreatedAt: -1 });
    console.log({ genRunTimeStatus });
    if (!!genRunTimeStatus) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        success: true,
        genRunTimeStatus,
      });
    } else {
      res.statusCode = 403;
      return res.json({
        success: false,

        message: "Generator status not available!!",
      });
    }
  } catch (error) {
    console.log("error ", error);
    if (!!error && typeof error.message === "string") {
      return res.json({ success: false, message: error.message });
    } else {
      return res.json({ success: false, message: "error inserting user 2" });
    }
  }
};

const getGenRuntimePerDay = async (req, res) => {
  try {
    const getGenRunTimeToday = await GeneratorRunTime.findOne({
      status: "active",
      serviceid: req.user.serviceid,
      tag: req.user.tag,
      // companyId: req.user.companyId,
      dateCreatedAt: {
        $gte: dayjs().startOf("d"),
        $lte: dayjs().endOf("d"),
      },
    });
    const genRunTimeStatus = await GeneratorRunTimeStatus.findOne(
      {
        status: "active",
        tag: req.user.tag,
        serviceid: req.user.serviceid,
        // companyId: req.user.companyId,
        dateCreatedAt: {
          $gte: dayjs().startOf("d"),
          $lte: dayjs().endOf("d"),
        },
      },
      {
        generatorStatus: 1,
        dateCreatedAt: 1,
      }
    ).sort({ dateCreatedAt: -1 });
    console.log({ getGenRunTimeToday });
    if (!!getGenRunTimeToday || !!genRunTimeStatus) {
      const genRuntime =
        getGenRunTimeToday !== null
          ? getGenRunTimeToday?.newTimeDiff + getGenRunTimeToday?.timeDiff
          : 0;
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        success: true,
        data: {
          genRuntime: calculateDuration2(genRuntime),
          genStatus:
            genRunTimeStatus !== null
              ? genRunTimeStatus.generatorStatus
              : "OFF",
        },
      });
    } else {
      res.statusCode = 403;
      return res.json({
        success: false,
        data: {
          genRuntime: calculateDuration2(0),
          genStatus: "OFF",
        },
      });
    }
  } catch (error) {
    console.log("error ", error);
    if (!!error && typeof error.message === "string") {
      return res.json({ success: false, message: error.message });
    } else {
      return res.json({
        success: false,
        message: "error getting generator run time",
      });
    }
  }
};

const exportToCsv = async (req, res) => {
  console.log("req", req.path);
  let filename = "fuelLevels.csv";
  let filename2 = "fuel-consumptions.csv";

  // /exporttocsv
  if (req.path === "/exporttocsv") {
    try {
      const yesterday = dayjs().subtract(1, "day").endOf("d").toDate();
      const thirtyDaysAgo = dayjs(yesterday)
        .subtract(30, "days")
        .startOf("d")
        .toDate();

      const getfuelLevelChatFrmDb = await FuelLevel.find({
        status: "active",
        // lastForTheDay: true,
        // dateCreatedAt: {
        //   $gte: dayjs().subtract(1, "M").startOf("M"),
        //   $lte: dayjs().subtract(1, "M").endOf("M"),
        // },
      }).lean();
      const getfuelLevelConsumptionChatFrmDb = await FuelLevelConsumption.find({
        status: "active",
      }).lean();
      // console.log({ getfuelLevelChatFrmDb, getfuelLevelConsumptionChatFrmDb });
      if (!!getfuelLevelChatFrmDb || !!getfuelLevelConsumptionChatFrmDb) {
        if (
          getfuelLevelChatFrmDb.length !== 0 ||
          getfuelLevelConsumptionChatFrmDb !== 0
        ) {
          let datas = getfuelLevelChatFrmDb.map((v, index) => {
            const fuelConsumpt = getfuelLevelConsumptionChatFrmDb[index];
            console.log({ fuelConsumpt });
            let data = {
              id: v._id,
              status: v.status,
              "Fuel level": v.currentValue,
              "Fuel consump": fuelConsumpt?.currentValue,
              "Date created": dayjs(v.dateCreatedAt).format(
                "ddd, MMM D, YYYY h:mm A"
              ),
            };
            return data;
          });
          let datasFuelConsump = getfuelLevelConsumptionChatFrmDb.map((v) => {
            let data = {
              id: v._id,
              status: v.status,
              "Fuel comsumption": v.currentValue,
              "Date created": dayjs(v.dateCreatedAt).format(
                "ddd, MMM D, YYYY h:mm A"
              ),
            };
            return data;
          });

          console.log(
            { datas },
            "conDatas"
            // JSON.stringify(conDatas)
          );
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/csv");
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + filename
          );

          // res.csv(datasFuelConsump, true);
          res.csv(datas, true);
        } else {
          res.statusCode = 403;
          return res.json({
            success: false,

            message: "No data available to download for csv fuel  level  !!",
          });
        }
      } else {
        res.statusCode = 403;
        return res.json({
          success: false,

          message: "fuel  level  not available!!",
        });
      }
    } catch (error) {
      console.log("error ", error);
      if (!!error && typeof error.message === "string") {
        return res.json({ success: false, message: error.message });
      } else {
        return res.json({ success: false, message: "error inserting user 2" });
      }
    }
  } else if (req.path === "/exporttocsv-fuel-consumption") {
    try {
      const getfuelLevelConsumptionChatFrmDb = await FuelLevelConsumption.find({
        status: "active",
        // lastForTheDay: true,
        // dateCreatedAt: {
        //   $gte: dayjs().subtract(1, "M").startOf("M"),
        //   $lte: dayjs().subtract(1, "M").endOf("M"),
        // },
      }).lean();
      //  exporttocsv-fuel-consumption
      console.log({ getfuelLevelConsumptionChatFrmDb });
      if (!!getfuelLevelConsumptionChatFrmDb) {
        if (getfuelLevelConsumptionChatFrmDb.length !== 0) {
          let datas = getfuelLevelConsumptionChatFrmDb?.map((v) => {
            let data = {
              id: v._id,
              status: v.status,
              "current-value": v.currentValue,
              "Date created": dayjs(v.dateCreatedAt).format(
                "ddd, MMM D, YYYY h:mm A"
              ),
            };
            return data;
          });

          console.log({ datas });
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/csv");
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + filename2
          );

          res.csv(datas, true);
        } else {
          res.statusCode = 403;
          return res.json({
            success: false,

            message:
              "No data  available for fuel  level consumption   to convert csv try again later!!",
          });
        }
      } else {
        res.statusCode = 403;
        return res.json({
          success: false,

          message: "fuel  level  not available!!",
        });
      }
    } catch (error) {
      console.log("error ", error);
      if (!!error && typeof error.message === "string") {
        return res.json({ success: false, message: error.message });
      } else {
        return res.json({ success: false, message: "error inserting user 2" });
      }
    }
  } else {
    console.log("log not found");
  }
};

const getCompanyFuelDataByApiKey = async (req, res) => {
  try {
    const { query, apiKey } = req.query;
    console.log({ query, apiKey });
    if (!query || !apiKey) {
      res.statusCode = 403;
      return res.json({
        success: false,

        message: "Please provide apikey and query string!!",
      });
    } else {
      const companyObject = await Company.findOne({ apikey: apiKey }).lean();
      console.log({ companyObject });
      if (!!companyObject) {
        const models = {
          fuellevel: FuelLevel,
          fuelConsumption: FuelLevelConsumption,
          fuelHistory: FuelHistory,
        };
        let queryModel = models[query];
        console.log({ queryModel });
        const getData = await queryModel.find(
          { tag: companyObject.tag },
          {
            _id: 0,
            currentValue: 1,
            energyCurrentValue: 1,
            energyCurrentValue2: 1,
            power: 1,
            power2: 1,
            current: 1,
            current2: 1,
            voltage: 1,
            voltage2: 1,
            serviceid: 1,
            dateCreatedAt: 1,
          }
        );
        if (!!getData) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          return res.json({
            success: true,
            message: `This company ${companyObject.name} have  ${companyObject.iotservices.length} energy iot service monitoring`,
            data: getData,
          });
        } else {
          res.statusCode = 403;
          return res.json({
            success: false,

            message: "No data available for this energy!!",
          });
        }
      } else {
        res.statusCode = 403;
        return res.json({
          success: false,

          message: "No data available for this energy!!",
        });
      }
    }
  } catch (error) {}
};

module.exports = {
  FuelOrDieselSubscribeMqtt,
  getFuelLevel,
  getFuelLevelConsumption,
  getFuelLevelConsumptionLineChat,
  getFuelLevelConsumptionChat,
  getFuelLevelChat,
  getFuelLevelHistory,
  exportToCsv,
  getGenRunTimeStatus,
  getGenRuntimePerDay,
  getFuelLevelConsumptionLineChatTest,
  getCompanyFuelDataByApiKey,
};
