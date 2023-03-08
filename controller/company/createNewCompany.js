const crypto = require("crypto");
const dayjs = require("dayjs");
const { randomString, isValidEmail } = require("../../functions");
const Admin = require("../../model/Admin");
const Company = require("../../model/Company");
const Wallet = require("../../model/Wallet");
const bcrypt = require("bcrypt");
const Connection = require("../../model/Connection");
const IotServiceFuelCalcuation = require("../../model/FuelOrDisiel/IotServiceFuelCalcuation");
const Tank = require("../../model/FuelOrDisiel/Tanks");
const IotServiceEnergyServiceCalcuation = require("../../model/energy/IotServiceEnergyCalcuation");
const EnergySensor = require("../../model/energy/EnergySensor");
const {
  CompanyEmailNotification,
} = require("../../helper/functions/sendemailForCompany");
const Current = require("../../model/energy/CurrentConsumption");
const Power = require("../../model/energy/PowerConsumption");
const GridEnergy = require("../../model/energy/EnergyConsumption");
const Voltage = require("../../model/energy/VoltageConsumption");
const FuelLevel = require("../../model/FuelOrDisiel/FuelLevel");
const FuelLevelConsumption = require("../../model/FuelOrDisiel/FuelLevelConsumption");
const FuelHistory = require("../../model/FuelOrDisiel/FuelHistory");
const GeneratorRunTime = require("../../model/GeneratorRuntime");
const GridRunTime = require("../../model/energy/GridRuntime");
const GridRunTimeStatus = require("../../model/energy/GridRuntimeStatus");
const GeneratorRunTimeStatus = require("../../model/GeneratorRuntimeStatus");
const { calculateDuration2 } = require("../../helper/helper");

