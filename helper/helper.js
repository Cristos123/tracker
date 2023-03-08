const dayjs = require("dayjs");
const { trusted } = require("mongoose");
const { timeConstruct } = require("./timeConstruct");
let holdGenPreviousDiff = {};
let holdGenPreviousDiffJakande = {};
let holdGenPreviousDiffGbagada = {};
let holdGenPreviousDiffIfeGrandResort = {};
let holdGenPreviousDiffKnotAndGear = {};
let holdPreviousDiff = {};
let holdGenPreviousDiffOpebi = {};
let holdPreviousDiffOpebi = {};
let holdGenPreviousDiffAllen = {};
let holdPreviousDiffAllen = {};
let FirstHoldGenPreviousDiffCorona = {};
let SecondHoldGenPreviousDiffCorona = {};
const duration = require("dayjs/plugin/duration");
dayjs.extend(duration);
const HexToFloat32 = (str) => {
  var int = parseInt(str, 16);
  if (int > 0 || int < 0) {
    var sign = int >>> 31 ? -1 : 1;
    var exp = ((int >>> 23) & 0xff) - 127;
    var mantissa = ((int & 0x7fffff) + 0x800000).toString(2);
    var float32 = 0;
    for (i = 0; i < mantissa.length; i += 1) {
      float32 += parseInt(mantissa[i]) ? Math.pow(2, exp) : 0;
      exp--;
    }
    return float32 * sign;
  } else return 0;
};

const hexToDecimal = (hex) => parseInt(hex, 16);
exports.convertToPositive = (n) => {
  return Math.abs(n);
};

// exports.formatDataToObject = (data = [], sixchar) => {
//   const formatedData = {};
//   if (sixchar === "010378") {
//     data.forEach((value, i) => {
//       formatedData[`energy${i + 1}`] = hexToDecimal(value);
//       // console.log("formatedDataenergy", formatedData);
//     });
//   } else if (sixchar === "01030C") {
//     data.forEach((value, i) => {
//       formatedData[`voltage${i + 1}`] = HexToFloat32(value);
//     });
//   } else if (sixchar === "010310") {
//     data.forEach((value, i) => {
//       formatedData[`current${i + 1}`] = HexToFloat32(value);
//     });
//   } else if (sixchar === "010320") {
//     data.forEach((value, i) => {
//       formatedData[`power${i + 1}`] = HexToFloat32(value);
//     });
//   }
//   return formatedData;
// };

exports.formatDataToObject = (data = [], sixchar) => {
  const formatedData = {};
  if (sixchar === "010378") {
    data.forEach((value, i) => {
      formatedData[`energy${i + 1}`] = hexToDecimal(value);
      // console.log("formatedDataenergy", formatedData);
    });
  } else if (sixchar === "01030C") {
    data.forEach((value, i) => {
      formatedData[`voltage${i + 1}`] = HexToFloat32(value);
    });
  } else if (sixchar === "010310") {
    data.forEach((value, i) => {
      formatedData[`current${i + 1}`] = HexToFloat32(value);
    });
  } else if (sixchar === "010320") {
    data.forEach((value, i) => {
      formatedData[`power${i + 1}`] = HexToFloat32(value);
    });
  } else if (sixchar === "020378") {
    data.forEach((value, i) => {
      formatedData[`secondEnergy${i + 1}`] = hexToDecimal(value);
    });
  } else if (sixchar === "020320") {
    data.forEach((value, i) => {
      formatedData[`secondPower${i + 1}`] = HexToFloat32(value);
    });
  } else if (sixchar === "020310") {
    data.forEach((value, i) => {
      formatedData[`secondCurrent${i + 1}`] = HexToFloat32(value);
    });
  } else if (sixchar === "02030C") {
    data.forEach((value, i) => {
      formatedData[`secondVoltage${i + 1}`] = HexToFloat32(value);
    });
  }
  return formatedData;
};

exports.formatDataTIntVenco = (data = [], sixchar) => {
  const formatedData = {};
  if (sixchar === "010318") {
    data.forEach((value, i) => {
      formatedData[`power${i + 1}`] = HexToFloat32(value);
      // console.log("formatedDataenergy", formatedData);
    });
  } else if (sixchar === "010310") {
    data.forEach((value, i) => {
      formatedData[`voltage${i + 1}`] = HexToFloat32(value);
    });
  } else if (sixchar === "010314") {
    data.forEach((value, i) => {
      formatedData[`current${i + 1}`] = HexToFloat32(value);
    });
  } else if (sixchar === "010320") {
    data.forEach((value, i) => {
      formatedData[`energy${i + 1}`] = hexToDecimal(value);
    });
  }
  return formatedData;
};
// Current is 04
// Energy is 10
// Voltage is 08
// Power is 0C

exports.formatDataTIntBAT = (data = [], sixchar) => {
  const formatedData = {};
  if (sixchar === "020310") {
    data.forEach((value, i) => {
      formatedData[`energy${i + 1}`] = hexToDecimal(value);
      // console.log("formatedDataenergy", formatedData);
    });
  } else if (sixchar === "040310") {
    data.forEach((value, i) => {
      formatedData[`energy${i + 1}`] = hexToDecimal(value);
    });
  } else if (sixchar === "030310") {
    data.forEach((value, i) => {
      formatedData[`energy${i + 1}`] = hexToDecimal(value);
    });
  } else if (sixchar === "010310") {
    data.forEach((value, i) => {
      formatedData[`energy${i + 1}`] = hexToDecimal(value);
    });
  }
  return formatedData;
};

exports.splitWords = async (longText) => {
  const sixChar = longText.slice(0, 6);
  let lastText = longText.slice(6);
  console.log({ lastText });
  const wordsSplit = lastText.split("");

  let eightWords = [];
  let charCounter = "";
  for (const char of wordsSplit) {
    if (charCounter.length === 8) {
      eightWords = [...eightWords, charCounter];
      charCounter = "";
      // console.log("eightWords in forloop", eightWords);
    }
    charCounter = charCounter.concat(char);
    // console.log("charCounter in for loop", charCounter);
  }
  // console.log({ sixChar, eightWords });

  return {
    sixChar,
    eightWords,
  };
};

exports.multiplyByLongZero = (value) => {
  return value * 1000000000000000000000000000000000000000000;
};

exports.calculateDuration = (value) => {
  let values = value / 2;
  const dur = dayjs.duration(values, "minute");
  const hours = dur.hours();
  const minutes = dur.minutes();

  // return {
  //   hours,
  //   minutes,
  // };
  return hours + "h" + ":" + minutes + "m";
};
exports.calculateDuration2 = (value) => {
  let values = value;
  const dur = dayjs.duration(values, "m");
  const hours = dur.hours();
  const minutes = dur.minutes();

  // return {
  //   hours,
  //   minutes,
  // };
  return hours + "h" + ":" + minutes + "m";
};

