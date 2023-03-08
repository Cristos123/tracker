const Company = require("../../../model/Company");
const User = require("../../../model/User");
const dayjs = require("dayjs");
const Wallet = require("../../../model/Wallet");
const crypto = require("crypto");

const createNewTanks = async (req, res) => {
  let {
    firstname,
    lastname,

    userType,
    phonenumber,
    password,
    topic,
    email,
    tag,
    company,
    authToken,
  } = req.body;
  if (
    !firstname ||
    !lastname ||
    !userType ||
    !phonenumber ||
    !password ||
    !topic ||
    !email ||
    !tag ||
    !company ||
    !authToken
  ) {
    return res.status(401).json({
      success: false,
      message: `All fields is required`,
    });
  } else {
    const generateRandomNumber = await crypto.randomInt(10000000, 99999999);

    if (JSON.stringify(req.body).includes("iot_fuel")) {
      const userObject = await User.findOne({ email: email });
      if (!!userObject) {
        res.statusCode = 401;
        return res.json({
          success: false,
          message: "Please email already exist",
        });
      } else {
        const companyObject = await Company.findOne({
          "authToken.auth_token": authToken,
          "authToken.authTokenStatus": "active",
        });

        if (!!companyObject) {
          const walletObject = await Wallet.findOne({
            companyId: companyObject._id,
          });
          if (!!walletObject) {
            const newTank = await User.create({
              iotserviceType: {
                fuelTank: true,
              },

              userid: `UID-${generateRandomNumber}`,
              serviceId: `SID-${generateRandomNumber}`,
              fuelId: `FID-${generateRandomNumber}`,
              firstname,
              lastname,
              fullname: ` ${firstname} ` + ` ${lastname} `,
              userType,
              phonenumber,
              companyId: companyObject._id,
              password,
              topic,
              email,
              tag,
              walletId: walletObject.walletId,
              company,
              service_start: dayjs(),
              iotservice: true,
            });
            if (!!newTank) {
              companyObject.authToken.authTokenStatus = "used";
              const updateCompany = await companyObject.save();
              if (!!updateCompany) {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                return res.json({
                  success: true,
                  message:
                    "Your request is successfull, Please login to continue!! ",
                });
              } else {
                res.statusCode = 401;
                return res.json({
                  success: false,
                  message: "Unable to update your status, Please try again!! ",
                });
              }
            } else {
              res.statusCode = 401;
              return res.json({
                success: false,
                message: "Your request is not successfull, Please try again!! ",
              });
            }
          } else {
            res.statusCode = 401;
            return res.json({
              success: false,
              message:
                "No wallet available for this company, Please try again!! ",
            });
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
    } else if (JSON.stringify(req.body).includes("iot_energy")) {
      const userObject = await User.findOne({ email: email });
      if (!!userObject) {
        res.statusCode = 401;
        return res.json({
          success: false,
          message: "Please email already exist",
        });
      } else {
        const companyObject = await Company.findOne({
          "authToken.auth_token": authToken,
        });
        if (!!companyObject) {
          const walletObject = await Wallet.findById({
            companyId: companyObject._id,
          });
          if (!!walletObject) {
            const newTank = await User.create({
              iotserviceType: {
                energyIOT: true,
              },

              userid: `UID-${generateRandomNumber}`,
              serviceId: `SID-${generateRandomNumber}`,
              fuelId: `FID-${generateRandomNumber}`,
              firstname,
              lastname,
              fullname: ` ${firstname} `` ${lastname} `,
              userType,
              phonenumber,
              companyId: companyObject._id,
              password,
              topic,
              email,
              tag,
              walletId: walletObject.walletId,
              company,
              service_start: dayjs(),
              iotservice: true,
            });
            if (!!newTank) {
              companyObject.authToken.authTokenStatus = "used";
              const updateCompany = await companyObject.save();
              if (!!updateCompany) {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                return res.json({
                  success: true,
                  message:
                    "Your request is successfull, Please login to continue!! ",
                });
              } else {
                res.statusCode = 401;
                return res.json({
                  success: false,
                  message: "Unable to update your status, Please try again!! ",
                });
              }
            } else {
              res.statusCode = 401;
              return res.json({
                success: false,
                message: "Your request is not successfull, Please try again!! ",
              });
            }
          } else {
            res.statusCode = 401;
            return res.json({
              success: false,
              message:
                "No wallet available for this company, Please try again!! ",
            });
          }
        } else {
          res.statusCode = 401;
          return res.json({
            success: false,
            message:
              "No company data availabe for this user, Please try again!! ",
          });
        }
      }
    }
  }
};
module.exports = { createNewTanks };
