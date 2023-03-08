const Company = require("../../model/Company");
const Tank = require("../../model/FuelOrDisiel/Tanks");

const getAuthToken = async (req, res) => {
  const { authToken } = req.query;
  console.log({ authToken });
  if (!authToken) {
    return res.status(401).json({
      success: false,
      message: `All fields is required`,
    });
  } else {
    const tankObject = await Tank.findOne({
      "authToken.auth_token": authToken,
      "authToken.authTokenStatus": "active",
    });

    if (!!tankObject) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        success: true,
        message: "Verified, you can now sign up!! ",
        data: tankObject,
      });
    } else {
      res.statusCode = 401;
      return res.json({
        success: false,
        message:
          "Your request is not successfull, Please try again or your token have already been used!! ",
      });
    }
  }
};

module.exports = { getAuthToken };
