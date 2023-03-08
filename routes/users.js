var express = require("express");
const { getAuthToken } = require("../controller/IOTServices/getAuthToken");
const { loginUser, createNewUser } = require("../controller/user");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
router.post("/login", loginUser);
router.get("/auth_token", getAuthToken);
router.post("/register", createNewUser);

module.exports = router;
