const Company = require("../../../model/Company");
const User = require("../../../model/User");
const dayjs = require("dayjs");
const Wallet = require("../../../model/Wallet");
const crypto = require("crypto");
const { randomString } = require("../../../functions");
const Tank = require("../../../model/FuelOrDisiel/Tanks");
const IotServiceFuelCalcuation = require("../../../model/FuelOrDisiel/IotServiceFuelCalcuation");

const createNewTanks = async (req, res) => {
  const {
    tankLevel,

    topic,
    isHavingTwoGen,
    tag,
    siteName,
    companyName,
    monitorRuntime,
    deviceId,
    minimumValue,
    numberToSubstract,
    maximumValue,
    numberToDivide,
    isHavingTamper,
  } = req.body;
  if (
    !tankLevel ||
    !siteName ||
    !topic ||
    !tag ||
    !companyName ||
    !isHavingTwoGen ||
    !deviceId ||
    !isHavingTamper ||
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
      const tankObject = await Tank.findOne({
        tag: tag.toUpperCase(),
        companyName: companyName,
        companyId: companyObject._id,
      });
      if (!!tankObject) {
        const newTank = await Tank.create({
          companyId: companyObject._id,
          authToken: {
            auth_token: tag.toUpperCase() + "-" + generateRandomNumber,
          },
          topic,
          siteName,
          deviceId,
          tankLevel,
          tag: tag.toUpperCase(),
          companyName,
          isHavingTwoGen,
          serviceid: `SID-${generateRandomNumber}`,
          isHavingTamper,
          monitorRuntime,
        });
        if (!!newTank) {
          // const walletObject = await Wallet.findOne({
          //   companyId: companyObject._id,
          //   tag: tag.toUpperCase(),
          // }).sort({ createdAt: -1 });
          // if (!!walletObject) {
          //   const newUser = await User.create({
          //     iotserviceType: {
          //       energyIot: true,
          //     },

          //     userid: walletObject.owner,
          //     serviceid: newTank.serviceid,
          //     tankId: newTank._id,
          //     companyId: energyObject.companyId,
          //     tag: tag.toUpperCase(),
          //     walletid: walletObject.walletid,
          //     company: companyName,
          //     service_start: dayjs(),
          //     iotservice: true,
          //   });
          //   if (!!newUser) {
          companyObject.iotservices.push(newTank.serviceid);
          const updateCompany = companyObject.save();
          if (!!updateCompany) {
            const newCalculation = await IotServiceFuelCalcuation.create({
              companyId: companyObject._id,
              topic,
              tag: tag.toUpperCase(),
              minimumValue,
              numberToSubstract,
              maximumValue,
              numberToDivide,
              serviceid: newTank.serviceid,
              companyName: companyName,
              tankId: newTank._id,
              deviceId: deviceId,
            });
            if (!!newCalculation) {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              return res.json({
                success: true,
                authToken: newTank["authToken"].auth_token,
                message:
                  "Your request is successfull, Please  send the auth token to user to create an account Thanks!! ",
              });
            } else {
              res.statusCode = 401;
              res.setHeader("Content-Type", "application/json");
              return res.json({
                success: false,

                message: "Unable to add calculation!! ",
              });
            }
          } else {
            res.statusCode = 401;
            return res.json({
              success: false,
              message:
                "Unable to update your company data, Please try again!! ",
            });
          }
          //   } else {
          //     res.statusCode = 401;
          //     return res.json({
          //       success: false,
          //       message: "Unable to create user data, Please try again!! ",
          //     });
          //   }

          // } else {
          //   res.statusCode = 401;
          //   return res.json({
          //     success: false,
          //     message:
          //       "Unable to get company wallet details status, Please try again!! ",
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
        const newTank = await Tank.create({
          companyId: companyObject._id,
          authToken: {
            auth_token: tag.toUpperCase() + "-" + generateRandomNumber,
          },
          topic,
          siteName,
          deviceId,
          tankLevel,
          tag: tag.toUpperCase(),
          companyName,
          isHavingTwoGen,
          serviceid: `SID-${generateRandomNumber}`,
          isHavingTamper,
          monitorRuntime,
        });
        if (!!newTank) {
          // const walletObject = await Wallet.findOne({
          //   companyId: companyObject._id,
          //   tag: tag.toUpperCase(),
          // }).sort({ createdAt: -1 });
          // if (!!walletObject) {
          //   const newUser = await User.create({
          //     iotserviceType: {
          //       fuelIot: true,
          //     },

          //     userid: walletObject.owner,
          //     serviceid: newTank.serviceid,
          //     tankId: newTank._id,
          //     companyId: energyObject.companyId,
          //     tag: tag.toUpperCase(),
          //     walletid: walletObject.walletid,
          //     company: companyName,
          //     service_start: dayjs(),
          //     iotservice: true,
          //   });
          //   if (!!newUser) {
          companyObject.iotservices.push(newTank.serviceid);
          const updateCompany = companyObject.save();
          if (!!updateCompany) {
            const newCalculation = await IotServiceFuelCalcuation.create({
              companyId: companyObject._id,
              topic,
              tag: tag.toUpperCase(),
              minimumValue,
              numberToSubstract,
              maximumValue,
              numberToDivide,
              serviceid: newTank.serviceid,
              companyName: companyName,
              tankId: newTank._id,
              deviceId: deviceId,
            });
            if (!!newCalculation) {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              return res.json({
                success: true,
                authToken: newTank["authToken"].auth_token,
                message:
                  "Your request is successfull, Please  send the auth token to user to create an account Thanks!! ",
              });
            } else {
              res.statusCode = 401;
              res.setHeader("Content-Type", "application/json");
              return res.json({
                success: false,

                message: "Unable to add calculation!! ",
              });
            }
          } else {
            res.statusCode = 401;
            return res.json({
              success: false,
              message:
                "Unable to update your company data, Please try again!! ",
            });
          }
          //   } else {
          //     res.statusCode = 401;
          //     return res.json({
          //       success: false,
          //       message: "Unable to create user data, Please try again!! ",
          //     });
          //   }

          // } else {
          //   res.statusCode = 401;
          //   return res.json({
          //     success: false,
          //     message:
          //       "Unable to get company wallet details status, Please try again!! ",
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
};
module.exports = { createNewTanks };
