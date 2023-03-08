const dayjs = require("dayjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.randomString = (length) => {
  let finalString = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let characterLength = characters.length;
  for (let i = 0; i < length; i++) {
    finalString += characters.charAt(
      Math.floor(Math.random() * characterLength)
    );
  }
  return finalString;
};

exports.isValidEmail = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const cookiesSecretKey = process.env.SECRETKEY;
exports.getToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
    },
    cookiesSecretKey,

    { expiresIn: "1h" }
  );
};
