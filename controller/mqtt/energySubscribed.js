const dayjs = require("dayjs");
const mqtt = require("mqtt");
const { getDailyEnergyConsumption } = require("../../helper/energyConsumption");
const {
  formatDataToObject,
  splitWords,
  reconnects,
  gridAndGenRuntimesLogicGeneral,
  gridstatus,
  genstatus,
  publishAfter30Mins,
  calculateDuration2,
} = require("../../helper/helper");
const { timeConstruct } = require("../../helper/timeConstruct");
const Connection = require("../../model/Connection");
const Current = require("../../model/energy/CurrentConsumption");
const GridEnergy = require("../../model/energy/EnergyConsumption");
const EnergyService = require("../../model/energy/EnergySensor");
const GridRunTime = require("../../model/energy/GridRuntime");
const GridRunTimeStatus = require("../../model/energy/GridRuntimeStatus");
const IotServiceEnergyServiceCalcuation = require("../../model/energy/IotServiceEnergyCalcuation");
const Power = require("../../model/energy/PowerConsumption");
const Voltage = require("../../model/energy/VoltageConsumption");
const GeneratorRunTime = require("../../model/GeneratorRuntime");
const GeneratorRunTimeStatus = require("../../model/GeneratorRuntimeStatus");
const GridAndGenOnTogether = require("../../model/GridAndGenOnTime");
let lastMessageTime = dayjs();
let sendData30mins = dayjs();
let getConnection = {};
const cron = require("node-cron");
const Company = require("../../model/Company");