exports.sendEmailNotification = async (lastMessageTime, topic) => {
  const timeDiff = dayjs().valueOf() - dayjs(lastMessageTime).valueOf();
  let NewMinutess = dayjs.duration(timeDiff).format("HH:mm");
  // minutes = now.getMinutes();
  // let lastime = tope.getMinutes() - new Date().getMinutes();
  // console.log(
  //   { NewMinutess, timeDiff, lastMessageTime },
  //   "NewMinutess format"
  //   // NewMinutess.format("HH:mm:")
  // );
  if (NewMinutess === "01:00" || NewMinutess === "12:00") {
    // console.log({ lastMessageTime, NewMinutess });

    await sendMailOauth(
      // process.env.EMAIL,
      [
        "iobotechltd@gmail.com",
        "essability@gmail.com",
        "essienv2022@gmail.com",
        "feyijimirachel@gmail.com",
        "osun4love@gmail.com",
        "danielosho43@gmail.com",
      ],
      `MQTT ERROR FOR ${topic}`,
      `<p>The mqtt topic <b>${topic}</b> is not sending response try and check for correction. Thanks!!   </p><br>`
    );
    // NewMinutess++;
    console.log("No Msg in ten minutes and want to send email notification");
  }
  console.log("No Msg in ten minutes");
};
exports.publishAfter30Mins = async (sendData30mins) => {
  const timeDiff = dayjs().valueOf() - dayjs(sendData30mins).valueOf();
  let NewMinutess30 = dayjs.duration(timeDiff).format("HH:mm");

  console.log({ NewMinutess30 });
  return { NewMinutess30 };
};
exports.sendEmailNotificationForGridAndGenOn = async (
  genAndGridIsONTime,
  genstatus,
  gridStatus,
  siteName
) => {
  const timeDiff = dayjs().valueOf() - dayjs(genAndGridIsONTime).valueOf();
  let NewMinutess = dayjs.duration(timeDiff).format("HH:mm");
  console.log(
    { NewMinutess, timeDiff, genAndGridIsONTime },
    "NewMinutess format"
    // NewMinutess.format("HH:mm:")
  );
  if (NewMinutess === "00:10" || NewMinutess === "01:00") {
    console.log({ genAndGridIsONTime, NewMinutess });

    await sendMailOauth(
      // process.env.EMAIL,
      [
        "iobotechltd@gmail.com",
        "essability@gmail.com",
        "Ronald.Amara@stanbicibtc.com",
        // "essienv2022@gmail.com",
        // "feyijimirachel@gmail.com",
        // "osun4love@gmail.com",
      ],
      ` GENERATOR AND GRID IS ON CURRENTLY FOR ${siteName}`,

      `<div style=" width: 100%; background: black">
        <div style="padding: 30px">
<p style="font-family: Verdana">Hi,</p>
          <br />
          <p
            style="
              font-weight: 100;
              font-size: 16px;
              line-height: 37px;
              font-family: Verdana;
              color: #f4f4fc;
              font-family: Verdana;
            "
          >
       The Generator and Grid are currently ON for <b>${siteName}</b>    <br>
          </p>
          <br />
          <div
            style="

              color: white;
              padding: 1px 0 10px 0;
            "
          >
          

             <p
              style="

                font-weight: 100;
                font-size: 20px;
                line-height: 57px;
                font-family: Verdana;
                margin: 10px;
              "
            >
         Generator and Grid  has been on for   <span
                style="
                  text-align: center;
                  font-weight: 100;
                  font-size: 30px;
                  line-height: 57px;
                  font-family: Verdana;
                  margin: 0px;
                "
                >${NewMinutess === "00:10" ? "10mins" : "1hr"}</span 
            </p>   

              
             <p
              style="

                font-weight: 100;
                font-size: 20px;
                line-height: 57px;
                font-family: Verdana;
                margin: 10px;
              "
            >
       Please kindly save diesel by switching to Grid and putting off the Generator.

        Thank you.
            </p>

          </div>
          <br />
          <br />
        </div>
        <!-- {{>footer}} -->
      </div>`
    );

    console.log("Di1 and di2 have been on");
  }
  console.log("DI1 and DI2 have been on and last else");
};
exports.sendEmailNotificationZero = async (lastMessageTime, topic) => {
  const timeDiffzero = dayjs().valueOf() - dayjs(lastMessageTime).valueOf();
  let NewMinutesszero = dayjs.duration(timeDiffzero).format("HH:mm");

  console.log(
    { timeDiffzero, NewMinutesszero, lastMessageTime },
    "NewMinutesszero format"
    // NewMinutess.format("HH:mm:")
  );
  if (
    NewMinutesszero === "00:02" ||
    NewMinutesszero === "06:00" ||
    NewMinutesszero === "12:00" ||
    NewMinutesszero === "18:00"
  ) {
    console.log({ lastMessageTime, NewMinutesszero });

    await sendMailOauth(
      // process.env.EMAIL,
      [
        "iobotechltd@gmail.com",
        "essability@gmail.com",
        "essienv2022@gmail.com",
        "feyijimirachel@gmail.com",
        "osun4love@gmail.com",
      ],
      `MQTT ERROR FOR ${topic}`,
      `<p>The mqtt topic <b>${topic}</b> Device has been tampered with. Thanks!!   </p><br>
         <p>Or contact those incharge for correction</p>`
    );
    // NewMinutess++;
    console.log("No Msg in ten minutes and want to send email notification");
  }
  console.log("No Msg in ten minutes");
};
exports.metroGardenSendEmailNotificationZero = async (
  lastMessageTime,
  topic
) => {
  const timeDiffzero = dayjs().valueOf() - dayjs(lastMessageTime).valueOf();
  let NewMinutesszero = dayjs.duration(timeDiffzero).format("HH:mm");

  console.log(
    { timeDiffzero, NewMinutesszero, lastMessageTime },
    "NewMinutesszero format"
    // NewMinutess.format("HH:mm:")
  );
  if (
    NewMinutesszero === "00:02" ||
    NewMinutesszero === "06:00" ||
    NewMinutesszero === "12:00" ||
    NewMinutesszero === "18:00"
  ) {
    console.log({ lastMessageTime, NewMinutesszero });

    await sendMailOauth(
      // process.env.EMAIL,
      [
        "iobotechltd@gmail.com",
        "essability@gmail.com",
        "essienv2022@gmail.com",
        "feyijimirachel@gmail.com",
        "osun4love@gmail.com",
        "harrison.a@filmorealestate.com",
      ],
      `MQTT ERROR FOR ${topic}`,
      `<p>The mqtt topic <b>${topic}</b> Device has been tampered with. Thanks!!   </p><br>
         <p>Or contact those incharge for correction</p>`
    );
    // NewMinutess++;
    console.log("No Msg in ten minutes and want to send email notification");
  }
  console.log("No Msg in ten minutes");
};
exports.sendEmailNotificationWhenOflline = async (count, topic) => {
  count++;
  console.log({ count });
  if (count === 60) {
    console.log({ count });

    await sendMailOauth(
      // process.env.EMAIL,
      [
        "iobotechltd@gmail.com",
        "osunkile4live@gmail.com",
        "feyijimirachel@gmail.com",
        "essability@gmail.com",
        "essienv2022@gmail.com",
      ],
      `MQTT ERROR FOR ${topic}`,
      `<p>The mqtt topic: <b>${topic}</b> is offline and not connected to the endpoint try and check for correction   </p>
        <br> <p>Treat as urgent and contact those in charge for retification</p>`
    );
    console.log("No Msg in ten minutes");
  }
};

exports.stopCountInterval = () => {
  console.log("it clear interval");
  clearInterval(myInterval);
};

exports.publishMqtt = async (client, message = {}, topic) => {
  // console.log({ client });
  await client.publish(
    "v1/devices/me/telemetry",
    JSON.stringify(message),
    { qos: 0, retain: false },
    (error) => {
      if (error) {
        console.error(error);
      }
      console.log(`it publish ${topic}  and response sent `);
    }
  );
};
// const now = new Date();
// const hour = now.getHours();
// const minutes = now.getMinutes();
// const years = new Date().getFullYear();
// const month = new Date().getMonth() + 1;
// const days = new Date().getDate();

