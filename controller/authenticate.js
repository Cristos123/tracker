const jwt = require("jsonwebtoken");
const { default: fetch } = require("node-fetch");

const cookiesSecretKey = process.env.SECRETKEY;

exports.authCheck1 = async (req, res, next) => {
  try {
    if (req.headers || req.headers.authorization.indexOf("Bearer ") !== -1) {
      const token = req.headers.authorization;
      console.log({ token });
      if (token) {
        const onlyToken = token.slice(7, token.length);
        if (onlyToken) {
          jwt.verify(onlyToken, cookiesSecretKey, (err, decode) => {
            if (!err) {
              req.user = decode;
              return next();
              console.log(" req.user", req.user);
            }
            return next();
          });
        } else {
          return res.json({
            success: false,
            message: "Token not valid",
          });
        }
      } else {
        return next();
      }
    } else {
      return next();
    }
  } catch (error) {
    console.log("error ", error);
    if (!!error && typeof error.message === "string") {
      return res.json({ success: false, message: error.message });
    } else {
      return res.json({
        success: false,
        message: "error  user not authenticated",
      });
    }
  }
};
exports.authCheck = async (req, res, next) => {
  console.log("eq.headers.authorization", req.headers.authorization);
  try {
    if (req.headers || req.headers.authorization.indexOf("Bearer ") !== -1) {
      const token = req.headers.authorization;
      console.log({ token });
      if (token) {
        const response = await fetch(
          "https://pm-server.herokuapp.com/api/v2.0/user/info",
          {
            headers: { authorization: req.headers.authorization },
          }
        );
        const data = await response.json();
        if (data.status === 200) {
          if (data.data.role === "user") {
            req.user = data.data;
            console.log("req.user", req.user);
            return next();
          } else if (
            data.data.role === "administrator" &&
            data.data.level === "sub"
          ) {
            req.subAdmin = data.data;
            console.log("req.admin", req.subAdmin);
            return next();
          } else if (
            data.data.role === "administrator" &&
            data.data.level === "tenant"
          ) {
            req.tenantAdmin = data.data;
            return next();
          } else {
            return next();
          }
        } else {
          return res.json({
            success: false,
            message: data?.message,
          });
        }
      } else {
        return next();
      }
    } else {
      return next();
    }
  } catch (error) {
    console.log("error ", error);
    if (!!error && typeof error.message === "string") {
      return res.json({ success: false, message: error.message });
    } else {
      return res.json({
        success: false,
        message: "error  user not authenticated",
      });
    }
  }
};

exports.isCurrentUserLoggedIn = (req, res, next) => {
  let { user } = req;
  console.log({ user });
  if (!!user) {
    console.log("user", user);
    return next();
  } else {
    return res.json("Please login to continue");
  }
};
exports.isCurrentAdminLoggedIn = (req, res, next) => {
  let { subAdmin, tenantAdmin } = req;
  console.log("admin", subAdmin, tenantAdmin);
  if (!!subAdmin || !!tenantAdmin || !!user) {
    return next();
  } else {
    return res.json("Please login to continue");
  }
};