const EnergySubscribeAndPublishMqtt = async () => {
  let host = "friendly-tailor.cloudmqtt.com"; //"4g.bridge.iotrouter.com";
  // let host2 = "demo.thingsboard.io";
  let host2 = "thingsboard.cloud";
  let port = "1883"; //"1883"; //process.env.PORT;
  let port2 = "1883"; //"1883"; //process.env.PORT;
  // try {

  // } catch (error) {

  // }
  const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
  const connectUrl = `mqtt://${host}:${port}`;
  const connectUrl2 = `mqtt://${host2}:${port2}`;
  // const subscribeTopic = "vencogrid1";

  const subscribeTopic = "Horizon estate";
  try {
    const client = mqtt.connect(connectUrl, {
      clientId,
      clean: true,
      connectTimeout: 4000,
      // username: "pmhwzljg",
      // password: "dppg5l-50r6b",
      username: "sfclxtvz",
      password: "vwfKM23GmMu6",
      reconnectPeriod: 1000,
    });

    client.on("connect", () => {
      console.log("connected");
    });

    let countOffline = 1;
    client.on("offline", async () => {
      // await sendEmailNotificationWhenOflline(countOffline, subscribeTopic);

      console.log("client is ofline");
    });
    getConnection = await Connection.find({
      "iotServices.energyIOT.isEnergyIOT": true,
    });

    console.log({ getConnection });
    // let toDecimal;
    client.on("connect", async () => {
      console.log({ getConnection });
      getConnection.length > 0 &&
        getConnection.map((v) => {
          client.subscribe([v.topic], { qos: 1 }, (err, granted) => {
            if (err) {
              console.log(err, "err");
            }
            console.log(granted, "granted");
          });
        }),
        console.log("it subscribe");
    });
    client.on("message", async (topic, message, packet) => {
      var msgObject = JSON.parse(message.toString());
      console.log({ topic, message, msgObject });
      lastMessageTime = dayjs();
      let stringified = JSON.stringify(msgObject.data);
      let longText;
      lastMessageTime = dayjs();
      if (stringified.includes("DI1") || stringified.includes("DI2")) {
        longText = "";
      } else {
        longText = JSON.stringify(msgObject.data);
      }
      console.log({ longText });
      // 010320;
      let words = await splitWords(longText.replace(/"/g, ""));

      // const { years, month, days, hour, minutes } = timeConstruct();
      // const { NewMinutess30 } = await publishAfter30Mins(sendData30mins);
      console.log({ words });

      const { NewMinutess30 } = await publishAfter30Mins(sendData30mins);
      const energyServiceObject = await EnergyService.findOne({
        deviceId: msgObject.devId,
        topic,
      });
      console.log({ energyServiceObject });
      if (!!energyServiceObject) {
        const { years, month, days, hour, minutes } = timeConstruct();
        if (
          NewMinutess30 === "00:30" ||
          NewMinutess30 === "00:31" ||
          NewMinutess30 === "00:32" ||
          NewMinutess30 === "00:33" ||
          NewMinutess30 === "00:34"
        ) {
          if (words.sixChar === "010378") {
            // console.log("hexToDecimal", hexToDecimal("000004CA"));
            let energys = formatDataToObject(words.eightWords, words.sixChar);
            console.log({ energys }, "typeof", typeof energys);

            await getDailyEnergyConsumption(
              energys,
              words.sixChar,
              topic,
              GridEnergy,
              energyServiceObject,
              IotServiceEnergyServiceCalcuation,
              GridRunTimeStatus,
              GeneratorRunTimeStatus
            );
            // publishDailyConsump(energys.energy1 / 10, client_publish);
          } else if (words.sixChar === "010320") {
            // console.log("hexToDecimal", hexToDecimal("000004CA"));
            let power = formatDataToObject(words.eightWords, words.sixChar);
            console.log({ power });
            await getDailyEnergyConsumption(
              power,
              words.sixChar,
              topic,
              Power,
              energyServiceObject,
              IotServiceEnergyServiceCalcuation,
              GridRunTimeStatus,
              GeneratorRunTimeStatus
            );
          } else if (words.sixChar === "01030C") {
            let voltages = formatDataToObject(words.eightWords, words.sixChar);
            console.log({ voltages });
            await getDailyEnergyConsumption(
              voltages,
              words.sixChar,
              topic,
              Voltage,
              energyServiceObject,
              IotServiceEnergyServiceCalcuation,
              GridRunTimeStatus,
              GeneratorRunTimeStatus
            );
          } else if (words.sixChar === "010310") {
            let currents = formatDataToObject(words.eightWords, words.sixChar);
            console.log({ currents });
            await getDailyEnergyConsumption(
              currents,
              words.sixChar,
              topic,
              Current,
              energyServiceObject,
              IotServiceEnergyServiceCalcuation,
              GridRunTimeStatus,
              GeneratorRunTimeStatus
            );
          } else if (words.sixChar === "020378") {
            let secondEnergy = formatDataToObject(
              words.eightWords,
              words.sixChar
            );
            console.log({ secondEnergy });

            await getDailyEnergyConsumption(
              secondEnergy,
              words.sixChar,
              topic,
              GridEnergy,
              energyServiceObject,
              IotServiceEnergyServiceCalcuation,
              GridRunTimeStatus,
              GeneratorRunTimeStatus
            );
          } else if (words.sixChar === "020320") {
            let secondPower = formatDataToObject(
              words.eightWords,
              words.sixChar
            );
            console.log({ secondPower });
            await getDailyEnergyConsumption(
              secondPower,
              words.sixChar,
              topic,
              Power,
              energyServiceObject,
              IotServiceEnergyServiceCalcuation,
              GridRunTimeStatus,
              GeneratorRunTimeStatus
            );
          } else if (words.sixChar === "02030C") {
            let secondVoltage = formatDataToObject(
              words.eightWords,
              words.sixChar
            );
            console.log({ secondVoltage });
            await getDailyEnergyConsumption(
              secondVoltage,
              words.sixChar,
              topic,
              Voltage,
              energyServiceObject,
              IotServiceEnergyServiceCalcuation,
              GridRunTimeStatus,
              GeneratorRunTimeStatus
            );
          } else if (words.sixChar === "020310") {
            let secondCurrent = formatDataToObject(
              words.eightWords,
              words.sixChar
            );
            console.log({ secondCurrent });
            await getDailyEnergyConsumption(
              secondCurrent,
              words.sixChar,
              topic,
              Current,
              energyServiceObject,
              IotServiceEnergyServiceCalcuation,
              GridRunTimeStatus,
              GeneratorRunTimeStatus
            );
          }
        } else if (NewMinutess30 >= "00:35") {
          sendData30mins = dayjs();
        }
        if (msgObject.data.DI1 && msgObject.data.DI2) {
          console.log(
            "msgObject.data.DI1 && msgObject.data.DI2",
            msgObject.data.DI1 || msgObject.data.DI2
          );
          const gridAndGenDataExistForToday =
            await GridAndGenOnTogether.findOne({
              year: years,
              month: month,
              day: days,
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
              status: "active",
            });
          if (msgObject.data.DI1 === "1" || msgObject.data.DI2 == "1") {
            await gridAndGenRuntimesLogicGeneral(
              GridRunTime,
              GridRunTimeStatus,
              msgObject.data,
              topic,
              GeneratorRunTime,
              GeneratorRunTimeStatus,
              energyServiceObject
            );

            if (!!gridAndGenDataExistForToday) {
              gridAndGenDataExistForToday.genAndGridIsONTime = dayjs();
              const updateTimeRecived = gridAndGenDataExistForToday.save();
              if (!!updateTimeRecived) {
                console.log("It updated successfully");
              } else {
                console.log("it did not updated, there is error");
              }
            } else {
              const saveGridStatusToDB = await new GridAndGenOnTogether({
                topic,
                genAndGridIsONTime: dayjs(),
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveGridStatusToDB) {
                console.log("Grid status save successfully");
              } else {
                console.log("Grid. status was not  successful");
              }
            }
          }
          if (energyServiceObject.isHavingGenAndGrid === true) {
            if (msgObject.data.DI1 === "0") {
              await gridstatus(
                GridRunTimeStatus,
                msgObject.data.DI1,
                topic,
                energyServiceObject
              );
            }
            if (msgObject.data.DI2 === "0") {
              await genstatus(
                GeneratorRunTimeStatus,
                msgObject.data.DI2,
                topic,
                energyServiceObject
              );
            }
          } else {
            if (msgObject.data.DI1 === "0") {
              await gridstatus(
                GridRunTimeStatus,
                msgObject.data.DI1,
                topic,
                energyServiceObject
              );
            }
          }

          // if (msgObject.data.DI1 === "1" && msgObject.data.DI2 === "1") {
          //   await sendEmailNotificationForGridAndGenOn(
          //     genAndGridIsONTime,
          //     msgObject.data.DI2,
          //     msgObject.data.DI1,
          //     "Ajose"
          //   );

          //   if (hour === 0 && minutes == 0) {
          //     await gridRuntimesLogicAjose(
          //       AjoseGridRunTime,
          //       AjoseGridRunTimeStatus,

          //       msgObject.data.DI1,

          //       topic
          //     );
          //   } else {
          //     await gridRuntimesLogicAjose(
          //       AjoseGridRunTime,
          //       AjoseGridRunTimeStatus,

          //       msgObject.data.DI1,

          //       topic
          //     );

          //     await genRuntimesLogicAjose(
          //       AjoseGeneratorRunTime,
          //       AjoseGeneratorRunTimeStatus,
          //       msgObject.data.DI2,
          //       topic
          //     );
          //   }
          // }
        }

        energyServiceObject.dataReievedAt = dayjs();
        const updateTimeRecived = energyServiceObject.save();
        if (!!updateTimeRecived) {
          console.log("It updated successfully");
        } else {
          console.log("it did not updated, there is error");
        }
      }

      console.log({ words });
    });
    client.on("packetsend", (packet) => {
      console.log(packet, "packet2");
    });
    client.on("reconnect", function () {
      console.log("reconnect");
    });

    cron.schedule("* * * * *", async () => {
      console.log("it enter cron jobb");
      getConnection = await Connection.find({
        "iotServices.energyIOT.isEnergyIOT": true,
      });
      getConnection.length > 0 && (await reconnects(getConnection, client));
    });

    // setInterval(async () => {
    //   await sendEmailNotification(lastMessageTime, subscribeTopic);
    // }, 60000);
  } catch (error) {
    console.log("error", error);
  }
};

const getVoltage = async (req, res) => {
  try {
    const getVoltageFrmDb = await Voltage.findOne(
      {
        status: "active",
        tag: req.user.tag,
        // companyId: req.user.companyId,
        serviceid: req.user.serviceid,
        energyOrGenType: { $in: ["gridVoltage", "genVoltage"] },
        companyName: req.user.company.toLowerCase(),
        dateCreatedAt: {
          $gte: dayjs().startOf("d"),
          $lte: dayjs().endOf("d"),
        },
      },
      { energyOrGenType: 1, voltage: 1, voltage2: 1, dateCreatedAt: 1 }
    ).sort({ dateCreatedAt: -1 });
    console.log({ getVoltageFrmDb });
    if (!!getVoltageFrmDb) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        success: true,
        data: getVoltageFrmDb,
      });
    } else {
      res.statusCode = 403;
      return res.json({
        success: false,

        message: " voltage data not available for today!!",
      });
    }
  } catch (error) {
    console.log("error ", error);
    if (!!error && typeof error.message === "string") {
      return res.json({ success: false, message: error.message });
    } else {
      return res.json({
        success: false,
        message: "error getting voltage  data  2",
      });
    }
  }
};
const getCurrent = async (req, res) => {
  try {
    const getCurrentFrmDb = await Current.findOne(
      {
        status: "active",
        tag: req.user.tag,
        // companyId: req.user.companyId,
        serviceid: req.user.serviceid,
        companyName: req.user.company.toLowerCase(),
        energyOrGenType: { $in: ["gridCurrent", "genCurrent"] },
        dateCreatedAt: {
          $gte: dayjs().startOf("d"),
          $lte: dayjs().endOf("d"),
        },
      },
      { energyOrGenType: 1, current: 1, current2: 1, dateCreatedAt: 1 }
    ).sort({ dateCreatedAt: -1 });
    console.log({ getCurrentFrmDb });
    if (!!getCurrentFrmDb) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        success: true,
        data: getCurrentFrmDb,
      });
    } else {
      res.statusCode = 403;
      return res.json({
        success: false,

        message: " Current data not available for today!!",
      });
    }
  } catch (error) {
    console.log("error ", error);
    if (!!error && typeof error.message === "string") {
      return res.json({ success: false, message: error.message });
    } else {
      return res.json({
        success: false,
        message: "error getting current  data  2",
      });
    }
  }
};
const getPower = async (req, res) => {
  try {
    const getCurrentFrmDb = await Power.findOne(
      {
        status: "active",
        tag: req.user.tag,
        // companyId: req.user.companyId,
        companyName: req.user.company.toLowerCase(),
        serviceid: req.user.serviceid,
        energyOrGenType: { $in: ["gridPower", "genPower"] },
        dateCreatedAt: {
          $gte: dayjs().startOf("d"),
          $lte: dayjs().endOf("d"),
        },
      },
      { energyOrGenType: 1, power: 1, power2: 1, dateCreatedAt: 1 }
    ).sort({ dateCreatedAt: -1 });
    console.log({ getCurrentFrmDb });
    if (!!getCurrentFrmDb) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        success: true,
        data: getCurrentFrmDb,
      });
    } else {
      res.statusCode = 403;
      return res.json({
        success: false,

        message: " Current data not available for today!!",
      });
    }
  } catch (error) {
    console.log("error ", error);
    if (!!error && typeof error.message === "string") {
      return res.json({ success: false, message: error.message });
    } else {
      return res.json({
        success: false,
        message: "error getting current  data  2",
      });
    }
  }
};
const getGridAndGenEnergyConsumption = async (req, res) => {
  try {
    const getGridEnergyConsumptionFrmDb = await GridEnergy.findOne(
      {
        // firstdata: false,
        status: "active",
        energyOrGenType: { $in: ["gridEnergy", "genEnergy"] },
        tag: req.user.tag,
        // companyId: req.user.companyId,
        companyName: req.user.company.toLowerCase(),
        serviceid: req.user.serviceid,
        dateCreatedAt: {
          $gte: dayjs().startOf("d"),
          $lte: dayjs().endOf("d"),
        },
      },
      {
        energyOrGenType: 1,
        energyCurrentValue: 1,
        energyCurrentValue2: 1,
        dateCreatedAt: 1,
      }
    ).sort({ dateCreatedAt: -1 });
    console.log({ getGridEnergyConsumptionFrmDb });
    if (!!getGridEnergyConsumptionFrmDb) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        success: true,
        data: getGridEnergyConsumptionFrmDb,
      });
    } else {
      res.statusCode = 403;
      return res.json({
        success: false,

        message: "Grid energy  consumption   not available today!!",
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

const getGridRunTimeStatus = async (req, res) => {
  try {
    const gridRunTimeStatus = await GridRunTimeStatus.findOne(
      {
        status: "active",
        tag: req.user.tag,
        // companyId: req.user.companyId,
        companyName: req.user.company.toLowerCase(),
        serviceid: req.user.serviceid,
        dateCreatedAt: {
          $gte: dayjs().startOf("d"),
          $lte: dayjs().endOf("d"),
        },
      },
      { gridStatus: 1, dateCreatedAt: 1 }
    ).sort({ dateCreatedAt: -1 });
    console.log({ gridRunTimeStatus });
    if (!!gridRunTimeStatus) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        success: true,
        gridRunTimeStatus,
      });
    } else {
      res.statusCode = 403;
      return res.json({
        success: false,

        message: "Grid status not available!!",
      });
    }
  } catch (error) {
    console.log("error ", error);
    if (!!error && typeof error.message === "string") {
      return res.json({ success: false, message: error.message });
    } else {
      return res.json({
        success: false,
        message: "error getting grid run time status 2",
      });
    }
  }
};
const getGenRunTimeStatus = async (req, res) => {
  try {
    const gridRunTimeStatus = await GeneratorRunTimeStatus.findOne(
      {
        status: "active",
        tag: req.user.tag,
        // companyId: req.user.companyId,
        companyName: req.user.company.toLowerCase(),
        dateCreatedAt: {
          $gte: dayjs().startOf("d"),
          $lte: dayjs().endOf("d"),
        },
      },
      { generatorStatus: 1, dateCreatedAt: 1 }
    ).sort({ dateCreatedAt: -1 });
    console.log({ gridRunTimeStatus });
    if (!!gridRunTimeStatus) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        success: true,
        gridRunTimeStatus,
      });
    } else {
      res.statusCode = 403;
      return res.json({
        success: false,

        message: "Grid status not available!!",
      });
    }
  } catch (error) {
    console.log("error ", error);
    if (!!error && typeof error.message === "string") {
      return res.json({ success: false, message: error.message });
    } else {
      return res.json({
        success: false,
        message: "error getting grid run time status 2",
      });
    }
  }
};