const createNewCompany = async (req, res) => {
  const {
    companyName,
    serviceType,
    branch,
    email,
    password,
    threshold_number,
    siteName,
    howManySensor,

    suffix,
    source,
  } = req.body;
  console.log("JSON.stringify(req.body)", JSON.stringify(req.body));

  if (
    !companyName ||
    !serviceType ||
    !branch ||
    !threshold_number ||
    !siteName ||
    !password ||
    !suffix ||
    !source
  ) {
    return res.status(401).json({
      success: false,
      message: `All fields is required`,
    });
  } else if (!email || !isValidEmail(email)) {
    res.statusCode = 403;
    return res.json({
      success: false,
      message: "Please provide valid email .",
    });
  } else if (!password || typeof password != "string" || password.length < 6) {
    res.statusCode = 403;
    return res.send({
      success: false,
      message:
        "Please Password must be at least eight character long and must contain letters, number, specail charaters and uppercase.",
    });
  } else {
    let passwordHash = await bcrypt.hashSync(password, 10);
    const randomNumber = (min, max) => {
      return Math.floor(Math.random() * (max - min) + min);
    };
    const tagName =
      companyName == branch
        ? `${companyName}${suffix}`.toUpperCase()
        : `${companyName}-${branch}${suffix}`.toUpperCase();
    if (JSON.stringify(req.body).includes("internal")) {
      if (JSON.stringify(req.body).includes("iot_fuel")) {
        const generateRandomNumber = await crypto.randomInt(10000000, 99999999);
        const adminObject = await Admin.findOne({ email: email });
        if (!!adminObject) {
          res.statusCode = 401;
          return res.json({
            success: false,
            message: "Please email already exist for this admin",
          });
        } else {
          const newCompany = await Company.create({
            name: companyName,
            apikey: `iobotech-${tagName}-${randomString(16)}`,
            Gen_Date: dayjs(),
            serviceType,
            suffix,
            authToken: {
              auth_token: tagName + "-" + generateRandomNumber,
            },
            iotServices: {
              fuelTank: {
                isFuelIOT: true,
                siteName,
              },
            },
            branch,
            howManySensor,
            tag: tagName,
            threshold: {
              iot: threshold_number,
            },
            source,
          });
          if (!!newCompany) {
            const WalletObject = await new Wallet({
              status: "active",
              walletid: `WID-${randomNumber(100000000, 999999999)}`,
              companyId: newCompany._id,
              company: companyName,
              tag: tagName,
              owner: `UID-${randomNumber(100000000, 999999999)}`,
            }).save();
            if (!!WalletObject) {
              const SaveadminData = await new Admin({
                status: "active",
                adminid: `AID-${randomNumber(10000000, 99999999)}`,
                level: "sub",
                role: "administrator",
                email,
                password,
                company: companyName,
                tag: tagName,
              }).save();
              if (!!SaveadminData) {
                await CompanyEmailNotification(
                  true,
                  SaveadminData,
                  email,
                  newCompany
                );
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                return res.json({
                  success: true,
                  // authToken: newCompany["authToken"].auth_token,
                  message:
                    "Your request is successfull, check your email for your admin details Thanks ",
                });
              } else {
                res.statusCode = 401;
                res.setHeader("Content-Type", "application/json");
                return res.json({
                  success: false,

                  message:
                    "Unable to create admin please check and try again later!! ",
                });
              }
            } else {
              res.statusCode = 401;
              res.setHeader("Content-Type", "application/json");
              return res.json({
                success: false,
                message:
                  "Unable to create wallets for this company, please check and try again later!! ",
              });
            }
          } else {
            res.statusCode = 401;
            res.setHeader("Content-Type", "application/json");
            return res.json({
              success: false,

              message:
                "Unable to create new company please check and try again later!! ",
            });
          }
        }
      } else if (JSON.stringify(req.body).includes("iot_energy")) {
        const generateRandomNumber = await crypto.randomInt(10000000, 99999999);
        const adminObject = await Admin.findOne({ email: email });
        if (!!adminObject) {
          res.statusCode = 401;
          return res.json({
            success: false,
            message: "Please email already exist for this admin",
          });
        } else {
          const newCompany = await Company.create({
            name: companyName,
            apikey: `iobotech-${tagName}-${randomString(16)}`,
            Gen_Date: dayjs(),
            serviceType,
            authToken: {
              auth_token: `${tagName}-${generateRandomNumber}`,
            },
            iotServices: {
              energyIOT: {
                isEnergyIOT: true,
                siteName: siteName,
              },
            },
            branch,
            tag: tagName.toUpperCase(),
            threshold: {
              iot: threshold_number,
            },
            howManySensor,
            suffix,
            source,
          });
          if (!!newCompany) {
            const WalletObject = await new Wallet({
              status: "active",
              walletid: `WID-${generateRandomNumber}`,
              companyId: newCompany._id,
              company: companyName,
              owner: `UID-${randomNumber(100000000, 999999999)}`,
              tag: tagName.toUpperCase(),
            }).save();
            if (!!WalletObject) {
              const SaveadminData = await new Admin({
                status: "active",
                adminid: `AID-${generateRandomNumber}`,
                level: "sub",
                role: "administrator",
                email,
                password,
                company: companyName,
                tag: "*",
              }).save();
              if (!!SaveadminData) {
                //sendemail
                await CompanyEmailNotification(
                  true,
                  SaveadminData,
                  email,
                  newCompany
                );
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                return res.json({
                  success: true,
                  // authToken: newCompany["authToken"].auth_token,
                  message:
                    "Your request is successfull, check your email for your admin details Thanks!! ",
                });
              } else {
                res.statusCode = 401;
                res.setHeader("Content-Type", "application/json");
                return res.json({
                  success: false,

                  message:
                    "Unable to create admin please check and try again later!! ",
                });
              }
            } else {
              res.statusCode = 401;
              res.setHeader("Content-Type", "application/json");
              return res.json({
                success: false,
                message:
                  "Unable to create wallets for this company, please check and try again later!! ",
              });
            }
          } else {
            res.statusCode = 401;
            res.setHeader("Content-Type", "application/json");
            return res.json({
              success: false,

              message:
                "Unable to create new company please check and try again later!! ",
            });
          }
        }
      }
    } else if (JSON.stringify(req.body).includes("external")) {
      if (JSON.stringify(req.body).includes("iot_fuel")) {
        const generateRandomNumber = await crypto.randomInt(10000000, 99999999);
        const adminObject = await Admin.findOne({ email: email });
        if (!!adminObject) {
          res.statusCode = 401;
          return res.json({
            success: false,
            message: "Please email already exist for this admin",
          });
        } else {
          const newCompany = await Company.create({
            name: companyName,
            apikey: `iobotech-${tagName}-${randomString(16)}`,
            Gen_Date: dayjs(),
            serviceType,
            suffix,
            authToken: {
              auth_token: tagName + "-" + generateRandomNumber,
            },
            iotServices: {
              fuelTank: {
                isFuelIOT: true,
                siteName,
              },
            },
            branch,
            howManySensor,
            tag: tagName,
            threshold: {
              iot: threshold_number,
            },
            source,
          });
          if (!!newCompany) {
            const WalletObject = await new Wallet({
              status: "active",
              walletid: `WID-${randomNumber(100000000, 999999999)}`,
              companyId: newCompany._id,
              company: companyName,
              tag: tagName,
              owner: `UID-${randomNumber(100000000, 999999999)}`,
            }).save();
            if (!!WalletObject) {
              const SaveadminData = await new Admin({
                status: "active",
                adminid: `AID-${randomNumber(10000000, 99999999)}`,
                level: "sub",
                role: "administrator",
                email,
                password,
                company: companyName,
                tag: tagName,
              }).save();
              if (!!SaveadminData) {
                await CompanyEmailNotification(
                  true,
                  SaveadminData,
                  email,
                  newCompany
                );
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                return res.json({
                  success: true,
                  // authToken: newCompany["authToken"].auth_token,
                  message:
                    "Your request is successfull, check your email for your admin details Thanks!! ",
                });
              } else {
                res.statusCode = 401;
                res.setHeader("Content-Type", "application/json");
                return res.json({
                  success: false,

                  message:
                    "Unable to create admin please check and try again later!! ",
                });
              }
            } else {
              res.statusCode = 401;
              res.setHeader("Content-Type", "application/json");
              return res.json({
                success: false,
                message:
                  "Unable to create wallets for this company, please check and try again later!! ",
              });
            }
          } else {
            res.statusCode = 401;
            res.setHeader("Content-Type", "application/json");
            return res.json({
              success: false,

              message:
                "Unable to create new company please check and try again later!! ",
            });
          }
        }
      } else if (JSON.stringify(req.body).includes("iot_energy")) {
        const generateRandomNumber = await crypto.randomInt(10000000, 99999999);

        const adminObject = await Admin.findOne({ email: email });
        if (!!adminObject) {
          res.statusCode = 401;
          return res.json({
            success: false,
            message: "Please email already exist for this admin",
          });
        } else {
          const newCompany = await Company.create({
            name: companyName,
            apikey: `iobotech-${tagName}-${randomString(16)}`,
            Gen_Date: dayjs(),
            serviceType,
            authToken: {
              auth_token: `${tagName}-${generateRandomNumber}`,
            },
            iotServices: {
              energyIOT: {
                isEnergyIOT: true,
                siteName: siteName,
              },
            },
            branch,
            tag: tagName.toUpperCase(),
            threshold: {
              iot: threshold_number,
            },
            howManySensor,
            suffix,
            source,
          });
          if (!!newCompany) {
            const WalletObject = await new Wallet({
              status: "active",
              walletid: `WID-${generateRandomNumber}`,
              companyId: newCompany._id,
              company: companyName,
              owner: `UID-${randomNumber(100000000, 999999999)}`,
              tag: tagName.toUpperCase(),
            }).save();
            if (!!WalletObject) {
              const SaveadminData = await new Admin({
                status: "active",
                adminid: `AID-${generateRandomNumber}`,
                level: "sub",
                role: "administrator",
                email,
                password,
                company: companyName,
                tag: "*",
              }).save();
              if (!!SaveadminData) {
                //sendemail
                await CompanyEmailNotification(
                  true,
                  SaveadminData,
                  email,
                  newCompany
                );
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                return res.json({
                  success: true,
                  // authToken: newCompany["authToken"].auth_token,
                  message:
                    "Your request is successfull, check your email for your admin details Thanks!! ",
                });
              } else {
                res.statusCode = 401;
                res.setHeader("Content-Type", "application/json");
                return res.json({
                  success: false,

                  message:
                    "Unable to create admin please check and try again later!! ",
                });
              }
            } else {
              res.statusCode = 401;
              res.setHeader("Content-Type", "application/json");
              return res.json({
                success: false,
                message:
                  "Unable to create wallets for this company, please check and try again later!! ",
              });
            }
          } else {
            res.statusCode = 401;
            res.setHeader("Content-Type", "application/json");
            return res.json({
              success: false,

              message:
                "Unable to create new company please check and try again later!! ",
            });
          }
        }
      }
    }
  }
};