exports.genRuntimesLogicGeneral = async (
  genDbName,
  statusDBName,
  responseData,
  topic,
  genDbNameSecond,
  statusDBNameSecond,
  getTanksByDeviceId
) => {
  try {
    const { years, month, days, hour, minutes } = timeConstruct();
    const genDataExistForToday = await genDbName.findOne({
      year: years,
      month: month,
      day: days,
      companyName: getTanksByDeviceId.companyName,
      deviceId: getTanksByDeviceId.deviceId,
      companyId: getTanksByDeviceId.companyId,
      serviceid: getTanksByDeviceId.serviceid,
      status: "active",
    });
    const genDataStatusExistForToday = await statusDBName.findOne({
      year: years,
      month: month,
      day: days,
      companyName: getTanksByDeviceId.companyName,
      deviceId: getTanksByDeviceId.deviceId,
      companyId: getTanksByDeviceId.companyId,
      serviceid: getTanksByDeviceId.serviceid,
      status: "active",
    });
    console.log({ genDataExistForToday, responseData });
    if (getTanksByDeviceId.isHavingTwoGen == true) {
      const genDataExistForTodaySecond = await genDbNameSecond.findOne({
        year: years,
        month: month,
        day: days,
        status: "active",
        companyName: getTanksByDeviceId.companyName,
        deviceId: getTanksByDeviceId.deviceId,
        companyId: getTanksByDeviceId.companyId,
        serviceid: getTanksByDeviceId.serviceid,
      });
      const genDataStatusExistForTodaySecond = await statusDBNameSecond.findOne(
        {
          year: years,
          month: month,
          day: days,
          status: "active",
          companyName: getTanksByDeviceId.companyName,
          deviceId: getTanksByDeviceId.deviceId,
          companyId: getTanksByDeviceId.companyId,
          serviceid: getTanksByDeviceId.serviceid,
        }
      );

      if (responseData.DI1 === "1") {
        if (!!genDataExistForToday) {
          if (
            !!genDataStatusExistForToday &&
            genDataStatusExistForToday.generatorStatus === "OFF"
          ) {
            genDataExistForToday.holdPreviousGenData =
              genDataExistForToday.newTimeDiff;
            //holdPreviousGendata
            genDataExistForToday.newDateCreatedAt = dayjs();
            genDataExistForToday.isNewTimeDiff = true;

            const updatedDate = await genDataExistForToday.save();
            if (updatedDate) {
              genDataStatusExistForToday.generatorStatus = "ON";
              const updatedStatus = await genDataStatusExistForToday.save();
              !!updatedStatus
                ? console.log("it updated gen status")
                : console.log("it not gen updated status");
            } else {
              console.log("not updated gen new date");
            }
          } else {
            //update

            let dateCreated = dayjs(genDataExistForToday?.newDateCreatedAt);
            let dateUpdated = dayjs(genDataExistForToday?.updatedAt);
            let timeDiffGen = dateUpdated.diff(dateCreated, "m");
            console.log({ timeDiffGen });
            let newtimesGen =
              timeDiffGen + genDataExistForToday.holdPreviousGenData;
            console.log({ newtimesGen });
            if (genDataExistForToday.isNewTimeDiff === true) {
              console.log(
                "its neew time differnece",
                genDataExistForToday.isNewTimeDiff,
                "timeDiff in true",
                timeDiffGen,
                "newtimes",
                newtimesGen
              );
              genDataExistForToday.isGenOnCount =
                genDataExistForToday.isGenOnCount + Number(responseData.DI1);
              genDataExistForToday.newTimeDiff = newtimesGen;

              const updateNewTimeDiffData = await genDataExistForToday.save();
              !!updateNewTimeDiffData
                ? console.log("it updated gen new time diff ")
                : console.log("Not updated gen time diff ");
            } else {
              genDataExistForToday.isGenOnCount =
                genDataExistForToday.isGenOnCount + Number(responseData.DI1);
              genDataExistForToday.timeDiff = timeDiffGen;
              const updateGenData = await genDataExistForToday.save();

              console.log({ updateGenData });
              if (!!updateGenData) {
                //publish grid runtime

                if (!!genDataStatusExistForToday) {
                  //update status
                  genDataStatusExistForToday.generatorStatus =
                    responseData.DI1 === "1" && "ON";
                  const updateGenStatus =
                    await genDataStatusExistForToday.save();
                  if (!!updateGenStatus) {
                    console.log("Gen Status  updated successfully");
                  } else {
                    console.log("Gen Status  not updated successfully");
                  }
                } else {
                  const savegenStatusToDB = await new statusDBName({
                    topic,
                    generatorStatus: responseData.DI1,
                    year: years,
                    month: month,
                    day: days,
                    companyName: getTanksByDeviceId.companyName,
                    deviceId: getTanksByDeviceId.deviceId,
                    companyId: getTanksByDeviceId.companyId,
                    serviceid: getTanksByDeviceId.serviceid,
                    dateCreatedAt: dayjs(),
                  }).save();
                  console.log({ savegenStatusToDB });
                  if (!!savegenStatusToDB) {
                    console.log("Gen status save successfully");
                  } else {
                    console.log("Gen. status was not  successful");
                  }
                }
              } else {
                console.log("error while  updating data");
              }
            }
          }
          //update
        } else if (hour === 0 && minutes == 0) {
          // FirstHoldGenPreviousDiffCorona = 0;
          const savegenRunTimeOnToDB = await new genDbName({
            topic,
            generatorOnTime: responseData.DI1,
            year: years,
            month: month,
            day: days,
            timeDiff: 0,
            newTimeDiff: 0,
            holdPreviousGenData: 0,
            newDateCreatedAt: dayjs(),
            isGenOnCount: responseData.DI1,
            companyName: getTanksByDeviceId.companyName,
            deviceId: getTanksByDeviceId.deviceId,
            companyId: getTanksByDeviceId.companyId,
            serviceid: getTanksByDeviceId.serviceid,
            dateCreatedAt: dayjs(),
          }).save();
          console.log({ savegenRunTimeOnToDB });
          if (!!savegenRunTimeOnToDB) {
            const genDataStatusExistForToday = await statusDBName.findOne({
              year: years,
              month: month,
              day: days,
              status: "active",
            });
            if (!!genDataStatusExistForToday) {
              //update status
              genDataStatusExistForToday.generatorStatus =
                responseData.DI1 === "1" && "ON";
              const updateGenStatus = await genDataStatusExistForToday.save();
              if (!!updateGenStatus) {
                console.log("Gen Status  updated successfully");
              } else {
                console.log("Gen Status  not updated successfully");
              }
            } else {
              const savegenStatusToDB = await new statusDBName({
                topic,
                generatorStatus: responseData.DI1,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
              }).save();
              console.log({ savegenStatusToDB });
              if (!!savegenStatusToDB) {
                console.log("Gen status save successfully");
              } else {
                console.log("Gen. status was not  successful");
              }
            }
            console.log("it saves generator run time on");
          } else {
            console.log("it not saves generator run time on");
          }
        } else {
          const savegenRunTimeOnToDB = await new genDbName({
            topic,
            generatorOnTime: responseData.DI1,
            year: years,
            month: month,
            day: days,
            timeDiff: 0,
            newTimeDiff: 0,
            holdPreviousGenData: 0,
            newDateCreatedAt: dayjs(),
            isGenOnCount: responseData.DI1,
            dateCreatedAt: dayjs(),
            companyName: getTanksByDeviceId.companyName,
            deviceId: getTanksByDeviceId.deviceId,
            companyId: getTanksByDeviceId.companyId,
            serviceid: getTanksByDeviceId.serviceid,
          }).save();
          console.log({ savegenRunTimeOnToDB });
          if (!!savegenRunTimeOnToDB) {
            if (!!genDataStatusExistForToday) {
              //update status
              genDataStatusExistForToday.generatorStatus =
                responseData.DI1 === "1" && "ON";
              const updateGenStatus = await genDataStatusExistForToday.save();
              if (!!updateGenStatus) {
                console.log("Gen Status  updated successfully");
              } else {
                console.log("Gen Status  not updated successfully");
              }
            } else {
              const savegenStatusToDB = await new statusDBName({
                topic,
                generatorStatus: responseData.DI1,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                companyName: getTanksByDeviceId.companyName,
                deviceId: getTanksByDeviceId.deviceId,
                companyId: getTanksByDeviceId.companyId,
                serviceid: getTanksByDeviceId.serviceid,
              }).save();
              console.log({ savegenStatusToDB });
              if (!!savegenStatusToDB) {
                console.log("Gen status save successfully");
              } else {
                console.log("Gen. status was not  successful");
              }
            }
            console.log("it saves generator run time on");
          } else {
            console.log("it not saves generator run time on");
          }
        }
      } else if (responseData.DI2 === "1") {
        if (!!genDataExistForTodaySecond) {
          if (
            !!genDataStatusExistForTodaySecond &&
            genDataStatusExistForTodaySecond.generatorStatus === "OFF"
          ) {
            genDataExistForToday.holdPreviousGenData =
              genDataExistForTodaySecond.newTimeDiff;
            genDataExistForTodaySecond.newDateCreatedAt = dayjs();
            genDataExistForTodaySecond.isNewTimeDiff = true;

            const updatedDate = await genDataExistForTodaySecond.save();
            if (updatedDate) {
              genDataStatusExistForTodaySecond.generatorStatus = "ON";
              const updatedStatus =
                await genDataStatusExistForTodaySecond.save();
              !!updatedStatus
                ? console.log("it updated gen status")
                : console.log("it not gen updated status");
            } else {
              console.log("not updated gen new date");
            }
          } else {
            //update

            let dateCreated = dayjs(
              genDataExistForTodaySecond?.newDateCreatedAt
            );
            let dateUpdated = dayjs(genDataExistForTodaySecond?.updatedAt);
            let timeDiffGen = dateUpdated.diff(dateCreated, "m");
            console.log({ timeDiffGen });
            let newtimesGen =
              timeDiffGen + genDataExistForToday.holdPreviousGenData;
            console.log({ newtimesGen });
            if (genDataExistForTodaySecond.isNewTimeDiff === true) {
              console.log(
                "its neew time differnece",
                genDataExistForTodaySecond.isNewTimeDiff,
                "timeDiff in true",
                timeDiffGen,
                "newtimes",
                newtimesGen
              );
              genDataExistForTodaySecond.isGenOnCount =
                genDataExistForTodaySecond.isGenOnCount +
                Number(responseData.DI2);
              genDataExistForTodaySecond.newTimeDiff = newtimesGen;

              const updateNewTimeDiffData =
                await genDataExistForTodaySecond.save();
              !!updateNewTimeDiffData
                ? console.log("it updated gen new time diff ")
                : console.log("Not updated gen time diff ");
            } else {
              genDataExistForTodaySecond.isGenOnCount =
                genDataExistForTodaySecond.isGenOnCount +
                Number(responseData.DI2);
              genDataExistForTodaySecond.timeDiff = timeDiffGen;
              const updateGenData = await genDataExistForTodaySecond.save();

              console.log({ updateGenData });
              if (!!updateGenData) {
                //publish grid runtime

                if (!!genDataStatusExistForTodaySecond) {
                  //update status
                  genDataStatusExistForTodaySecond.generatorStatus =
                    responseData.DI2 === "1" && "ON";
                  const updateGenStatus =
                    await genDataStatusExistForTodaySecond.save();
                  if (!!updateGenStatus) {
                    console.log("Gen Status  updated successfully");
                  } else {
                    console.log("Gen Status  not updated successfully");
                  }
                } else {
                  const savegenStatusToDB = await new statusDBNameSecond({
                    topic,
                    generatorStatus: responseData.DI2,
                    year: years,
                    month: month,
                    day: days,
                    dateCreatedAt: dayjs(),
                    companyName: getTanksByDeviceId.companyName,
                    deviceId: getTanksByDeviceId.deviceId,
                    companyId: getTanksByDeviceId.companyId,
                    serviceid: getTanksByDeviceId.serviceid,
                  }).save();
                  console.log({ savegenStatusToDB });
                  if (!!savegenStatusToDB) {
                    console.log("Gen status save successfully");
                  } else {
                    console.log("Gen. status was not  successful");
                  }
                }
              } else {
                console.log("error while  updating data");
              }
            }
          }
          //update
        } else if (hour === 0 && minutes == 0) {
          const savegenRunTimeOnToDB = await new genDbNameSecond({
            topic,
            generatorOnTime: responseData.DI2,
            year: years,
            month: month,
            day: days,
            timeDiff: 0,
            newTimeDiff: 0,
            holdPreviousGenData: 0,
            newDateCreatedAt: dayjs(),
            isGenOnCount: responseData.DI2,
            companyName: getTanksByDeviceId.companyName,
            deviceId: getTanksByDeviceId.deviceId,
            companyId: getTanksByDeviceId.companyId,
            serviceid: getTanksByDeviceId.serviceid,
            dateCreatedAt: dayjs(),
          }).save();
          console.log({ savegenRunTimeOnToDB });
          if (!!savegenRunTimeOnToDB) {
            if (!!genDataStatusExistForTodaySecond) {
              //update status
              genDataStatusExistForTodaySecond.generatorStatus =
                responseData.DI2 === "1" && "ON";
              const updateGenStatus =
                await genDataStatusExistForTodaySecond.save();
              if (!!updateGenStatus) {
                console.log("Gen Status  updated successfully");
              } else {
                console.log("Gen Status  not updated successfully");
              }
            } else {
              const savegenStatusToDB = await new statusDBNameSecond({
                topic,
                generatorStatus: responseData.DI2,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                companyName: getTanksByDeviceId.companyName,
                deviceId: getTanksByDeviceId.deviceId,
                companyId: getTanksByDeviceId.companyId,
                serviceid: getTanksByDeviceId.serviceid,
              }).save();
              console.log({ savegenStatusToDB });
              if (!!savegenStatusToDB) {
                console.log("Gen status save successfully");
              } else {
                console.log("Gen. status was not  successful");
              }
            }
            console.log("it saves generator run time on");
          } else {
            console.log("it not saves generator run time on");
          }
        } else {
          const savegenRunTimeOnToDB = await new genDbNameSecond({
            topic,
            generatorOnTime: responseData.DI2,
            year: years,
            month: month,
            day: days,
            timeDiff: 0,
            newTimeDiff: 0,
            holdPreviousGenData: 0,
            newDateCreatedAt: dayjs(),
            isGenOnCount: responseData.DI2,
            companyName: getTanksByDeviceId.companyName,
            deviceId: getTanksByDeviceId.deviceId,
            serviceid: getTanksByDeviceId.serviceid,
            companyId: getTanksByDeviceId.companyId,
            dateCreatedAt: dayjs(),
          }).save();
          console.log({ savegenRunTimeOnToDB });
          if (!!savegenRunTimeOnToDB) {
            if (!!genDataStatusExistForTodaySecond) {
              //update status
              genDataStatusExistForTodaySecond.generatorStatus =
                responseData.DI2 === "1" && "ON";
              const updateGenStatus =
                await genDataStatusExistForTodaySecond.save();
              if (!!updateGenStatus) {
                console.log("Gen Status  updated successfully");
              } else {
                console.log("Gen Status  not updated successfully");
              }
            } else {
              const savegenStatusToDB = await new statusDBNameSecond({
                topic,
                generatorStatus: responseData.DI2,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                companyName: getTanksByDeviceId.companyName,
                deviceId: getTanksByDeviceId.deviceId,
                companyId: getTanksByDeviceId.companyId,
                serviceid: getTanksByDeviceId.serviceid,
              }).save();
              console.log({ savegenStatusToDB });
              if (!!savegenStatusToDB) {
                console.log("Gen status save successfully");
              } else {
                console.log("Gen. status was not  successful");
              }
            }
            console.log("it saves generator run time on");
          } else {
            console.log("it not saves generator run time on");
          }
        }
      }
    } else if (getTanksByDeviceId.isHavingTwoGen === false) {
      if (responseData.DI1 === "1") {
        if (!!genDataExistForToday) {
          if (
            !!genDataStatusExistForToday &&
            genDataStatusExistForToday.generatorStatus === "OFF"
          ) {
            genDataExistForToday.holdPreviousGenData =
              genDataExistForToday.newTimeDiff;
            genDataExistForToday.newDateCreatedAt = dayjs();
            genDataExistForToday.isNewTimeDiff = true;

            const updatedDate = await genDataExistForToday.save();
            if (updatedDate) {
              genDataStatusExistForToday.generatorStatus = "ON";
              const updatedStatus = await genDataStatusExistForToday.save();
              !!updatedStatus
                ? console.log("it updated gen status")
                : console.log("it not gen updated status");
            } else {
              console.log("not updated gen new date");
            }
          } else {
            //update

            let dateCreated = dayjs(genDataExistForToday?.newDateCreatedAt);
            let dateUpdated = dayjs(genDataExistForToday?.updatedAt);
            let timeDiffGen = dateUpdated.diff(dateCreated, "m");
            console.log({ timeDiffGen, holdGenPreviousDiffIfeGrandResort });
            let newtimesGen =
              timeDiffGen + genDataExistForToday.holdPreviousGenData;
            console.log({ newtimesGen });
            if (genDataExistForToday.isNewTimeDiff === true) {
              console.log(
                "its neew time differnece",
                genDataExistForToday.isNewTimeDiff,
                "timeDiff in true",
                timeDiffGen,
                "newtimes",
                newtimesGen
              );
              genDataExistForToday.isGenOnCount =
                genDataExistForToday.isGenOnCount + Number(responseData.DI1);
              genDataExistForToday.newTimeDiff = newtimesGen;

              const updateNewTimeDiffData = await genDataExistForToday.save();
              !!updateNewTimeDiffData
                ? console.log("it updated gen new time diff ")
                : console.log("Not updated gen time diff ");
            } else {
              genDataExistForToday.isGenOnCount =
                genDataExistForToday.isGenOnCount + Number(responseData.DI1);
              genDataExistForToday.timeDiff = timeDiffGen;
              const updateGenData = await genDataExistForToday.save();

              console.log({ updateGenData });
              if (!!updateGenData) {
                //publish grid runtime

                if (!!genDataStatusExistForToday) {
                  //update status
                  genDataStatusExistForToday.generatorStatus =
                    responseData.DI1 === "1" && "ON";
                  const updateGenStatus =
                    await genDataStatusExistForToday.save();
                  if (!!updateGenStatus) {
                    console.log("Gen Status  updated successfully");
                  } else {
                    console.log("Gen Status  not updated successfully");
                  }
                } else {
                  const savegenStatusToDB = await new statusDBName({
                    topic,
                    generatorStatus: responseData.DI1,
                    year: years,
                    month: month,
                    day: days,
                    dateCreatedAt: dayjs(),
                    companyName: getTanksByDeviceId.companyName,
                    deviceId: getTanksByDeviceId.deviceId,
                    companyId: getTanksByDeviceId.companyId,
                    tag: getTanksByDeviceId.tag,
                    serviceid: getTanksByDeviceId.serviceid,
                  }).save();
                  console.log({ savegenStatusToDB });
                  if (!!savegenStatusToDB) {
                    console.log("Gen status save successfully");
                  } else {
                    console.log("Gen. status was not  successful");
                  }
                }
              } else {
                console.log("error while  updating data");
              }
            }
          }
          //update
        } else if (hour === 0 && minutes == 0) {
          const savegenRunTimeOnToDB = await new genDbName({
            topic,
            generatorOnTime: responseData.DI1,
            year: years,
            month: month,
            day: days,
            timeDiff: 0,
            newTimeDiff: 0,
            newDateCreatedAt: dayjs(),
            isGenOnCount: responseData.DI1,
            holdPreviousGenData: 0,
            dateCreatedAt: dayjs(),
            companyName: getTanksByDeviceId.companyName,
            deviceId: getTanksByDeviceId.deviceId,
            companyId: getTanksByDeviceId.companyId,
            tag: getTanksByDeviceId.tag,
            serviceid: getTanksByDeviceId.serviceid,
          }).save();
          console.log({ savegenRunTimeOnToDB });
          if (!!savegenRunTimeOnToDB) {
            const genDataStatusExistForToday = await statusDBName.findOne({
              year: years,
              month: month,
              day: days,
              status: "active",
              companyName: getTanksByDeviceId.companyName,
              deviceId: getTanksByDeviceId.deviceId,
              companyId: getTanksByDeviceId.companyId,
            });
            if (!!genDataStatusExistForToday) {
              //update status
              genDataStatusExistForToday.generatorStatus =
                responseData.DI1 === "1" && "ON";
              const updateGenStatus = await genDataStatusExistForToday.save();
              if (!!updateGenStatus) {
                console.log("Gen Status  updated successfully");
              } else {
                console.log("Gen Status  not updated successfully");
              }
            } else {
              const savegenStatusToDB = await new statusDBName({
                topic,
                generatorStatus: responseData.DI1,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                companyName: getTanksByDeviceId.companyName,
                deviceId: getTanksByDeviceId.deviceId,
                companyId: getTanksByDeviceId.companyId,
                tag: getTanksByDeviceId.tag,
                serviceid: getTanksByDeviceId.serviceid,
              }).save();
              console.log({ savegenStatusToDB });
              if (!!savegenStatusToDB) {
                console.log("Gen status save successfully");
              } else {
                console.log("Gen. status was not  successful");
              }
            }
            console.log("it saves generator run time on");
          } else {
            console.log("it not saves generator run time on");
          }
        } else {
          const savegenRunTimeOnToDB = await new genDbName({
            topic,
            generatorOnTime: responseData.DI1,
            year: years,
            month: month,
            day: days,
            timeDiff: 0,
            newTimeDiff: 0,
            newDateCreatedAt: dayjs(),
            isGenOnCount: responseData.DI1,
            dateCreatedAt: dayjs(),
            holdPreviousGenData: 0,
            companyName: getTanksByDeviceId.companyName,
            deviceId: getTanksByDeviceId.deviceId,
            companyId: getTanksByDeviceId.companyId,
            tag: getTanksByDeviceId.tag,
            serviceid: getTanksByDeviceId.serviceid,
          }).save();
          console.log({ savegenRunTimeOnToDB });
          if (!!savegenRunTimeOnToDB) {
            const genDataStatusExistForToday = await statusDBName.findOne({
              year: years,
              month: month,
              day: days,
              status: "active",
              companyName: getTanksByDeviceId.companyName,
              deviceId: getTanksByDeviceId.deviceId,
              companyId: getTanksByDeviceId.companyId,
              serviceid: getTanksByDeviceId.serviceid,
            });
            if (!!genDataStatusExistForToday) {
              //update status
              genDataStatusExistForToday.generatorStatus =
                responseData.DI1 === "1" && "ON";
              const updateGenStatus = await genDataStatusExistForToday.save();
              if (!!updateGenStatus) {
                console.log("Gen Status  updated successfully");
              } else {
                console.log("Gen Status  not updated successfully");
              }
            } else {
              const savegenStatusToDB = await new statusDBName({
                topic,
                generatorStatus: responseData.DI1,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                companyName: getTanksByDeviceId.companyName,
                deviceId: getTanksByDeviceId.deviceId,
                companyId: getTanksByDeviceId.companyId,
                serviceid: getTanksByDeviceId.serviceid,
                tag: getTanksByDeviceId.tag,
              }).save();
              console.log({ savegenStatusToDB });
              if (!!savegenStatusToDB) {
                console.log("Gen status save successfully");
              } else {
                console.log("Gen. status was not  successful");
              }
            }
            console.log("it saves generator run time on");
          } else {
            console.log("it not saves generator run time on");
          }
        }
      }
    }
  } catch (error) {
    console.log("error runtime", error);
  }
};
exports.genstatus = async (
  genStatusDb,
  responseData,
  topic,
  getTanksByDeviceId
) => {
  try {
    const { years, month, days } = timeConstruct();
    const genDataStatusExistForToday = await genStatusDb
      .findOne({
        year: years,
        month: month,
        day: days,
        companyName: getTanksByDeviceId.companyName,
        deviceId: getTanksByDeviceId.deviceId,
        companyId: getTanksByDeviceId.companyId,
        serviceid: getTanksByDeviceId.serviceid,
        status: "active",
      })
      .sort({ dateCreatedAt: -1 });
    console.log({ genDataStatusExistForToday });
    if (!!genDataStatusExistForToday) {
      //update status
      genDataStatusExistForToday.generatorStatus =
        responseData === "0" && "OFF";
      const updateGenStatus = await genDataStatusExistForToday.save();
      if (!!updateGenStatus) {
        console.log("Gen Status  updated successfully");
      } else {
        console.log("Gen Status  not updated successfully");
      }
    } else {
      const savegenStatusToDB = await new genStatusDb({
        topic,
        generatorStatus: responseData === "0" && "OFF",
        year: years,
        month: month,
        day: days,
        dateCreatedAt: dayjs(),
        companyName: getTanksByDeviceId.companyName,
        deviceId: getTanksByDeviceId.deviceId,
        companyId: getTanksByDeviceId.companyId,
        serviceid: getTanksByDeviceId.serviceid,
        tag: getTanksByDeviceId.tag,
      }).save();
      if (!!savegenStatusToDB) {
        console.log("Gen status save successfully");
      } else {
        console.log("Gen. status was not  successful");
      }
    }
  } catch (error) {
    console.log("error status", error);
  }
};
exports.gridstatus = async (
  gridStatusDb,
  responseData,
  topic,
  energyServiceObject
) => {
  try {
    const { years, month, days } = timeConstruct();
    const gridDataStatusExistForToday = await gridStatusDb
      .findOne({
        year: years,
        month: month,
        day: days,
        companyName: energyServiceObject.companyName,
        deviceId: energyServiceObject.deviceId,
        companyId: energyServiceObject.companyId,
        serviceid: getTanksByDeviceId.serviceid,
        status: "active",
      })
      .sort({ dateCreatedAt: -1 });
    console.log({ gridDataStatusExistForToday });
    if (!!gridDataStatusExistForToday) {
      //update status
      gridDataStatusExistForToday.gridStatus = responseData === "0" && "OFF";
      const updateGenStatus = await gridDataStatusExistForToday.save();
      if (!!updateGenStatus) {
        console.log("Grid Status  updated successfully");
      } else {
        console.log("grid Status  not updated successfully");
      }
    } else {
      const savegenStatusToDB = await new gridStatusDb({
        topic,
        gridStatus: responseData === "0" && "OFF",
        year: years,
        month: month,
        day: days,
        dateCreatedAt: dayjs(),
        companyName: energyServiceObject.companyName,
        deviceId: energyServiceObject.deviceId,
        companyId: energyServiceObject.companyId,
        tag: energyServiceObject.tag,
        serviceid: getTanksByDeviceId.serviceid,
      }).save();
      if (!!savegenStatusToDB) {
        console.log("Grid status save successfully");
      } else {
        console.log("Grid. status was not  successful");
      }
    }
  } catch (error) {
    console.log("error status", error);
  }
};
exports.reconnects = (data, client) => {
  console.log("it enter reconnect");
  data.length > 0 &&
    data.map((data) => {
      if (data.isnewTopic === true) {
        return new Promise((resolve, reject) => {
          client.end(true, {}, () => {
            client.reconnect();
            data.isnewTopic = false;
            let updateData = data.save();
            if (!!updateData) {
              resolve("it update new topic");
            } else {
              reject("it did not update new topic");
            }
          });
        });
      }
    });
};

