const Company = require("../../../model/Company");
const User = require("../../../model/User");
const dayjs = require("dayjs");
const Wallet = require("../../../model/Wallet");
const crypto = require("crypto");
const { randomString } = require("../../../functions");
const EnergySensor = require("../../../model/energy/EnergySensor");
const IotServiceEnergyServiceCalcuation = require("../../../model/energy/IotServiceEnergyCalcuation");

const createNewEnergyService = async (req, res) => {
  const {
    topic,
    isHavingGenAndGrid,
    tag,
    siteName,
    companyName,
    authToken,
    deviceId,
    isHavingCalculation,
    monitorRuntime,
    energy,
    power,
    current,
    voltage,
  } = req.body;
  console.log({ isHavingCalculation, energy, power, current, voltage });
  if (isHavingCalculation === "true") {
    if (
      !siteName ||
      !topic ||
      !tag ||
      !companyName ||
      !isHavingGenAndGrid ||
      !deviceId ||
      !isHavingCalculation ||
      !monitorRuntime ||
      !companyName ||
      !tag ||
      !topic
    ) {
      return res.status(401).json({
        success: false,
        message: `All fields is required`,
      });
    } else {
      const generateRandomNumber = await crypto.randomInt(10000000, 99999999);
      const companyObject = await Company.findOne({
        // "authToken.auth_token": authToken,
        // "authToken.authTokenStatus": "active",
        tag: tag.toUpperCase(),
      });

      if (!!companyObject) {
        const energyObject = await EnergySensor.findOne({
          tag: tag.toUpperCase(),
          companyId: companyObject._id,
        }).sort({ createdAt: -1 });
        if (!!energyObject) {
          const newEnergyService = await EnergySensor.create({
            companyId: companyObject._id,
            authToken: {
              auth_token: tag.toUpperCase() + "-" + generateRandomNumber,
            },
            topic,
            siteName,
            deviceId,
            tag: tag.toUpperCase(),
            companyName,
            isHavingGenAndGrid,
            isHavingCalculation,
            monitorRuntime,
            serviceid: `SID-${generateRandomNumber}`,
          });
          if (!!newEnergyService) {
            // const walletObject = await Wallet.findOne({
            //   companyId: companyObject._id,
            //   tag: tag.toUpperCase(),
            // }).sort({ createdAt: -1 });
            // if (!!walletObject) {
            // const newUser = await User.create({
            //   iotserviceType: {
            //     energyIot: true,
            //   },

            //   userid: walletObject.owner,
            //   serviceid: newEnergyService.serviceid,
            //   energySensorId: newEnergyService._id,

            //   companyId: companyObject._id,

            //   tag: tag.toUpperCase(),
            //   walletid: walletObject.walletid,
            //   company: companyName,
            //   service_start: dayjs(),
            //   iotservice: true,
            // });
            // if (!!newUser) {
            companyObject.iotservices.push(newEnergyService.serviceid);
            const updateCompany = companyObject.save();
            if (!!updateCompany) {
              const newCalculation =
                await IotServiceEnergyServiceCalcuation.create({
                  companyId: companyObject._id,
                  topic,
                  tag: tag.toUpperCase(),
                  energy: energy == undefined ? 1 : energy,
                  power: power == undefined ? 1 : power,
                  current: current == undefined ? 1 : current,
                  voltage: voltage == undefined ? 1 : voltage,
                  serviceid: newEnergyService.serviceid,
                  companyName: companyName,
                  energyServiceId: newEnergyService._id,
                  deviceId: deviceId,
                });
              if (!!newCalculation) {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                return res.json({
                  success: true,
                  authToken: newEnergyService["authToken"].auth_token,
                  message:
                    "Your request is successfull, Please  send the auth token to user to create an account Thanks!! ",
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
              return res.json({
                success: false,
                message:
                  "Unable to add energy service to existing one user data, Please try again!! ",
              });
            }
            // } else {
            //   res.statusCode = 401;
            //   return res.json({
            //     success: false,
            //     message: "Unable to create user data, Please try again!! ",
            //   });
            // }
            // } else {
            //   res.statusCode = 401;
            //   return res.json({
            //     success: false,
            //     message: "Unable to get user wallets, Please try again!! ",
            //   });
            // }
          } else {
            res.statusCode = 401;
            return res.json({
              success: false,
              message: "Your request is not successfull, Please try again!! ",
            });
          }
        } else {
          const newEnergyService = await EnergySensor.create({
            companyId: companyObject._id,
            authToken: {
              auth_token: tag + "-" + generateRandomNumber,
            },
            topic,
            siteName,
            deviceId,
            tag: tag.toUpperCase(),
            companyName,
            isHavingGenAndGrid,
            isHavingCalculation,
            monitorRuntime,
            serviceid: `SID-${generateRandomNumber}`,
          });
          if (!!newEnergyService) {
            // const walletObject = await Wallet.findOne({
            //   companyId: companyObject._id,
            //   tag: tag.toUpperCase(),
            // }).sort({ createdAt: -1 });
            // if (!!walletObject) {
            // const newUser = await User.create({
            //   iotserviceType: {
            //     energyIot: true,
            //   },
            //   userid: walletObject.owner,
            //   serviceid: newEnergyService.serviceid,
            //   energySensorId: newEnergyService._id,
            //   companyId: companyObject._id,

            //   tag: tag,
            //   walletid: walletObject.walletid,
            //   company: companyName,
            //   service_start: dayjs(),
            //   iotservice: true,
            // });
            // if (!!newUser) {
            companyObject.iotservices.push(newEnergyService.serviceid);
            const updateCompany = companyObject.save();
            if (!!updateCompany) {
              const newCalculation =
                await IotServiceEnergyServiceCalcuation.create({
                  companyId: companyObject._id,
                  topic,
                  tag: tag.toUpperCase(),
                  energy: energy == undefined ? 1 : energy,
                  power: power == undefined ? 1 : power,
                  current: current == undefined ? 1 : current,
                  voltage: voltage == undefined ? 1 : voltage,
                  serviceid: newEnergyService.serviceid,
                  companyName: companyName,
                  energyServiceId: newEnergyService._id,
                  deviceId: deviceId,
                });
              if (!!newCalculation) {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                return res.json({
                  success: true,
                  authToken: newEnergyService["authToken"].auth_token,
                  message:
                    "Your request is successfull, Please  send the auth token to user to create an account Thanks!! ",
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
              return res.json({
                success: false,
                message:
                  "Unable to add energy service to existing one user data, Please try again!! ",
              });
            }

            // } else {
            //   res.statusCode = 401;
            //   return res.json({
            //     success: false,
            //     message: "Unable to create user data, Please try again!! ",
            //   });
            // }
            // } else {
            //   res.statusCode = 401;
            //   return res.json({
            //     success: false,
            //     message: "Unable to get user wallets, Please try again!! ",
            //   });
            // }
          } else {
            res.statusCode = 401;
            return res.json({
              success: false,
              message: "Your request is not successfull, Please try again!! ",
            });
          }
        }
      } else {
        res.statusCode = 401;
        return res.json({
          success: false,
          message:
            "No company data availabe for this user, or the token have been expired Please try again!! ",
        });
      }
    }
  } else {
    if (
      !siteName ||
      !topic ||
      !tag ||
      !companyName ||
      !isHavingGenAndGrid ||
      !deviceId ||
      !isHavingCalculation ||
      !monitorRuntime
    ) {
      return res.status(401).json({
        success: false,
        message: `All fields is required`,
      });
    } else {
      const generateRandomNumber = await crypto.randomInt(10000000, 99999999);
      const companyObject = await Company.findOne({
        // "authToken.auth_token": authToken,
        // "authToken.authTokenStatus": "active",
        tag: tag.toUpperCase(),
      });

      if (!!companyObject) {
        const energyObject = await EnergySensor.findOne({
          tag: tag.toUpperCase(),
          companyId: companyObject._id,
        }).sort({ createdAt: -1 });
        if (!!energyObject) {
          const newEnergyService = await EnergySensor.create({
            companyId: companyObject._id,
            authToken: {
              auth_token: tag + "-" + generateRandomNumber,
            },
            topic,
            siteName,
            deviceId,
            tag: tag.toUpperCase(),
            companyName,
            isHavingGenAndGrid,
            isHavingCalculation,
            monitorRuntime,
            serviceid: `SID-${generateRandomNumber}`,
          });
          if (!!newEnergyService) {
            // const walletObject = await Wallet.findOne({
            //   companyId: companyObject._id,
            //   tag: tag.toUpperCase(),
            // }).sort({ createdAt: -1 });
            // if (!!walletObject) {
            // const newUser = await User.create({
            //   iotserviceType: {
            //     energyIot: true,
            //   },

            //   userid: walletObject.owner,
            //   serviceid: newEnergyService.serviceid,
            //   energySensorId: newEnergyService._id,

            //   companyId: companyObject._id,

            //   tag: tag,
            //   walletid: walletObject.walletid,
            //   company: companyName,
            //   service_start: dayjs(),
            //   iotservice: true,
            // });
            // if (!!newUser) {
            companyObject.iotservices.push(newEnergyService.serviceid);
            const updateCompany = companyObject.save();
            if (!!updateCompany) {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              return res.json({
                success: true,
                authToken: newEnergyService["authToken"].auth_token,
                message:
                  "Your request is successfull, Please  send the auth token to user to create an account Thanks!! ",
              });
            } else {
              res.statusCode = 401;
              return res.json({
                success: false,
                message:
                  "Unable to add energy service to existing one user data, Please try again!! ",
              });
            }

            // } else {
            //   res.statusCode = 401;
            //   return res.json({
            //     success: false,
            //     message: "Unable to create user data, Please try again!! ",
            //   });
            // }

            // } else {
            //   res.statusCode = 401;
            //   return res.json({
            //     success: false,
            //     message: "Unable to get user wallets, Please try again!! ",
            //   });
            // }
          } else {
            res.statusCode = 401;
            return res.json({
              success: false,
              message: "Your request is not successfull, Please try again!! ",
            });
          }
        } else {
          const newEnergyService = await EnergySensor.create({
            companyId: companyObject._id,
            authToken: {
              auth_token: tag + "-" + generateRandomNumber,
            },
            topic,
            siteName,
            deviceId,
            tag: tag.toUpperCase(),
            companyName,
            isHavingGenAndGrid,
            isHavingCalculation,
            monitorRuntime,
            serviceid: `SID-${generateRandomNumber}`,
          });
          if (!!newEnergyService) {
            // const walletObject = await Wallet.findOne({
            //   companyId: companyObject._id,
            //   tag: tag.toUpperCase(),
            // }).sort({ createdAt: -1 });
            // if (!!walletObject) {
            // const newUser = await User.create({
            //   iotserviceType: {
            //     energyIot: true,
            //   },

            //   userid: walletObject.owner,
            //   serviceid: newEnergyService.serviceid,
            //   energySensorId: newEnergyService._id,

            //   companyId: companyObject._id,

            //   tag: tag,
            //   walletid: walletObject.walletid,
            //   company: companyName,
            //   service_start: dayjs(),
            //   iotservice: true,
            // });
            // if (!!newUser) {
            companyObject.iotservices.push(newEnergyService.serviceid);
            const updateCompany = companyObject.save();
            if (!!updateCompany) {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              return res.json({
                success: true,
                authToken: newEnergyService["authToken"].auth_token,
                message:
                  "Your request is successfull, Please  send the auth token to user to create an account Thanks!! ",
              });
            } else {
              res.statusCode = 401;
              return res.json({
                success: false,
                message:
                  "Unable to add energy service to existing one user data, Please try again!! ",
              });
            }

            // } else {
            //   res.statusCode = 401;
            //   return res.json({
            //     success: false,
            //     message: "Unable to create user data, Please try again!! ",
            //   });
            // }
          } else {
            res.statusCode = 401;
            return res.json({
              success: false,
              message: "Unable to get user wallets, Please try again!! ",
            });
          }
          // } else {
          //   res.statusCode = 401;
          //   return res.json({
          //     success: false,
          //     message: "Your request is not successfull, Please try again!! ",
          //   });
          // }
        }
      } else {
        res.statusCode = 401;
        return res.json({
          success: false,
          message:
            "No company data availabe for this user, or the token have been expired Please try again!! ",
        });
      }
    }
  }
};
module.exports = { createNewEnergyService };