const createConnectionUrl = async (req, res) => {
  const {
    companyName,
    tag,
    topic,
    iotConnectionForEnergyORFuel,
    username,
    hostURL,
    port,
    password,
    siteName,
  } = req.body;
  if (!companyName || !tag || !topic || !iotConnectionForEnergyORFuel) {
    return res.status(401).json({
      success: false,
      message: `All fields is required`,
    });
  } else {
    if (JSON.stringify(req.body).includes("iot_fuel")) {
      const companyObject = await Company.findOne({
        tag: tag.toUpperCase(),
        name: companyName,
      });
      if (!!companyObject) {
        const newConnectionUrl = await Connection.create({
          companyId: companyObject._id,
          password,
          topic,
          username,
          isnewTopic: true,
          tag: tag.toUpperCase(),
          hostURL,
          iotServices: {
            fuelTank: {
              isFuelIOT: true,
              siteName,
            },
          },
          port,
          iotConnectionForEnergyORFuel,
          companyName: companyName,
        });
        if (!!newConnectionUrl) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          return res.json({
            success: true,

            message: "Your request is successfull!! ",
          });
        } else {
          res.statusCode = 401;
          res.setHeader("Content-Type", "application/json");
          return res.json({
            success: false,
            message:
              "Unable to create new connection url, please check and try again later!! ",
          });
        }
      } else {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        return res.json({
          success: false,
          message:
            "No company data available please check and try again later!! ",
        });
      }
    } else if (JSON.stringify(req.body).includes("iot_energy")) {
      const companyObject = await Company.findOne({
        tag: tag.toUpperCase(),
        name: companyName,
      });
      if (!!companyObject) {
        const newConnectionUrl = await Connection.create({
          companyId: companyObject._id,
          password,
          topic,
          username,
          isnewTopic: true,
          tag: tag.toUpperCase(),
          hostURL,
          iotServices: {
            energyIOT: {
              isEnergyIOT: true,
              siteName: siteName,
            },
          },
          port,
          iotConnectionForEnergyORFuel,
          companyName: companyName,
        });
        if (!!newConnectionUrl) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          return res.json({
            success: true,

            message: "Your request is successfull!! ",
          });
        } else {
          res.statusCode = 401;
          res.setHeader("Content-Type", "application/json");
          return res.json({
            success: false,
            message:
              "Unable to create new connection url, please check and try again later!! ",
          });
        }
      } else {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        return res.json({
          success: false,
          message:
            "No company data available please check and try again later!! ",
        });
      }
    }
  }
};
const createCalculation = async (req, res) => {
  const {
    companyName,
    tag,
    topic,
    energy,
    power,
    current,
    voltage,
    minimumValue,
    numberToSubstract,
    maximumValue,
    numberToDivide,
    serviceid,
  } = req.body;
  if (req.path === "/create-fuel-calculation") {
    if (
      !companyName ||
      !tag ||
      !topic ||
      !minimumValue ||
      !numberToSubstract ||
      !maximumValue ||
      !numberToDivide ||
      !serviceid
    ) {
      return res.status(401).json({
        success: false,
        message: `All fields is required`,
      });
    } else {
      const companyObject = await Company.findOne({
        tag: tag.toUpperCase(),
        name: companyName,
      });
      if (!!companyObject) {
        const tankObject = await Tank.findOne({
          tag: tag.toUpperCase(),
          name: companyName,
          companyId: companyObject._id,
        });
        if (!!tankObject) {
          const newCalculation = await IotServiceFuelCalcuation.create({
            companyId: companyObject._id,
            topic,
            tag: tag.toUpperCase(),
            minimumValue,
            numberToSubstract,
            maximumValue,
            numberToDivide,
            serviceid,
            companyName: companyName,
            tankId: tankObject._id,
            deviceId: tankObject.deviceId,
          });
          if (!!newCalculation) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            return res.json({
              success: true,

              message: "Your request is successfull!! ",
            });
          } else {
            res.statusCode = 401;
            res.setHeader("Content-Type", "application/json");
            return res.json({
              success: false,
              message:
                "Unable to create new calculation, please check and try again later!! ",
            });
          }
        } else {
          res.statusCode = 401;
          res.setHeader("Content-Type", "application/json");
          return res.json({
            success: false,
            message:
              "No company data available please check and try again later!! ",
          });
        }
      } else {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        return res.json({
          success: false,
          message:
            "No company data available please check and try again later!! ",
        });
      }
    }
  } else if (req.path === "/create-energy-service-calculation") {
    if (!companyName || !tag || !topic || !serviceid) {
      return res.status(401).json({
        success: false,
        message: `All fields is required`,
      });
    } else {
      const companyObject = await Company.findOne({
        tag: tag.toUpperCase(),
        name: companyName,
      });
      if (!!companyObject) {
        const energyServiceObject = await EnergySensor.findOne({
          tag: tag.toUpperCase(),
          name: companyName,
          companyId: companyObject._id,
        });

        if (!!energyServiceObject) {
          if (energyServiceObject.isHavingCalculation == false) {
            res.statusCode = 401;
            res.setHeader("Content-Type", "application/json");
            return res.json({
              success: false,
              message:
                "Sorry this company and energy service dont have calculation, if you need to add calculation update your energy service to add calculation to the company, please check and try again later!! ",
            });
          } else {
            const newCalculation =
              await IotServiceEnergyServiceCalcuation.create({
                companyId: companyObject._id,
                topic,
                tag: tag.toUpperCase(),
                energy,
                power,
                current,
                voltage,
                serviceid,
                companyName: companyName,
                energyServiceId: energyServiceObject._id,
                deviceId: energyServiceObject.deviceId,
              });
            if (!!newCalculation) {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              return res.json({
                success: true,

                message: "Your request is successfull!! ",
              });
            } else {
              res.statusCode = 401;
              res.setHeader("Content-Type", "application/json");
              return res.json({
                success: false,
                message:
                  "Unable to create new calculation, please check and try again later!! ",
              });
            }
          }
        } else {
          res.statusCode = 401;
          res.setHeader("Content-Type", "application/json");
          return res.json({
            success: false,
            message:
              "No company data available please check and try again later!! ",
          });
        }
      } else {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        return res.json({
          success: false,
          message:
            "No company data available please check and try again later!! ",
        });
      }
    }
  }
};