const getGridRuntimePerDay = async (req, res) => {
  try {
    const energyServiceObject = await EnergyService.findOne({
      tag: req.user.tag,
      //serviceid
      serviceid: req.user.serviceid,
    });
    if (!!energyServiceObject) {
      if (energyServiceObject.isHavingGenAndGrid == true) {
        const getGridRunTimeToday = await GridRunTime.findOne({
          status: "active",
          tag: req.user.tag,
          // companyId: req.user.companyId,
          companyName: req.user.company.toLowerCase(),
          serviceid: req.user.serviceid,
          dateCreatedAt: {
            $gte: dayjs().startOf("d"),
            $lte: dayjs().endOf("d"),
          },
        });
        const getGenRunTimeToday = await GeneratorRunTime.findOne({
          status: "active",
          tag: req.user.tag,
          // companyId: req.user.companyId,
          companyName: req.user.company.toLowerCase(),
          serviceid: req.user.serviceid,
          dateCreatedAt: {
            $gte: dayjs().startOf("d"),
            $lte: dayjs().endOf("d"),
          },
        });
        const genRunTimeStatus = await GeneratorRunTimeStatus.findOne(
          {
            status: "active",
            tag: req.user.tag,
            // companyId: req.user.companyId,
            companyName: req.user.company.toLowerCase(),
            serviceid: req.user.serviceid,
            dateCreatedAt: {
              $gte: dayjs().startOf("d"),
              $lte: dayjs().endOf("d"),
            },
          },
          { generatorStatus: 1, dateCreatedAt: 1 }
        ).sort({ dateCreatedAt: -1 });
        const gridRunTimeStatus = await GridRunTimeStatus.findOne(
          {
            status: "active",
            tag: req.user.tag,
            // companyId: req.user.companyId,
            companyName: req.user.company.toLowerCase(),
            serviceid: req.user.serviceid,
            dateCreatedAt: {
              $gte: dayjs().startOf("d"),
              $lte: dayjs().endOf("d"),
            },
          },
          { gridStatus: 1, dateCreatedAt: 1 }
        ).sort({ dateCreatedAt: -1 });
        console.log({ getGridRunTimeToday, getGenRunTimeToday });
        if (
          !!getGridRunTimeToday ||
          !!getGenRunTimeToday ||
          !!genRunTimeStatus
        ) {
          const gridRuntime =
            getGridRunTimeToday !== null
              ? getGridRunTimeToday?.newTimeDiff + getGridRunTimeToday?.timeDiff
              : 0;
          const genRuntime =
            getGenRunTimeToday !== null
              ? getGenRunTimeToday?.newTimeDiff + getGenRunTimeToday?.timeDiff
              : 0;
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          return res.json({
            success: true,
            data: {
              gridRuntime: calculateDuration2(gridRuntime),
              genRuntime: calculateDuration2(genRuntime),
              genStatus:
                genRunTimeStatus !== null
                  ? genRunTimeStatus.generatorStatus
                  : "OFF",
              gridStatus:
                gridRunTimeStatus !== null
                  ? gridRunTimeStatus.gridStatus
                  : "OFF",
            },
          });
        } else {
          res.statusCode = 403;
          return res.json({
            success: false,
            data: {
              gridRuntime: calculateDuration2(0),
              genRuntime: calculateDuration2(0),
              genStatus: "OFF",
              gridStatus: "OFF",
            },
          });
        }
      } else {
        const getGridRunTimeToday = await GridRunTime.findOne({
          status: "active",
          tag: req.user.tag,
          // companyId: req.user.companyId,
          companyName: req.user.company.toLowerCase(),
          serviceid: req.user.serviceid,
          dateCreatedAt: {
            $gte: dayjs().startOf("d"),
            $lte: dayjs().endOf("d"),
          },
        });
        const gridRunTimeStatus = await GridRunTimeStatus.findOne(
          {
            status: "active",
            tag: req.user.tag,
            // companyId: req.user.companyId,
            companyName: req.user.company.toLowerCase(),
            serviceid: req.user.serviceid,
            dateCreatedAt: {
              $gte: dayjs().startOf("d"),
              $lte: dayjs().endOf("d"),
            },
          },
          { gridStatus: 1, dateCreatedAt: 1 }
        ).sort({ dateCreatedAt: -1 });
        console.log({ getGridRunTimeToday });
        if (!!getGridRunTimeToday) {
          const gridRuntime =
            getGridRunTimeToday !== null
              ? getGridRunTimeToday?.newTimeDiff + getGridRunTimeToday?.timeDiff
              : 0;
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          return res.json({
            success: true,
            data: {
              gridRuntime: calculateDuration2(gridRuntime),

              gridStatus:
                gridRunTimeStatus !== null
                  ? gridRunTimeStatus.gridStatus
                  : "OFF",
            },
          });
        } else {
          res.statusCode = 403;
          return res.json({
            success: false,
            data: {
              gridRuntime: calculateDuration2(0),

              gridStatus: "OFF",
            },
          });
        }
      }
    } else {
    }
  } catch (error) {
    console.log("error ", error);
    if (!!error && typeof error.message === "string") {
      return res.json({ success: false, message: error.message });
    } else {
      return res.json({
        success: false,
        message: "error getting grid run time",
      });
    }
  }
};

