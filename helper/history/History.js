const dayjs = require("dayjs");
const { calculateDuration2, convertToPositive } = require("../helper");
const { timeConstruct } = require("../timeConstruct");

exports.gridDailyConsumptionHistory = async (dbName, responseData, topic) => {
  const { years, month, days, hour, minutes } = timeConstruct();
  const gridDataExistForToday = await dbName.findOne({
    year: years,
    month: month,
    day: days,
    status: "active",
  });

  if (hour === 0 && minutes == 0) {
    if (!!gridDataExistForToday) {
      if (gridDataExistForToday?.firstdata === true) {
        gridDataExistForToday.gridEnergycurrentValue["firstEnergyValue"] =
          responseData;
        const updateGridData = await gridDataExistForToday.save();
        if (!!updateGridData) {
          console.log("it update grid data");
        } else {
          console.log("it not update");
        }
      }
    } else {
      const saveGridEnergyToDB = await new dbName({
        topic,
        gridEnergycurrentValue: {
          firstEnergyValue: responseData,
          lastEnergyValue: 0,
          currentEnergy: 0,
        },
        firstdata: true,
        year: years,
        month: month,
        day: days,
        dateCreatedAt: dayjs(),
      }).save();
      if (!!saveGridEnergyToDB) {
        console.log("Grid energy history save successfully");
      } else {
        console.log("Grid. energy history was not save successful");
      }
    }
  } else if (
    (hour === 23 && minutes == 59) ||
    (hour === 23 && minutes == 56) ||
    (hour === 23 && minutes == 57) ||
    (hour === 23 && minutes == 58)
  ) {
    if (!!gridDataExistForToday) {
      if (gridDataExistForToday?.lastForTheDay === true) {
        gridDataExistForToday.gridEnergycurrentValue["lastEnergyValue"] =
          responseData;
        const updateGridData = await gridDataExistForToday.save();
        if (!!updateGridData) {
          console.log("it update grid data");
        } else {
          console.log("it not update");
        }
      } else {
        gridDataExistForToday.lastForTheDay = true;
        gridDataExistForToday.gridEnergycurrentValue["lastEnergyValue"] =
          responseData;
        const updateGridData = await gridDataExistForToday.save();
        if (!!updateGridData) {
          console.log("it update grid data");
        } else {
          console.log("it grid not update");
        }
      }
    }
  } else {
    if (!!gridDataExistForToday) {
      if (gridDataExistForToday?.firstdata === true) {
        gridDataExistForToday.gridEnergycurrentValue["currentEnergy"] =
          responseData;
        const updateGridData = await gridDataExistForToday.save();
        if (!!updateGridData) {
          console.log("it update grid data");
        } else {
          console.log("it not update");
        }
      }
    } else {
      const saveGridEnergyToDB = await new dbName({
        topic,
        gridEnergycurrentValue: {
          firstEnergyValue: responseData,
          lastEnergyValue: 0,
        },
        firstdata: true,
        year: years,
        month: month,
        day: days,
        dateCreatedAt: dayjs(),
      }).save();
      if (!!saveGridEnergyToDB) {
        console.log("Grid energy history save successfully");
      } else {
        console.log("Grid. energy history was not save successful");
      }
    }
  }
};
exports.genDailyConsumptionHistory = async (dbName, responseData, topic) => {
  const { years, month, days, hour, minutes } = timeConstruct();
  const gridDataExistForToday = await dbName.findOne({
    year: years,
    month: month,
    day: days,
    status: "active",
  });

  if (hour === 0 && minutes == 0) {
    if (!!gridDataExistForToday) {
      if (gridDataExistForToday?.firstdata === true) {
        gridDataExistForToday.genEnergycurrentValue["firstEnergyValue"] =
          responseData;
        const updateGenData = await gridDataExistForToday.save();
        if (!!updateGenData) {
          console.log("it update gen data");
        } else {
          console.log("it not update");
        }
      }
    } else {
      const saveGridEnergyToDB = await new dbName({
        topic,
        genEnergycurrentValue: {
          firstEnergyValue: responseData,
          lastEnergyValue: 0,
        },
        firstdata: true,
        year: years,
        month: month,
        day: days,
        dateCreatedAt: dayjs(),
      }).save();
      if (!!saveGridEnergyToDB) {
        console.log("Generator energy history save successfully");
      } else {
        console.log("Generator. energy history was not save successful");
      }
    }
  } else if (
    (hour === 23 && minutes == 58) ||
    (hour === 23 && minutes == 57) ||
    (hour === 23 && minutes == 56) ||
    (hour === 23 && minutes == 59)
  ) {
    if (!!gridDataExistForToday) {
      if (gridDataExistForToday?.lastForTheDay === true) {
        gridDataExistForToday.genEnergycurrentValue["lastEnergyValue"] =
          responseData;
        const updateGenData = await gridDataExistForToday.save();
        if (!!updateGenData) {
          console.log("it update gen data");
        } else {
          console.log("it not update");
        }
      } else {
        gridDataExistForToday.lastForTheDay = true;
        gridDataExistForToday.genEnergycurrentValue["lastEnergyValue"] =
          responseData;
        const updateGenData = await gridDataExistForToday.save();
        if (!!updateGenData) {
          console.log("it update gen data");
        } else {
          console.log("it not update");
        }
      }
    }
  } else {
    if (!!gridDataExistForToday) {
      if (gridDataExistForToday?.firstdata === true) {
        gridDataExistForToday.genEnergycurrentValue["currentEnergy"] =
          responseData;
        const updateGenData = await gridDataExistForToday.save();
        if (!!updateGenData) {
          console.log("it update gen data");
        } else {
          console.log("it not update");
        }
      }
    } else {
      const saveGridEnergyToDB = await new dbName({
        topic,
        genEnergycurrentValue: {
          firstEnergyValue: responseData,
          lastEnergyValue: 0,
          currentEnergy: 0,
        },

        firstdata: true,
        year: years,
        month: month,
        day: days,
        dateCreatedAt: dayjs(),
      }).save();
      if (!!saveGridEnergyToDB) {
        console.log("Grid energy history save successfully");
      } else {
        console.log("Grid. energy history was not save successful");
      }
    }
  }
};
exports.gridDailyConsumptionEmailNoti = async (
  dbName,
  dbNameRuntime,
  dbNameGenRuntime,
  siteName
) => {
  console.log("it enter history");
  const { years, month, days, hour, minutes } = timeConstruct();
  const gridDataExistForToday = await dbName.findOne({
    status: "active",
    dateCreatedAt: {
      $gte: dayjs().subtract(1, "d").startOf("d"),
      $lte: dayjs().subtract(1, "d").endOf("d"),
    },
  });

  const gridRuntimeDataExistForToday = await dbNameRuntime.findOne({
    status: "active",
    dateCreatedAt: {
      $gte: dayjs().subtract(1, "d").startOf("d"),
      $lte: dayjs().subtract(1, "d").endOf("d"),
    },
  });
  const getGenRunTimeToday = await dbNameGenRuntime.findOne({
    status: "active",
    generatorOnTime: 1,

    dateCreatedAt: {
      $gte: dayjs().subtract(1, "d").startOf("d"),
      $lte: dayjs().subtract(1, "d").endOf("d"),
    },
  });
  // console.log({
  //   gridDataExistForToday,
  //   gridRuntimeDataExistForToday,
  //   getGenRunTimeToday,
  // });
  // if (hour === 0 && minutes == 0||hour === 0 && minutes == 15) {

  // }

  if (
    !!gridDataExistForToday ||
    !!gridRuntimeDataExistForToday ||
    !!getGenRunTimeToday
  ) {
    if (
      gridDataExistForToday?.firstdata === true &&
      gridDataExistForToday?.lastForTheDay === true &&
      gridDataExistForToday?.emailSent === false
    ) {
      const gridRuntime =
        gridRuntimeDataExistForToday !== null
          ? gridRuntimeDataExistForToday?.newTimeDiff +
            gridRuntimeDataExistForToday?.timeDiff
          : 0;

      const genRuntime =
        getGenRunTimeToday !== null
          ? getGenRunTimeToday?.newTimeDiff + getGenRunTimeToday?.timeDiff
          : 0;
      let gridTotalEnergy =
        gridDataExistForToday?.gridEnergycurrentValue["firstEnergyValue"] -
        gridDataExistForToday?.gridEnergycurrentValue["lastEnergyValue"];

      await sendMailOauth(
        // process.env.EMAIL,
        [
          "iobotechltd@gmail.com",
          "essability@gmail.com",
          // "essienv2022@gmail.com",
          // "feyijimirachel@gmail.com",
          // "osun4love@gmail.com",
        ],
        ` TOTAL GRID AND GENERATOR ENERGY CONSUMPTION USED TODAY  FOR ${siteName}`,

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
      The  total energy consumption  and runtime used today for <b>${siteName}</b>    <br>
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
        Total grid energy used today  <span
                style="
                  text-align: center;
                  font-weight: 100;
                  font-size: 30px;
                  line-height: 57px;
                  font-family: Verdana;
                  margin: 0px;
                "
                >${convertToPositive(gridTotalEnergy).toFixed(3)}</span 
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
        Total grid runtime used today   <span
                style="
                  text-align: center;
                  font-weight: 100;
                  font-size: 30px;
                  line-height: 57px;
                  font-family: Verdana;
                  margin: 0px;
                "
                >${calculateDuration2(gridRuntime)}</span 
            </p>      <p
              style="

                font-weight: 100;
                font-size: 20px;
                line-height: 57px;
                font-family: Verdana;
                margin: 10px;
              "
            >
        Total generator runtime used today   <span
                style="
                  text-align: center;
                  font-weight: 100;
                  font-size: 30px;
                  line-height: 57px;
                  font-family: Verdana;
                  margin: 0px;
                "
                >${calculateDuration2(genRuntime)}</span 
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
      

        Thank you.
            </p>

          </div>
          <br />
          <br />
        </div>
        <!-- {{>footer}} -->
      </div>`
      );

      gridDataExistForToday.emailSent = true;
      const updateData = await gridDataExistForToday.save();
      if (!!updateData) {
        console.log("the email have sent ");
      } else {
        console.log("the email its not sent at all and cant update it");
      }
    } else if (
      gridDataExistForToday?.firstdata === true &&
      gridDataExistForToday?.lastForTheDay !== true &&
      gridDataExistForToday?.emailSent === false
    ) {
      const gridRuntime =
        gridRuntimeDataExistForToday !== null
          ? gridRuntimeDataExistForToday?.newTimeDiff +
            gridRuntimeDataExistForToday?.timeDiff
          : 0;

      const genRuntime =
        getGenRunTimeToday !== null
          ? getGenRunTimeToday?.newTimeDiff + getGenRunTimeToday?.timeDiff
          : 0;
      let gridTotalEnergy =
        gridDataExistForToday?.gridEnergycurrentValue["firstEnergyValue"] -
        gridDataExistForToday?.gridEnergycurrentValue["currentEnergy"];

      await sendMailOauth(
        // process.env.EMAIL,
        [
          "iobotechltd@gmail.com",
          "essability@gmail.com",
          // "essienv2022@gmail.com",
          // "feyijimirachel@gmail.com",
          // "osun4love@gmail.com",
        ],
        ` TOTAL GRID AND GENERATOR ENERGY CONSUMPTION USED TODAY  FOR ${siteName}`,

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
      The  total energy consumption  and runtime used today for <b>${siteName}</b>    <br>
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
        Total grid energy used today  <span
                style="
                  text-align: center;
                  font-weight: 100;
                  font-size: 30px;
                  line-height: 57px;
                  font-family: Verdana;
                  margin: 0px;
                "
                >${convertToPositive(gridTotalEnergy).toFixed(3)}</span 
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
        Total grid runtime used today   <span
                style="
                  text-align: center;
                  font-weight: 100;
                  font-size: 30px;
                  line-height: 57px;
                  font-family: Verdana;
                  margin: 0px;
                "
                >${calculateDuration2(gridRuntime)}</span 
            </p>      <p
              style="

                font-weight: 100;
                font-size: 20px;
                line-height: 57px;
                font-family: Verdana;
                margin: 10px;
              "
            >
        Total generator runtime used today   <span
                style="
                  text-align: center;
                  font-weight: 100;
                  font-size: 30px;
                  line-height: 57px;
                  font-family: Verdana;
                  margin: 0px;
                "
                >${calculateDuration2(genRuntime)}</span 
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
      

        Thank you.
            </p>

          </div>
          <br />
          <br />
        </div>
        <!-- {{>footer}} -->
      </div>`
      );

      gridDataExistForToday.emailSent = true;
      const updateData = await gridDataExistForToday.save();
      if (!!updateData) {
        console.log("the email have sent ");
      } else {
        console.log("the email its not sent at all and cant update it");
      }
    }
  }
};
exports.DailyConsumptionEmailNotiWithGridAndGen = async (
  dbName,
  dbNameRuntime,
  dbNameGenRuntime,
  siteName
) => {
  const { years, month, days, hour, minutes } = timeConstruct();
  const gridDataExistForToday = await dbName.findOne({
    year: years,
    month: month,
    day: days,
    status: "active",
  });

  const gridRuntimeDataExistForToday = await dbNameRuntime.findOne({
    year: years,
    month: month,
    day: days,
    status: "active",
  });
  const getGenRunTimeToday = await dbNameGenRuntime.findOne({
    status: "active",
    generatorOnTime: 1,
    year: years,
    month: month,
    day: days,
    dateCreatedAt: {
      $gte: dayjs().startOf("d"),
      $lte: dayjs().endOf("d"),
    },
  });

  if (
    !!gridDataExistForToday ||
    !!gridRuntimeDataExistForToday ||
    !!getGenRunTimeToday
  ) {
    if (
      gridDataExistForToday?.firstdata === true &&
      gridDataExistForToday?.lastForTheDay === true
    ) {
      const gridRuntime =
        gridRuntimeDataExistForToday !== null
          ? gridRuntimeDataExistForToday?.newTimeDiff +
            gridRuntimeDataExistForToday?.timeDiff
          : 0;

      const genRuntime =
        getGenRunTimeToday !== null
          ? getGenRunTimeToday?.newTimeDiff + getGenRunTimeToday?.timeDiff
          : 0;
      let gridTotalEnergy =
        gridDataExistForToday?.gridEnergycurrentValue["firstEnergyValue"] -
        gridDataExistForToday?.gridEnergycurrentValue["lastEnergyValue"];

      await sendMailOauth(
        // process.env.EMAIL,
        [
          "iobotechltd@gmail.com",
          "essability@gmail.com",
          // "essienv2022@gmail.com",
          // "feyijimirachel@gmail.com",
          // "osun4love@gmail.com",
        ],
        ` TOTAL GRID AND GENERATOR ENERGY CONSUMPTION USED TODAY  FOR ${siteName}`,

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
      The  daily energy consumptions and runtime used today for <b>${siteName}</b>    <br>
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
        Total  energy consumption  today  <span
                style="
                  text-align: center;
                  font-weight: 100;
                  font-size: 30px;
                  line-height: 57px;
                  font-family: Verdana;
                  margin: 0px;
                "
                >${convertToPositive(gridTotalEnergy).toFixed(3)}</span 
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
        Total grid runtime used today   <span
                style="
                  text-align: center;
                  font-weight: 100;
                  font-size: 30px;
                  line-height: 57px;
                  font-family: Verdana;
                  margin: 0px;
                "
                >${calculateDuration2(gridRuntime)}</span 
            </p>      <p
              style="

                font-weight: 100;
                font-size: 20px;
                line-height: 57px;
                font-family: Verdana;
                margin: 10px;
              "
            >
        Total generator runtime used today   <span
                style="
                  text-align: center;
                  font-weight: 100;
                  font-size: 30px;
                  line-height: 57px;
                  font-family: Verdana;
                  margin: 0px;
                "
                >${calculateDuration2(genRuntime)}</span 
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
      

        Thank you.
            </p>

          </div>
          <br />
          <br />
        </div>
        <!-- {{>footer}} -->
      </div>`
      );
    }
  }
};