const getCompanyDataByApiKey = async (req, res) => {
  try {
    const { query, apiKey } = req.query;
    console.log({ query, apiKey });
    if (!query || !apiKey) {
      res.statusCode = 403;
      return res.json({
        success: false,

        message: "Profile provide apikey and query string!!",
      });
    } else {
      if (query == "gridRuntime" || query == "genRuntime") {
        const companyObject = await Company.findOne({ apikey: apiKey }).lean();
        console.log({ companyObject });
        if (!!companyObject) {
          const models = {
            genRuntime: GeneratorRunTime,
            gridRuntime: GridRunTime,
            // gridStatus: GridRunTimeStatus,
            // genStatus: GeneratorRunTimeStatus,
          };
          let queryModel = models[query];
          console.log({ queryModel });
          const getData = await queryModel.findOne({
            tag: companyObject.tag,
            dateCreatedAt: {
              $gte: dayjs().startOf("d"),
              $lte: dayjs().endOf("d"),
            },
          });
          if (!!getData) {
            const gridRuntime = getData?.newTimeDiff + getData?.timeDiff;
            console.log({ gridRuntime });
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            return res.json({
              success: true,
              message: `This company ${companyObject.name} branch ${
                companyObject.branch
              } have  ${companyObject.iotservices.length}   ${
                companyObject.serviceType == "iot_energy"
                  ? "energy"
                  : "fuel or diesel"
              }  iot service monitoring`,
              data: calculateDuration2(gridRuntime),
            });
          } else {
            res.statusCode = 403;
            return res.json({
              success: false,
              // message: "No data available for this energy!!",
              data: calculateDuration2(0),
            });
          }
        } else {
          res.statusCode = 403;
          return res.json({
            success: false,

            message: `No data available for this ${companyObject.name} branch ${companyObject.branch}!!`,
          });
        }
      } else if (query == "gridStatus" || query == "genStatus") {
        const companyObject = await Company.findOne({ apikey: apiKey }).lean();
        console.log({ companyObject });
        if (!!companyObject) {
          const models = {
            gridStatus: GridRunTimeStatus,
            genStatus: GeneratorRunTimeStatus,
          };
          let queryModel = models[query];
          console.log({ queryModel });
          const getData = await queryModel.findOne(
            {
              tag: companyObject.tag,
              dateCreatedAt: {
                $gte: dayjs().startOf("d"),
                $lte: dayjs().endOf("d"),
              },
            },
            { generatorStatus: 1, gridStatus: 1, dateCreatedAt: 1 }
          );
          if (!!getData) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            return res.json({
              success: true,
              message: `This company ${companyObject.name} branch ${
                companyObject.branch
              } have  ${companyObject.iotservices.length}   ${
                companyObject.serviceType == "iot_energy"
                  ? "energy"
                  : "fuel or diesel"
              }  iot service monitoring`,
              data: getData,
            });
          } else {
            res.statusCode = 403;
            return res.json({
              success: false,
              message: `No ${query} available today,  `,
              data: "OFF",
            });
          }
        } else {
          res.statusCode = 403;
          return res.json({
            success: false,

            message: "No data available for this energy!!",
          });
        }
      } else {
        const companyObject = await Company.findOne({ apikey: apiKey }).lean();
        console.log({ companyObject });
        if (!!companyObject) {
          const models = {
            power: Power,
            current: Current,
            energy: GridEnergy,
            voltage: Voltage,
            fuellevel: FuelLevel,
            fuelConsumption: FuelLevelConsumption,
            fuelHistory: FuelHistory,
            genRuntime: GeneratorRunTime,
            gridRuntime: GridRunTime,
            gridStatus: GridRunTimeStatus,
            genStatus: GeneratorRunTimeStatus,
          };
          let queryModel = models[query];
          console.log({ queryModel });
          const getData = await queryModel.find(
            { tag: companyObject.tag },
            {
              energyOrGenType: 1,
              energyCurrentValue: 1,
              energyCurrentValue2: 1,
              power: 1,
              power2: 1,
              current: 1,
              current2: 1,
              currentValue: 1,
              voltage: 1,
              dailyConsumption: 1,
              voltage2: 1,
              serviceid: 1,
              newTimeDiff: 1,
              timeDiff: 1,
              fuelCurrentValue: 1,
              fuelDailyConsumption: 1,
              genRuntimefor: 1,
              dateCreatedAt: 1,
            }
          );
          if (!!getData) {
            const gridRuntime = getData?.newTimeDiff + getData?.timeDiff;
            console.log({ gridRuntime });
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            return res.json({
              success: true,
              message: `This company ${companyObject.name} branch ${
                companyObject.branch
              } have  ${companyObject.iotservices.length}   ${
                companyObject.serviceType == "iot_energy"
                  ? "energy"
                  : "fuel or diesel"
              }  iot service monitoring`,
              data: getData,
            });
          } else {
            res.statusCode = 403;
            return res.json({
              success: false,

              message: `No data available for this company ${companyObject.name} branch ${companyObject.branch} !!`,
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
    }
  } catch (error) {}
};

const createTenantAdmin = async (req, res) => {
  const { email, password, role, tag } = req.body;
  if (!password || !role || !tag) {
    res.statusCode = 403;
    return res.send({
      success: false,
      message: "Please all field is required .",
    });
  } else if (!email || !isValidEmail(email)) {
    res.statusCode = 403;
    return res.send({
      success: false,
      message: "Please provide valid email .",
    });
  } else {
    const adminObject = await Admin.findOne({ email: email });
    if (!!adminObject) {
      res.statusCode = 401;
      return res.json({
        success: false,
        message: "Please email already exist for this admin",
      });
    } else {
      const companyObject = await Company.findOne({ tag: tag }).lean();
      if (!!companyObject) {
        const SaveadminData = await new Admin({
          status: "active",
          adminid: `AID-${randomNumber(10000000, 99999999)}`,
          level: "sub",
          role: "tenant",
          email,
          password,
          company: companyObject.name,
          tag,
        }).save();
        if (!!SaveadminData) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          return res.json({
            success: true,
            message: "Your request is successfull!! ",
          });
        } else {
          res.statusCode = 401;
          res.setHeader("Content-Type", "application/json");
          return res.json({
            success: false,
            message: "Unable to create tenant admin!! ",
          });
        }
      } else {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        return res.json({
          success: false,
          message:
            "No company data available please check and try again later!! ",
        });
      }
    }
  }
};

module.exports = {
  createNewCompany,
  createCalculation,
  createConnectionUrl,
  getCompanyDataByApiKey,
  createTenantAdmin,
};