const getGenRuntimePerDay = async (req, res) => {
  try {
    const getGenRunTimeToday = await GeneratorRunTime.findOne({
      status: "active",
      tag: req.user.tag,
      // companyId: req.user.companyId,
      // companyName: req.user.company.toLowerCase(),
      dateCreatedAt: {
        $gte: dayjs().startOf("d"),
        $lte: dayjs().endOf("d"),
      },
    });
    console.log({ getGridRunTimeToday });
    if (!!getGenRunTimeToday) {
      const genRuntime =
        getGenRunTimeToday?.newTimeDiff + getGenRunTimeToday?.timeDiff;
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        success: true,
        data: calculateDuration2(genRuntime),
      });
    } else {
      res.statusCode = 403;
      return res.json({
        success: false,

        message: "Gen run time is not available!!",
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

const getGridEnergyChat = async (req, res) => {
  try {
    const getGridEnergyConsumptChatFrmDb = await GridEnergy.find(
      {
        status: "active",
        tag: req.user.tag,
        // companyId: req.user.companyId,
        energyOrGenType: { $in: ["gridEnergy", "genEnergy"] },
        serviceid: req.user.serviceid,
        companyName: req.user.company.toLowerCase(),
        dateCreatedAt: {
          $gte: dayjs().subtract(7, "d").startOf("d"),
        },
      },
      {
        _id: 0,
        energyOrGenType: 1,
        energyCurrentValue: 1,
        energyCurrentValue2: 1,
        dateCreatedAt: 1,
      }
    ).sort({ dateCreatedAt: -1 });

    if (!!getGridEnergyConsumptChatFrmDb) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        success: true,
        data: getGridEnergyConsumptChatFrmDb,
      });
    } else {
      res.statusCode = 403;
      return res.json({
        success: false,

        message: "Grid energy consumption chat  not available!!",
      });
    }
  } catch (error) {
    console.log("error ", error);
    if (!!error && typeof error.message === "string") {
      return res.json({ success: false, message: error.message });
    } else {
      return res.json({
        success: false,
        message: "error getting grid energy consumption 2",
      });
    }
  }
};