exports.gridAndGenRuntimesLogicGeneral = async (
  gridDbName,
  gridStatusDBName,
  responseData,
  topic,
  genDbName,
  genStatusDBName,
  energyServiceObject
) => {
  try {
    const { years, month, days, hour, minutes } = timeConstruct();
    const gridDataExistForToday = await gridDbName.findOne({
      year: years,
      month: month,
      day: days,
      companyName: energyServiceObject.companyName,
      deviceId: energyServiceObject.deviceId,
      companyId: energyServiceObject.companyId,
      serviceid: energyServiceObject.serviceid,
      status: "active",
    });
    const gridDataStatusExistForToday = await gridStatusDBName.findOne({
      year: years,
      month: month,
      day: days,
      companyName: energyServiceObject.companyName,
      deviceId: energyServiceObject.deviceId,
      companyId: energyServiceObject.companyId,
      serviceid: energyServiceObject.serviceid,
      status: "active",
    });
    console.log({ gridDataExistForToday, responseData });
    if (energyServiceObject.isHavingGenAndGrid == true) {
      const genDataExistForToday = await genDbName.findOne({
        year: years,
        month: month,
        day: days,
        status: "active",
        companyName: energyServiceObject.companyName,
        deviceId: energyServiceObject.deviceId,
        companyId: energyServiceObject.companyId,
        serviceid: energyServiceObject.serviceid,
      });
      const genDataStatusExistForTodaySecond = await genStatusDBName.findOne({
        year: years,
        month: month,
        day: days,
        status: "active",
        companyName: energyServiceObject.companyName,
        deviceId: energyServiceObject.deviceId,
        companyId: energyServiceObject.companyId,
        serviceid: energyServiceObject.serviceid,
      });

      if (responseData.DI1 === "1") {
        if (!!gridDataExistForToday) {
          if (
            !!gridDataStatusExistForToday &&
            gridDataStatusExistForToday.gridStatus === "OFF"
          ) {
            gridDataExistForToday.holdPreviousGridData =
              gridDataExistForToday.newTimeDiff;
            gridDataExistForToday.newDateCreatedAt = dayjs();
            gridDataExistForToday.isNewTimeDiff = true;
            const updatedDate = gridDataExistForToday.save();
            if (updatedDate) {
              gridDataStatusExistForToday.gridStatus = "ON";
              const updatedStatus = gridDataStatusExistForToday.save();
              !!updatedStatus
                ? console.log("it updated status")
                : console.log("it not updated status");
            } else {
              console.log("not updated new date");
            }
          } else {
            //update

            let dateCreated = dayjs(gridDataExistForToday?.newDateCreatedAt);
            let dateUpdated = dayjs(gridDataExistForToday?.updatedAt);
            let timeDiffs = dateUpdated.diff(dateCreated, "m");
            console.log({ timeDiffs });
            // get the last minutes b4 grid off and add it to current minutes
            let newtimes =
              timeDiffs + gridDataExistForToday.holdPreviousGridData;

            if (gridDataExistForToday.isNewTimeDiff === true) {
              console.log(
                "its neew time differnece",
                gridDataExistForToday.isNewTimeDiff,
                "timeDiff in true",
                timeDiffs,
                "newtimes",
                newtimes
              );
              gridDataExistForToday.isGridOnCount =
                gridDataExistForToday.isGridOnCount + 1;
              gridDataExistForToday.newTimeDiff = newtimes;

              const updateNewTimeDiffData = await gridDataExistForToday.save();
              !!updateNewTimeDiffData
                ? console.log("it updated new time diff ")
                : console.log("Not updated time diff ");
            } else {
              gridDataExistForToday.isGridOnCount =
                gridDataExistForToday.isGridOnCount + 1;
              gridDataExistForToday.timeDiff = timeDiffs;

              const updateGridData = await gridDataExistForToday.save();
              console.log({ updateGridData });
              if (!!updateGridData) {
                if (!!gridDataStatusExistForToday) {
                  //update status
                  gridDataStatusExistForToday.gridStatus =
                    responseData.DI1 === "1" && "ON";
                  const updateGridStatus =
                    await gridDataStatusExistForToday.save();
                  console.log({ updateGridStatus });
                  if (!!updateGridStatus) {
                    console.log("Grid Status  updated successfully");
                  } else {
                    console.log("Grid Status  not updated successfully");
                  }
                } else {
                  const saveGridStatusToDB = await new gridStatusDBName({
                    topic,
                    gridStatus: responseData.DI1 === "1" && "ON",
                    year: years,
                    month: month,
                    day: days,
                    dateCreatedAt: dayjs(),
                    companyName: energyServiceObject.companyName,
                    deviceId: energyServiceObject.deviceId,
                    companyId: energyServiceObject.companyId,
                    tag: energyServiceObject.tag,
                    serviceid: energyServiceObject.serviceid,
                  }).save();
                  if (!!saveGridStatusToDB) {
                    console.log("Grid status save successfully");
                  } else {
                    console.log("Grid. status was not  successful");
                  }
                }
              } else {
                console.log("error while  updating data");
              }
            }
          }
        } else if (hour === 0 && minutes == 0) {
          const saveGridRunTimeOnToDB = await new gridDbName({
            topic,
            gridOnTime: responseData.DI1,
            year: years,
            month: month,
            day: days,
            timeDiff: 0,
            newTimeDiff: 0,
            holdPreviousGridData: 0,
            newDateCreatedAt: dayjs(),
            isGridOnCount: responseData,
            dateCreatedAt: dayjs(),
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            companyId: energyServiceObject.companyId,
            tag: energyServiceObject.tag,
            serviceid: energyServiceObject.serviceid,
          }).save();

          console.log({ saveGridRunTimeOnToDB });
          if (!!saveGridRunTimeOnToDB) {
            if (!!gridDataStatusExistForToday) {
              //update status
              gridDataStatusExistForToday.gridStatus =
                responseData.DI1 === "1" && "ON";
              const updateGridStatus = await gridDataStatusExistForToday.save();
              console.log({ updateGridStatus });
              if (!!updateGridStatus) {
                console.log("Grid Status  updated successfully");
              } else {
                console.log("Grid Status  not updated successfully");
              }
            } else {
              const saveGridStatusToDB = await new gridStatusDBName({
                topic,
                gridStatus: responseData.DI1 === "1" && "ON",
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                companyId: energyServiceObject.companyId,
                tag: energyServiceObject.tag,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveGridStatusToDB) {
                console.log("Grid status save successfully");
              } else {
                console.log("Grid. status was not  successful");
              }
            }
            console.log("it saves StanbicAbj generator run time on");
          } else {
            console.log("it not saves generator run time on");
          }
        } else {
          const saveGridRunTimeOnToDB = await new gridDbName({
            topic,
            gridOnTime: responseData.DI1,
            year: years,
            month: month,
            day: days,
            timeDiff: 0,
            newTimeDiff: 0,
            holdPreviousGridData: 0,
            newDateCreatedAt: dayjs(),
            isGridOnCount: responseData.DI1,
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            companyId: energyServiceObject.companyId,
            tag: energyServiceObject.tag,
            serviceid: energyServiceObject.serviceid,
            dateCreatedAt: dayjs(),
          }).save();

          console.log({ saveGridRunTimeOnToDB });
          if (!!saveGridRunTimeOnToDB) {
            if (!!gridDataStatusExistForToday) {
              //update status
              gridDataStatusExistForToday.gridStatus =
                responseData.DI1 === "1" && "ON";
              const updateGridStatus = await gridDataStatusExistForToday.save();
              console.log({ updateGridStatus });
              if (!!updateGridStatus) {
                console.log("Grid Status  updated successfully");
              } else {
                console.log("Grid Status  not updated successfully");
              }
            } else {
              const saveGridStatusToDB = await new gridStatusDBName({
                topic,
                gridStatus: responseData.DI1 === "1" && "ON",
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                companyId: energyServiceObject.companyId,
                tag: energyServiceObject.tag,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveGridStatusToDB) {
                console.log("Grid status save successfully");
              } else {
                console.log("Grid. status was not  successful");
              }
            }
            console.log("it saves StanbicAbj generator run time on");
          } else {
            console.log("it not saves generator run time on");
          }
        }
      } else if (responseData.DI2 === "1") {
        if (!!genDataExistForToday) {
          if (
            !!genDataStatusExistForTodaySecond &&
            genDataStatusExistForTodaySecond.generatorStatus === "OFF"
          ) {
            genDataExistForToday.holdPreviousGenData =
              genDataExistForToday.newTimeDiff;
            genDataExistForToday.newDateCreatedAt = dayjs();
            genDataExistForToday.isNewTimeDiff = true;

            const updatedDate = await genDataExistForToday.save();
            if (updatedDate) {
              genDataStatusExistForTodaySecond.generatorStatus = "ON";
              const updatedStatus =
                await genDataStatusExistForTodaySecond.save();
              !!updatedStatus
                ? console.log("it updated gen status")
                : console.log("it not gen updated status");
            } else {
              console.log("not updated gen new date");
            }
          } else {
            //update

            let dateCreated = dayjs(genDataExistForToday?.newDateCreatedAt);
            let dateUpdated = dayjs(genDataExistForToday?.updatedAt);
            let timeDiffGen = dateUpdated.diff(dateCreated, "m");
            console.log({ timeDiffGen });
            let newtimesGen =
              timeDiffGen + genDataExistForToday.holdPreviousGenData;
            console.log({ newtimesGen });
            if (genDataExistForToday.isNewTimeDiff === true) {
              console.log(
                "its neew time differnece",
                genDataExistForToday.isNewTimeDiff,
                "timeDiff in true",
                timeDiffGen,
                "newtimes",
                newtimesGen
              );
              genDataExistForToday.isGenOnCount =
                genDataExistForToday.isGenOnCount + Number(responseData.DI2);
              genDataExistForToday.newTimeDiff = newtimesGen;

              const updateNewTimeDiffData = await genDataExistForToday.save();
              !!updateNewTimeDiffData
                ? console.log("it updated gen new time diff ")
                : console.log("Not updated gen time diff ");
            } else {
              genDataExistForToday.isGenOnCount =
                genDataExistForToday.isGenOnCount + Number(responseData.DI2);
              genDataExistForToday.timeDiff = timeDiffGen;
              const updateGenData = await genDataExistForToday.save();

              console.log({ updateGenData });
              if (!!updateGenData) {
                //publish grid runtime

                if (!!genDataStatusExistForTodaySecond) {
                  //update status
                  genDataStatusExistForTodaySecond.generatorStatus =
                    responseData.DI2 === "1" && "ON";
                  const updateGenStatus =
                    await genDataStatusExistForTodaySecond.save();
                  if (!!updateGenStatus) {
                    console.log("Gen Status  updated successfully");
                  } else {
                    console.log("Gen Status  not updated successfully");
                  }
                } else {
                  const savegenStatusToDB = await new genStatusDBName({
                    topic,
                    generatorStatus: responseData.DI2,
                    year: years,
                    month: month,
                    day: days,
                    dateCreatedAt: dayjs(),
                    companyName: energyServiceObject.companyName,
                    deviceId: energyServiceObject.deviceId,
                    companyId: energyServiceObject.companyId,
                    tag: energyServiceObject.tag,
                    serviceid: energyServiceObject.serviceid,
                  }).save();
                  console.log({ savegenStatusToDB });
                  if (!!savegenStatusToDB) {
                    console.log("Gen status save successfully");
                  } else {
                    console.log("Gen. status was not  successful");
                  }
                }
              } else {
                console.log("error while  updating data");
              }
            }
          }
          //update
        } else if (hour === 0 && minutes == 0) {
          const savegenRunTimeOnToDB = await new genDbName({
            topic,
            generatorOnTime: responseData.DI2,
            year: years,
            month: month,
            day: days,
            timeDiff: 0,
            newTimeDiff: 0,
            holdPreviousGenData: 0,
            newDateCreatedAt: dayjs(),
            isGenOnCount: responseData.DI2,
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            companyId: energyServiceObject.companyId,
            tag: energyServiceObject.tag,
            serviceid: energyServiceObject.serviceid,
            dateCreatedAt: dayjs(),
          }).save();
          console.log({ savegenRunTimeOnToDB });
          if (!!savegenRunTimeOnToDB) {
            if (!!genDataStatusExistForTodaySecond) {
              //update status
              genDataStatusExistForTodaySecond.generatorStatus =
                responseData.DI2 === "1" && "ON";
              const updateGenStatus =
                await genDataStatusExistForTodaySecond.save();
              if (!!updateGenStatus) {
                console.log("Gen Status  updated successfully");
              } else {
                console.log("Gen Status  not updated successfully");
              }
            } else {
              const savegenStatusToDB = await new genStatusDBName({
                topic,
                generatorStatus: responseData.DI2,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              console.log({ savegenStatusToDB });
              if (!!savegenStatusToDB) {
                console.log("Gen status save successfully");
              } else {
                console.log("Gen. status was not  successful");
              }
            }
            console.log("it saves generator run time on");
          } else {
            console.log("it not saves generator run time on");
          }
        } else {
          const savegenRunTimeOnToDB = await new genDbName({
            topic,
            generatorOnTime: responseData.DI2,
            year: years,
            month: month,
            day: days,
            timeDiff: 0,
            newTimeDiff: 0,
            holdPreviousGenData: 0,
            newDateCreatedAt: dayjs(),
            isGenOnCount: responseData.DI2,
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            companyId: energyServiceObject.companyId,
            tag: energyServiceObject.tag,
            serviceid: energyServiceObject.serviceid,
            dateCreatedAt: dayjs(),
          }).save();
          console.log({ savegenRunTimeOnToDB });
          if (!!savegenRunTimeOnToDB) {
            if (!!genDataStatusExistForTodaySecond) {
              //update status
              genDataStatusExistForTodaySecond.generatorStatus =
                responseData.DI2 === "1" && "ON";
              const updateGenStatus =
                await genDataStatusExistForTodaySecond.save();
              if (!!updateGenStatus) {
                console.log("Gen Status  updated successfully");
              } else {
                console.log("Gen Status  not updated successfully");
              }
            } else {
              const savegenStatusToDB = await new genStatusDBName({
                topic,
                generatorStatus: responseData.DI2,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                companyId: energyServiceObject.companyId,
                tag: energyServiceObject.tag,
                serviceid: energyServiceObject.serviceid,
              }).save();
              console.log({ savegenStatusToDB });
              if (!!savegenStatusToDB) {
                console.log("Gen status save successfully");
              } else {
                console.log("Gen. status was not  successful");
              }
            }
            console.log("it saves generator run time on");
          } else {
            console.log("it not saves generator run time on");
          }
        }
      }
    } else if (energyServiceObject.isHavingGenAndGrid === false) {
      if (responseData.DI1 === "1") {
        if (!!gridDataExistForToday) {
          if (
            !!gridDataStatusExistForToday &&
            gridDataStatusExistForToday.gridStatus === "OFF"
          ) {
            gridDataExistForToday.holdPreviousGridData =
              gridDataExistForToday.newTimeDiff;
            gridDataExistForToday.newDateCreatedAt = dayjs();
            gridDataExistForToday.isNewTimeDiff = true;
            const updatedDate = gridDataExistForToday.save();
            if (updatedDate) {
              gridDataStatusExistForToday.gridStatus = "ON";
              const updatedStatus = gridDataStatusExistForToday.save();
              !!updatedStatus
                ? console.log("it updated status")
                : console.log("it not updated status");
            } else {
              console.log("not updated new date");
            }
          } else {
            //update

            let dateCreated = dayjs(gridDataExistForToday?.newDateCreatedAt);
            let dateUpdated = dayjs(gridDataExistForToday?.updatedAt);
            let timeDiffs = dateUpdated.diff(dateCreated, "m");
            console.log({ timeDiffs });
            let newtimes =
              timeDiffs + gridDataExistForToday.holdPreviousGridData;

            if (gridDataExistForToday.isNewTimeDiff === true) {
              console.log(
                "its neew time differnece",
                gridDataExistForToday.isNewTimeDiff,
                "timeDiff in true",
                timeDiffs,
                "newtimes",
                newtimes
              );
              gridDataExistForToday.isGridOnCount =
                gridDataExistForToday.isGridOnCount + 1;
              gridDataExistForToday.newTimeDiff = newtimes;

              const updateNewTimeDiffData = await gridDataExistForToday.save();
              !!updateNewTimeDiffData
                ? console.log("it updated new time diff ")
                : console.log("Not updated time diff ");
            } else {
              gridDataExistForToday.isGridOnCount =
                gridDataExistForToday.isGridOnCount + 1;
              gridDataExistForToday.timeDiff = timeDiffs;

              const updateGridData = await gridDataExistForToday.save();
              console.log({ updateGridData });
              if (!!updateGridData) {
                if (!!gridDataStatusExistForToday) {
                  //update status
                  gridDataStatusExistForToday.gridStatus =
                    responseData.DI1 === "1" && "ON";
                  const updateGridStatus =
                    await gridDataStatusExistForToday.save();
                  console.log({ updateGridStatus });
                  if (!!updateGridStatus) {
                    console.log("Grid Status  updated successfully");
                  } else {
                    console.log("Grid Status  not updated successfully");
                  }
                } else {
                  const saveGridStatusToDB = await new gridStatusDBName({
                    topic,
                    gridStatus: responseData.DI1 === "1" && "ON",
                    year: years,
                    month: month,
                    day: days,
                    dateCreatedAt: dayjs(),
                    companyName: energyServiceObject.companyName,
                    deviceId: energyServiceObject.deviceId,
                    companyId: energyServiceObject.companyId,
                    tag: energyServiceObject.tag,
                    serviceid: energyServiceObject.serviceid,
                  }).save();
                  if (!!saveGridStatusToDB) {
                    console.log("Grid status save successfully");
                  } else {
                    console.log("Grid. status was not  successful");
                  }
                }
              } else {
                console.log("error while  updating data");
              }
            }
          }
        } else if (hour === 0 && minutes == 0) {
          const saveGridRunTimeOnToDB = await new gridDbName({
            topic,
            gridOnTime: responseData.DI1,
            year: years,
            month: month,
            day: days,
            timeDiff: 0,
            newTimeDiff: 0,
            holdPreviousGridData: 0,
            newDateCreatedAt: dayjs(),
            isGridOnCount: responseData,
            dateCreatedAt: dayjs(),
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            companyId: energyServiceObject.companyId,
            tag: energyServiceObject.tag,
            serviceid: energyServiceObject.serviceid,
          }).save();

          console.log({ saveGridRunTimeOnToDB });
          if (!!saveGridRunTimeOnToDB) {
            if (!!gridDataStatusExistForToday) {
              //update status
              gridDataStatusExistForToday.gridStatus =
                responseData.DI1 === "1" && "ON";
              const updateGridStatus = await gridDataStatusExistForToday.save();
              console.log({ updateGridStatus });
              if (!!updateGridStatus) {
                console.log("Grid Status  updated successfully");
              } else {
                console.log("Grid Status  not updated successfully");
              }
            } else {
              const saveGridStatusToDB = await new gridStatusDBName({
                topic,
                gridStatus: responseData.DI1 === "1" && "ON",
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                companyId: energyServiceObject.companyId,
                tag: energyServiceObject.tag,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveGridStatusToDB) {
                console.log("Grid status save successfully");
              } else {
                console.log("Grid. status was not  successful");
              }
            }
            console.log("it saves StanbicAbj generator run time on");
          } else {
            console.log("it not saves generator run time on");
          }
        } else {
          const saveGridRunTimeOnToDB = await new gridDbName({
            topic,
            gridOnTime: responseData.DI1,
            year: years,
            month: month,
            day: days,
            timeDiff: 0,
            newTimeDiff: 0,
            holdPreviousGridData: 0,
            newDateCreatedAt: dayjs(),
            isGridOnCount: responseData.DI1,
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            companyId: energyServiceObject.companyId,
            tag: energyServiceObject.tag,
            serviceid: energyServiceObject.serviceid,
            dateCreatedAt: dayjs(),
          }).save();

          console.log({ saveGridRunTimeOnToDB });
          if (!!saveGridRunTimeOnToDB) {
            if (!!gridDataStatusExistForToday) {
              //update status
              gridDataStatusExistForToday.gridStatus =
                responseData.DI1 === "1" && "ON";
              const updateGridStatus = await gridDataStatusExistForToday.save();
              console.log({ updateGridStatus });
              if (!!updateGridStatus) {
                console.log("Grid Status  updated successfully");
              } else {
                console.log("Grid Status  not updated successfully");
              }
            } else {
              const saveGridStatusToDB = await new gridStatusDBName({
                topic,
                gridStatus: responseData.DI1 === "1" && "ON",
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                companyId: energyServiceObject.companyId,
                tag: energyServiceObject.tag,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveGridStatusToDB) {
                console.log("Grid status save successfully");
              } else {
                console.log("Grid. status was not  successful");
              }
            }
            console.log("it saves StanbicAbj generator run time on");
          } else {
            console.log("it not saves generator run time on");
          }
        }
      }
    }
  } catch (error) {
    console.log("error runtime", error);
  }
};

exports.randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};
