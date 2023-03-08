// const

const User = require("../model/User");

const bcrypt = require("bcrypt");
const { isValidEmail, getToken } = require("../functions");
const Company = require("../model/Company");
const Wallet = require("../model/Wallet");
const Tank = require("../model/FuelOrDisiel/Tanks");
const crypto = require("crypto");
const dayjs = require("dayjs");
const EnergyService = require("../model/energy/EnergySensor");

const loginUser = async (req, res, next) => {
  if (JSON.stringify(req.body).includes("essability@iobotech.com")) {
    const { email, password } = req.body;

    try {
      const emailObject = await User.findOne({
        email: email,
        subjectType: "user",
        status: "active",
      });
      console.log({ emailObject });
      if (!!emailObject) {
        if (!email || !isValidEmail(email)) {
          return res.statusCode(401).json({
            success: false,
            message: "Please provide email is required!",
          });
        } else if (!password) {
          return res
            .statusCode(401)
            .json({ success: false, message: "Please provide password!" });
        } else {
          try {
            //Login code
            let canProceed = false;
            let userId;
            if (isValidEmail(email)) {
              const emailObject = await User.findOne({
                email: email,
                subjectType: "user",
                status: "active",
              });
              console.log({ emailObject });
              if (emailObject?.status == "pending") {
                res.statusCode = 401;
                res.setHeader("Content-Type", "application/json");
                return res.json({
                  success: false,
                  message: "Please verify your email before you can login",
                });
              } else if (!!emailObject) {
                canProceed = true;
                //   userId = emailObject.subjectId
              } else {
                res.statusCode = 401;
                res.setHeader("Content-Type", "application/json");
                return res.json({
                  success: false,
                  message: "This email doesn't exist in our records",
                });
              }
            }

            if (canProceed) {
              let passwordObject = await User.findOne({
                subjectType: "user",
                status: "active",
                //   subjectId: userId,
              });
              // const userObject = await User.findOne({ _id: userId })
              if (!!(await bcrypt.compare(password, passwordObject.password))) {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                return res.json({
                  success: true,
                  message: "Login successful!",

                  token: getToken(emailObject._id),
                });
              } else {
                res.statusCode = 401;
                res.setHeader("Content-Type", "application/json");
                return res.json({
                  success: false,
                  message: "Error login User",
                });
              }
            } else {
              res.statusCode = 401;
              res.setHeader("Content-Type", "application/json");
              return res.json({
                success: false,
                message: "Incorrect password",
              });
            }
          } catch (error) {
            console.log("error ", error);
            if (!!error && typeof error.message === "string") {
              return res.json({ success: false, message: error.message });
            } else {
              return res.json({
                success: false,
                message: "error inserting user 2",
              });
            }
          }
        }
      } else {
        let passwordHash = await bcrypt.hashSync("Admin01", 10);
        // do stuff
        const saveUser = await User.create({
          email: "essability@iobotech.com",
          password: passwordHash,
        });
        if (!!saveUser) {
          const userObject = await User.findOne({
            subjectType: "user",
            status: "active",
          });
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          return res.json({
            success: true,
            message: "Login successful!",

            token: getToken(userObject._id),
          });
        } else {
          res.statusCode = 403;
          res.setHeader("Content-Type", "application/json");
          return res.json({
            success: false,
            message: "You are not allow on this route!",
          });
        }
      }
    } catch (error) {
      console.log("error ", error);
      if (!!error && typeof error.message === "string") {
        return res.json({ success: false, message: error.message });
      } else {
        return res.json({
          success: false,
          message: "error inserting user 2",
        });
      }
    }
  } else {
    res.statusCode = 403;
    res.setHeader("Content-Type", "application/json");
    return res.json({
      success: false,
      message: "Please request for authorization before login on this page !!!",
    });
  }
};

const createNewUser = async (req, res) => {
  const {
    firstname,
    lastname,
    userType,
    phonenumber,
    password,
    email,
    company,
    authToken,
  } = req.body;
  if (
    !firstname ||
    !lastname ||
    !userType ||
    !phonenumber ||
    !password ||
    !company ||
    !authToken
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
        const tankObject = await Tank.findOne({
          "authToken.auth_token": authToken,
          "authToken.authTokenStatus": "active",
        }).sort({ createdAt: -1 });

        if (!!tankObject) {
          const walletObject = await Wallet.findOne({
            companyId: tankObject.companyId,
          }).sort({ createdAt: -1 });
          if (!!walletObject) {
            const newUser = await User.create({
              iotserviceType: {
                fuelIot: true,
              },
              userid: walletObject.owner,
              serviceid: tankObject.serviceid,
              fuelid: `FID-${generateRandomNumber}`,
              firstname,
              lastname,
              fullname: ` ${firstname} ` + ` ${lastname} `,
              userType,
              phonenumber,
              companyId: tankObject.companyId,
              password,
              tankId: tankObject._id,
              email,
              tag: tankObject.tag,
              walletid: walletObject.walletid,
              company: company,
              service_start: dayjs(),
              iotservice: true,
            });
            if (!!newUser) {
              tankObject.authToken.authTokenStatus = "used";
              const updateCompany = await tankObject.save();
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
        const energyObject = await EnergyService.findOne({
          "authToken.auth_token": authToken,
          "authToken.authTokenStatus": "active",
        }).sort({ createdAt: -1 });
        if (!!energyObject) {
          const walletObject = await Wallet.findOne({
            companyId: energyObject.companyId,
          }).sort({ createdAt: -1 });
          if (!!walletObject) {
            const newUser = await User.create({
              iotserviceType: {
                energyIot: true,
              },

              userid: walletObject.owner,
              serviceid: energyObject.serviceid,
              fuelid: `FID-${generateRandomNumber}`,
              firstname,
              lastname,
              fullname: ` ${firstname} ` + ` ${lastname} `,
              userType,
              phonenumber,
              companyId: energyObject.companyId,
              password,
              energySensorId: energyObject._id,
              email,
              tag: energyObject.tag,
              walletid: walletObject.walletid,
              company: company,
              service_start: dayjs(),
              iotservice: true,
            });
            if (!!newUser) {
              energyObject.authToken.authTokenStatus = "used";
              const updateCompany = await energyObject.save();
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
module.exports = { loginUser, createNewUser };