module.exports = {
  EnergySubscribeAndPublishMqtt,
  getGridAndGenEnergyConsumption,
  getGridRunTimeStatus,
  getGenRunTimeStatus,
  getGridRuntimePerDay,
  getGenRuntimePerDay,
  getGridEnergyChat,
  getVoltage,
  getCurrent,
  getPower,
};

const publishDailyConsump = async (currentData, client_publish) => {
  const energyDailyConsumpExistForToday =
    await HouseEstateEnergyRealTimeConsump.findOne({
      lastForTheDay: true,
      status: "active",
      dateCreatedAt: {
        $gte: dayjs().subtract(1, "d").startOf("d"),
        $lte: dayjs().subtract(1, "d").endOf("d"),
      },
    }).sort({ dateCreatedAt: -1 });
  if (!!energyDailyConsumpExistForToday) {
    const calculateDailyConsumption =
      currentData -
      energyDailyConsumpExistForToday.energy1["energycurrentValue"];
    console.log({ calculateDailyConsumption });
    await publishMqtt(
      client_publish,
      {
        [`first-energy-daily-consumption`]: convertToPositive(
          calculateDailyConsumption
        ),
      },
      "it publish house estate first energy consumption and response sent "
    );
  } else {
  }
};
const publishDailyConsump2 = async (currentData, client_publish) => {
  const energyDailyConsumpExistForToday =
    await HouseEstateEnergyRealTimeConsump.findOne({
      lastForTheDay: true,
      status: "active",
      dateCreatedAt: {
        $gte: dayjs().subtract(1, "d").startOf("d"),
        $lte: dayjs().subtract(1, "d").endOf("d"),
      },
    }).sort({ dateCreatedAt: -1 });
  if (!!energyDailyConsumpExistForToday) {
    const calculateDailyConsumption =
      currentData -
      energyDailyConsumpExistForToday.energy2["energycurrentValue"];
    console.log({ calculateDailyConsumption });
    await publishMqtt(
      client_publish,
      {
        [`second-energy-daily-consumption`]: convertToPositive(
          calculateDailyConsumption
        ),
      },
      "it publish house estate first energy consumption and response sent "
    );
  } else {
  }
};
