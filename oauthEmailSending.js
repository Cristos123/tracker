require("dotenv").config();
const nodemailer = require("nodemailer");

const { google } = require("googleapis");
const SMTPTransport = require("nodemailer/lib/smtp-transport");
const OAuth2 = google.auth.OAuth2;

const sendMailOauth = async (recievers, subject, content) => {
  // console.log("senmaith", sendMailOauth);
  try {
    console.log("tunde emaillll");
    const oauth2Client = new OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );
    // console.log("oauth2Client", oauth2Client);
    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    // console.log("oauth2Client credentials", oauth2Client);
    const accessToken = await new Promise((resolve, reject) => {
      console.log("i ma who i am  ");
      oauth2Client.getAccessToken((err, token) => {
        console.log("err", err, "i am the best");
        if (err) {
          reject(err);
        }
        resolve(token);
        console.log("token", token);
      });
    });

    // console.log("accessToken", accessToken);
    const transport = nodemailer.createTransport({
      service: "gmail",
      // "Host": "Smtp.gmail.com",
      // "Port": 465,
      // "Secure": true,
      auth: {
        // type: "OAuth2",
        type: "OAuth2",
        user: process.env.EMAIL || "iotpublishmqtt@gmail.com",
        accessToken: accessToken,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
    });
    // console.log("transporter", transport);

    let messages = {
      from: process.env.EMAIL,
      to: recievers,
      subject: subject,
      html: content,
    };
    console.log("message", messages);
    transport.sendMail(messages, (err, info) => {
      err
        ? console.log("err", err)
        : console.log("email sent: ", info.response);
      SMTPTransport.close();
      // if (err) {
      //   return console.log("err", err);
      // } else {
      //   return console.log("email sent: ", info.response);
      // }
    });
  } catch (error) {
    console.error("error ", error);
  }
};

module.exports = sendMailOauth;
