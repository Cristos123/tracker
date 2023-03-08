const dayjs = require("dayjs");
const { convertToPositive, publishMqtt } = require("../helper");
const { timeConstruct } = require("../timeConstruct");
let emailSent = {};
let emailSentIfeREsort = {};
let emailSentCorona = {};

exports.fuelMonitoring1 = async (
  clientConnections,
  checkISGridOn,
  Dbname,
  topic,
  siteName,
  fuelLevel,
  feulConsumption
) => {
  try {
    const { years, month, days, hour, minutes } = timeConstruct();
    const getfuelLevelToday = await Dbname.findOne({
      firstdata: true,
      year: years,
      month: month,
      day: days,
      dateCreatedAt: {
        $gte: dayjs().startOf("d"),
        $lte: dayjs().endOf("d"),
      },
    }).sort({ dateCreatedAt: -1 });
    console.log({ getfuelLevelToday });

    if (topic === "coronaoverheadtank" || topic === "Knotandgearoverheadtank") {
      if (checkISGridOn.DI1 === "1" || checkISGridOn.DI2 === "1") {
        emailSentCorona = false;
        if (!!getfuelLevelToday) {
          await publishMqtt(
            await clientConnections,
            {
              "fuel-level": convertToPositive(fuelLevel),
            },
            `${siteName} fuel level`
          );

          let currentfuelLevel = getfuelLevelToday.firstValueToday - fuelLevel;
          if (currentfuelLevel < -10) {
            getfuelLevelToday.refill = convertToPositive(
              currentfuelLevel.toFixed(2)
            );
            getfuelLevelToday.firstValueToday = fuelLevel;
            const updateFirstValueToday = await getfuelLevelToday.save();
            console.log({ updateFirstValueToday });
            if (!!updateFirstValueToday) {
              let refills = updateFirstValueToday?.refill;
              await publishMqtt(
                await clientConnections,
                {
                  "fuel-refill": refills,
                },
                `${siteName} fuel level refill for today`
              );
              console.log("it updated successfully");
            } else {
              console.log("it not updated successfully");
            }
            console.log("currentfuelLevel is ", currentfuelLevel);
          } else if (currentfuelLevel >= -6 && !(currentfuelLevel > -1)) {
            console.log("it return -5");
            return;
          } else {
            await publishMqtt(
              await clientConnections,
              {
                "fuel-consumption": convertToPositive(
                  currentfuelLevel.toFixed(2)
                ),
              },
              `${siteName} fuel consumption`
            );
            const getTotalConsumptionValue = await feulConsumption
              .findOne({
                year: years,
                month: month,
                day: days,
                dateCreatedAt: {
                  $gte: dayjs().startOf("d"),
                  $lte: dayjs().endOf("d"),
                },
              })
              .sort({ dateCreatedAt: -1 });
            if (!!getTotalConsumptionValue) {
              let totalConump = getTotalConsumptionValue.totalCurrentValue;

              console.log({ totalConump });
              await publishMqtt(
                await clientConnections,
                {
                  "total-fuel-consumption": convertToPositive(
                    totalConump.toFixed(2)
                  ),
                },
                `${siteName} total fuel consumption`
              );

              getTotalConsumptionValue.totalCurrentValue =
                getTotalConsumptionValue.currentValue === currentfuelLevel
                  ? getTotalConsumptionValue.totalCurrentValue + 0
                  : currentfuelLevel;
              getTotalConsumptionValue.currentValue = currentfuelLevel;
              const updateTotal = await getTotalConsumptionValue.save();
              console.log({ updateTotal });
              if (!!updateTotal) {
                console.log("it updated fuel level current data successfully");
              } else {
                console.log("it not updated successfully");
              }
            } else {
              const SaveTotalConsumptionValue = await new feulConsumption({
                topic,
                currentValue: currentfuelLevel,
                totalCurrentValue: currentfuelLevel,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
              }).save();

              if (!!SaveTotalConsumptionValue) {
                console.log("it updated fuel level current data successfully");
              } else {
                console.log("it not updated successfully");
              }
            }

            //real time
            let realTimeConsumpValue =
              getfuelLevelToday.currentValue - fuelLevel;
            console.log({ realTimeConsumpValue });

            if (realTimeConsumpValue >= -6 && !(realTimeConsumpValue > -1)) {
              console.log("it return -5");
              return;
            } else {
              let actualCurrentvalue =
                realTimeConsumpValue < 10 ? 0 : realTimeConsumpValue;

              await publishMqtt(
                await clientConnections,
                {
                  "real-time-fuel-consumption": convertToPositive(
                    actualCurrentvalue.toFixed(2)
                  ),
                },
                `${siteName} real time  fuel consumption`
              );

              getfuelLevelToday.currentValue = fuelLevel;
              getfuelLevelToday.fuelLevelWhenItsOn = fuelLevel;
              const updateFuelLevel = await getfuelLevelToday.save();
              console.log({ updateFuelLevel });
              if (!!updateFuelLevel) {
                console.log("it updated fuel level current data successfully");
              } else {
                console.log("it not updated successfully");
              }
            }
          }
        } else {
          const SaveFuelLevel = await new Dbname({
            topic,
            firstValueToday: fuelLevel,
            currentValue: fuelLevel,
            refill: 0,
            fuelLevelWhenItsOn: 0,
            firstdata: true,
            year: years,
            month: month,
            day: days,
            dateCreatedAt: dayjs(),
          }).save();
          if (!!SaveFuelLevel) {
            await publishMqtt(
              await clientConnections,
              {
                "fuel-level": convertToPositive(fuelLevel),
              },
              `${siteName}  fuel level`
            );

            console.log("save to db");
          } else {
            console.log("Not save to db");
          }
        }
      } else if (checkISGridOn.DI1 === "0" && checkISGridOn.DI2 === "0") {
        console.log("msgObject.data.DI1)", checkISGridOn, { emailSentCorona });

        if (!!getfuelLevelToday) {
          let feulLevels =
            getfuelLevelToday?.fuelLevelWhenItsOn === 0
              ? getfuelLevelToday.firstValueToday
              : getfuelLevelToday.fuelLevelWhenItsOn;
          await publishMqtt(
            await clientConnections,
            {
              "fuel-level": convertToPositive(feulLevels),
            },
            `${siteName} fuel level`
          );

          let currentfuelLevelUsage =
            getfuelLevelToday.fuelLevelWhenItsOn === fuelLevel
              ? getfuelLevelToday.fuelLevelWhenItsOn - fuelLevel
              : getfuelLevelToday.firstValueToday - fuelLevel;
          let currentfuelLevel = getfuelLevelToday.firstValueToday - fuelLevel;
          if (currentfuelLevel < -10) {
            getfuelLevelToday.refill = convertToPositive(
              currentfuelLevel.toFixed(2)
            );
            getfuelLevelToday.firstValueToday = fuelLevel;

            const updateFirstValueToday = await getfuelLevelToday.save();
            console.log({ updateFirstValueToday });
            if (!!updateFirstValueToday) {
              let refills = updateFirstValueToday?.refill;
              await publishMqtt(
                await clientConnections,
                {
                  "fuel-refill": convertToPositive(refills),
                },
                `${siteName} fuel level refill for today`
              );
              console.log("it updated successfully");
            } else {
              console.log("it not updated successfully");
            }
            console.log("currentfuelLevel is ", currentfuelLevel);
          } else if (currentfuelLevel >= -6 && !(currentfuelLevel > -1)) {
            console.log("it return -5");
            return;
          } else if (
            currentfuelLevelUsage >= 15 &&
            currentfuelLevel >= currentfuelLevelUsage &&
            emailSentCorona !== true
          ) {
            // send email notification
            console.log("it enter email sending");
            await FeulTheftEmailNotification(
              siteName,
              convertToPositive(currentfuelLevel.toFixed(0))
            );
            emailSentCorona = true;
          } else {
            let resSendConsumption =
              currentfuelLevel === 0
                ? currentfuelLevelUsage
                : currentfuelLevel.toFixed(2);
            await publishMqtt(
              await clientConnections,
              {
                "fuel-consumption": convertToPositive(resSendConsumption),
              },
              `${siteName} fuel consumption`
            );
          }

          getfuelLevelToday.currentValue = fuelLevel;
          const updateFuelLevel = await getfuelLevelToday.save();
          console.log({ updateFuelLevel });
          if (!!updateFuelLevel) {
            console.log("it updated fuel level current data successfully");
          } else {
            console.log("it not updated successfully");
          }
        } else {
          const SaveFuelLevel = await new Dbname({
            topic,
            firstValueToday: fuelLevel,
            currentValue: fuelLevel,
            refill: 0,
            fuelLevelWhenItsOn: 0,
            firstdata: true,
            year: years,
            month: month,
            day: days,
            dateCreatedAt: dayjs(),
          }).save();
          if (!!SaveFuelLevel) {
            await publishMqtt(
              await clientConnections,
              {
                "fuel-level": convertToPositive(fuelLevel),
              },
              `${siteName}  fuel level`
            );

            console.log("save to db");
          } else {
            console.log("Not save to db");
          }
        }
      }
    }
    if (topic === "Iferesort") {
      if (checkISGridOn === "1") {
        if (!!getfuelLevelToday) {
          emailSentIfeREsort = false;
          await publishMqtt(
            await clientConnections,
            {
              "fuel-level": convertToPositive(fuelLevel),
            },
            `${siteName} fuel level`
          );

          let currentfuelLevel = getfuelLevelToday.firstValueToday - fuelLevel;
          if (currentfuelLevel < -10) {
            getfuelLevelToday.refill = convertToPositive(
              currentfuelLevel.toFixed(2)
            );
            getfuelLevelToday.firstValueToday = fuelLevel;
            const updateFirstValueToday = await getfuelLevelToday.save();
            console.log({ updateFirstValueToday });
            if (!!updateFirstValueToday) {
              let refills = updateFirstValueToday?.refill;
              await publishMqtt(
                await clientConnections,
                {
                  "fuel-refill": refills,
                },
                `${siteName} fuel level refill for today`
              );
              console.log("it updated successfully");
            } else {
              console.log("it not updated successfully");
            }
            console.log("currentfuelLevel is ", currentfuelLevel);
          } else if (currentfuelLevel >= -6 && !(currentfuelLevel > -1)) {
            console.log("it return -5");
            return;
          } else {
            await publishMqtt(
              await clientConnections,
              {
                "fuel-consumption": convertToPositive(
                  currentfuelLevel.toFixed(2)
                ),
              },
              `${siteName} fuel consumption`
            );
            const getTotalConsumptionValue = await feulConsumption
              .findOne({
                year: years,
                month: month,
                day: days,
                dateCreatedAt: {
                  $gte: dayjs().startOf("d"),
                  $lte: dayjs().endOf("d"),
                },
              })
              .sort({ dateCreatedAt: -1 });
            if (!!getTotalConsumptionValue) {
              let totalConump = getTotalConsumptionValue.totalCurrentValue;

              console.log({ totalConump });
              await publishMqtt(
                await clientConnections,
                {
                  "total-fuel-consumption": convertToPositive(
                    totalConump.toFixed(2)
                  ),
                },
                `${siteName} total fuel consumption`
              );

              getTotalConsumptionValue.totalCurrentValue =
                getTotalConsumptionValue.currentValue === currentfuelLevel
                  ? getTotalConsumptionValue.totalCurrentValue + 0
                  : currentfuelLevel;
              getTotalConsumptionValue.currentValue = currentfuelLevel;
              const updateTotal = await getTotalConsumptionValue.save();
              console.log({ updateTotal });
              if (!!updateTotal) {
                console.log("it updated fuel level current data successfully");
              } else {
                console.log("it not updated successfully");
              }
            } else {
              const SaveTotalConsumptionValue = await new feulConsumption({
                topic,
                currentValue: currentfuelLevel,
                totalCurrentValue: currentfuelLevel,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
              }).save();

              if (!!SaveTotalConsumptionValue) {
                console.log("it updated fuel level current data successfully");
              } else {
                console.log("it not updated successfully");
              }
            }

            //real time
            let realTimeConsumpValue =
              getfuelLevelToday.currentValue - fuelLevel;
            console.log({ realTimeConsumpValue });

            if (realTimeConsumpValue >= -6 && !(realTimeConsumpValue > -1)) {
              console.log("it return -5");
              return;
            } else {
              let actualCurrentvalue =
                realTimeConsumpValue < 10 ? 0 : realTimeConsumpValue;

              await publishMqtt(
                await clientConnections,
                {
                  "real-time-fuel-consumption": convertToPositive(
                    actualCurrentvalue.toFixed(2)
                  ),
                },
                `${siteName} real time  fuel consumption`
              );

              getfuelLevelToday.currentValue = fuelLevel;
              getfuelLevelToday.fuelLevelWhenItsOn = fuelLevel;
              const updateFuelLevel = await getfuelLevelToday.save();
              console.log({ updateFuelLevel });
              if (!!updateFuelLevel) {
                console.log("it updated fuel level current data successfully");
              } else {
                console.log("it not updated successfully");
              }
            }
          }
        } else {
          const SaveFuelLevel = await new Dbname({
            topic,
            firstValueToday: fuelLevel,
            currentValue: fuelLevel,
            refill: 0,
            fuelLevelWhenItsOn: 0,
            firstdata: true,
            year: years,
            month: month,
            day: days,
            dateCreatedAt: dayjs(),
          }).save();
          if (!!SaveFuelLevel) {
            await publishMqtt(
              await clientConnections,
              {
                "fuel-level": convertToPositive(fuelLevel),
              },
              `${siteName}  fuel level`
            );

            console.log("save to db");
          } else {
            console.log("Not save to db");
          }
        }
      } else if (checkISGridOn === "0") {
        console.log("msgObject.data.DI1)", checkISGridOn);
        console.log({ emailSentIfeREsort });
        if (!!getfuelLevelToday) {
          let feulLevels =
            getfuelLevelToday?.fuelLevelWhenItsOn === 0
              ? getfuelLevelToday.firstValueToday
              : getfuelLevelToday.fuelLevelWhenItsOn;
          await publishMqtt(
            await clientConnections,
            {
              "fuel-level": convertToPositive(feulLevels),
            },
            `${siteName} fuel level`
          );

          let currentfuelLevelUsage =
            getfuelLevelToday.fuelLevelWhenItsOn === fuelLevel
              ? getfuelLevelToday.fuelLevelWhenItsOn - fuelLevel
              : getfuelLevelToday.firstValueToday - fuelLevel;
          let currentfuelLevel = getfuelLevelToday.firstValueToday - fuelLevel;
          if (currentfuelLevel < -10) {
            getfuelLevelToday.refill = convertToPositive(
              currentfuelLevel.toFixed(2)
            );
            getfuelLevelToday.firstValueToday = fuelLevel;

            const updateFirstValueToday = await getfuelLevelToday.save();
            console.log({ updateFirstValueToday });
            if (!!updateFirstValueToday) {
              let refills = updateFirstValueToday?.refill;
              await publishMqtt(
                await clientConnections,
                {
                  "fuel-refill": convertToPositive(refills),
                },
                `${siteName} fuel level refill for today`
              );
              console.log("it updated successfully");
            } else {
              console.log("it not updated successfully");
            }
            console.log("currentfuelLevel is ", currentfuelLevel);
          } else if (currentfuelLevel >= -6 && !(currentfuelLevel > -1)) {
            console.log("it return -5");
            return;
          } else if (
            currentfuelLevelUsage >= 15 &&
            currentfuelLevel >= currentfuelLevelUsage &&
            emailSentIfeREsort !== true
          ) {
            // console.log({ emailSentIfeREsort });
            // send email notification
            console.log("it enter email sending");
            await FeulTheftEmailNotification(
              siteName,
              convertToPositive(currentfuelLevel.toFixed(0))
            );
            emailSentIfeREsort = true;
          } else {
            let resSendConsumption =
              currentfuelLevel === 0
                ? currentfuelLevelUsage
                : currentfuelLevel.toFixed(2);
            await publishMqtt(
              await clientConnections,
              {
                "fuel-consumption": convertToPositive(resSendConsumption),
              },
              `${siteName} fuel consumption`
            );
            // emailSent = false;
            //   const getTotalConsumptionValue =
            //     await FuelLevelConsumptionGbagada.findOne({
            //       year: years,
            //       month: month,
            //       day: days,
            //       dateCreatedAt: {
            //         $gte: dayjs().startOf("d"),
            //         $lte: dayjs().endOf("d"),
            //       },
            //     }).sort({ dateCreatedAt: -1 });
            //   if (!!getTotalConsumptionValue) {
            //     let totalConump = getTotalConsumptionValue.totalCurrentValue;

            //     console.log({ totalConump });
            //     await publishMqtt(
            //       await clientConnections,
            //       {
            //         "total-fuel-consumption": convertToPositive(totalConump),
            //       },
            //       `${siteName} total fuel consumption`
            //     );

            //     getTotalConsumptionValue.totalCurrentValue =
            //       getTotalConsumptionValue.currentValue === currentfuelLevel
            //         ? getTotalConsumptionValue.totalCurrentValue + 0
            //         : getTotalConsumptionValue.totalCurrentValue + currentfuelLevel;
            //     getTotalConsumptionValue.currentValue = currentfuelLevel;
            //     const updateTotal = await getTotalConsumptionValue.save();
            //     console.log({ updateTotal });
            //     if (!!updateTotal) {
            //       console.log("it updated fuel level current data successfully");
            //     } else {
            //       console.log("it not updated successfully");
            //     }
            //   } else {
            //     const SaveTotalConsumptionValue =
            //       await new FuelLevelConsumptionGbagada({
            //         topic,
            //         currentValue: currentfuelLevel,
            //         totalCurrentValue: currentfuelLevel,
            //         year: years,
            //         month: month,
            //         day: days,
            //         dateCreatedAt: dayjs(),
            //       }).save();

            //     if (!!SaveTotalConsumptionValue) {
            //       console.log("it updated fuel level current data successfully");
            //     } else {
            //       console.log("it not updated successfully");
            //     }
            //   }

            //   //real time
            //   let realTimeConsumpValue = getfuelLevelToday.currentValue - fuelLevel;
            //   console.log({ realTimeConsumpValue });

            //   if (realTimeConsumpValue >= -6 && !(realTimeConsumpValue > -1)) {
            //     console.log("it return -5");
            //     return;
            //   } else {
            //     let actualCurrentvalue =
            //       realTimeConsumpValue < 10 ? 0 : realTimeConsumpValue;

            //     await publishMqtt(
            //       await clientConnections,
            //       {
            //         "real-time-fuel-consumption":
            //           convertToPositive(actualCurrentvalue),
            //       },
            //       `${siteName} real time  fuel consumption`
            //     );

            //     getfuelLevelToday.currentValue = fuelLevel;
            //     const updateFuelLevel = await getfuelLevelToday.save();
            //     console.log({ updateFuelLevel });
            //     if (!!updateFuelLevel) {
            //       console.log("it updated fuel level current data successfully");
            //     } else {
            //       console.log("it not updated successfully");
            //     }
            //   }
          }

          getfuelLevelToday.currentValue = fuelLevel;
          const updateFuelLevel = await getfuelLevelToday.save();
          console.log({ updateFuelLevel });
          if (!!updateFuelLevel) {
            console.log("it updated fuel level current data successfully");
          } else {
            console.log("it not updated successfully");
          }
        } else {
          const SaveFuelLevel = await new Dbname({
            topic,
            firstValueToday: fuelLevel,
            currentValue: fuelLevel,
            refill: 0,
            fuelLevelWhenItsOn: 0,
            firstdata: true,
            year: years,
            month: month,
            day: days,
            dateCreatedAt: dayjs(),
          }).save();
          if (!!SaveFuelLevel) {
            await publishMqtt(
              await clientConnections,
              {
                "fuel-level": convertToPositive(fuelLevel),
              },
              `${siteName}  fuel level`
            );

            console.log("save to db");
          } else {
            console.log("Not save to db");
          }
        }
      }
    }
    if (topic === "qfaoverheadtank2") {
      if (!!getfuelLevelToday) {
        emailSent = false;

        let currentfuelLevel = getfuelLevelToday.firstValueToday - fuelLevel;
        if (currentfuelLevel < 10) {
          return;
        } else {
          await publishMqtt(
            await clientConnections,
            {
              "fuel-level": convertToPositive(fuelLevel),
            },
            `${siteName} fuel level`
          );

          if (currentfuelLevel < -10) {
            getfuelLevelToday.refill = convertToPositive(
              currentfuelLevel.toFixed(2)
            );
            getfuelLevelToday.firstValueToday = fuelLevel;
            const updateFirstValueToday = await getfuelLevelToday.save();
            console.log({ updateFirstValueToday });
            if (!!updateFirstValueToday) {
              let refills = updateFirstValueToday?.refill;
              await publishMqtt(
                await clientConnections,
                {
                  "fuel-refill": refills,
                },
                `${siteName} fuel level refill for today`
              );
              console.log("it updated successfully");
            } else {
              console.log("it not updated successfully");
            }
            console.log("currentfuelLevel is ", currentfuelLevel);
          } else if (currentfuelLevel >= -6 && !(currentfuelLevel > -1)) {
            console.log("it return -5");
            return;
          } else {
            await publishMqtt(
              await clientConnections,
              {
                "fuel-consumption": convertToPositive(
                  currentfuelLevel.toFixed(2)
                ),
              },
              `${siteName} fuel consumption`
            );
            const getTotalConsumptionValue = await feulConsumption
              .findOne({
                year: years,
                month: month,
                day: days,
                dateCreatedAt: {
                  $gte: dayjs().startOf("d"),
                  $lte: dayjs().endOf("d"),
                },
              })
              .sort({ dateCreatedAt: -1 });
            if (!!getTotalConsumptionValue) {
              let totalConump = getTotalConsumptionValue.totalCurrentValue;

              console.log({ totalConump });
              await publishMqtt(
                await clientConnections,
                {
                  "total-fuel-consumption": convertToPositive(
                    totalConump.toFixed(2)
                  ),
                },
                `${siteName} total fuel consumption`
              );

              getTotalConsumptionValue.totalCurrentValue =
                getTotalConsumptionValue.currentValue === currentfuelLevel
                  ? getTotalConsumptionValue.totalCurrentValue + 0
                  : currentfuelLevel;
              getTotalConsumptionValue.currentValue = currentfuelLevel;
              const updateTotal = await getTotalConsumptionValue.save();
              console.log({ updateTotal });
              if (!!updateTotal) {
                console.log("it updated fuel level current data successfully");
              } else {
                console.log("it not updated successfully");
              }
            } else {
              const SaveTotalConsumptionValue = await new feulConsumption({
                topic,
                currentValue: currentfuelLevel,
                totalCurrentValue: currentfuelLevel,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
              }).save();

              if (!!SaveTotalConsumptionValue) {
                console.log("it updated fuel level current data successfully");
              } else {
                console.log("it not updated successfully");
              }
            }

            //real time
            let realTimeConsumpValue =
              getfuelLevelToday.currentValue - fuelLevel;
            console.log({ realTimeConsumpValue });

            if (realTimeConsumpValue >= -6 && !(realTimeConsumpValue > -1)) {
              console.log("it return -5");
              return;
            } else {
              let actualCurrentvalue =
                realTimeConsumpValue < 10 ? 0 : realTimeConsumpValue;

              await publishMqtt(
                await clientConnections,
                {
                  "real-time-fuel-consumption": convertToPositive(
                    actualCurrentvalue.toFixed(2)
                  ),
                },
                `${siteName} real time  fuel consumption`
              );

              getfuelLevelToday.currentValue = fuelLevel;
              getfuelLevelToday.fuelLevelWhenItsOn = fuelLevel;
              const updateFuelLevel = await getfuelLevelToday.save();
              console.log({ updateFuelLevel });
              if (!!updateFuelLevel) {
                console.log("it updated fuel level current data successfully");
              } else {
                console.log("it not updated successfully");
              }
            }
          }
        }
      } else {
        const SaveFuelLevel = await new Dbname({
          topic,
          firstValueToday: fuelLevel,
          currentValue: fuelLevel,
          refill: 0,
          fuelLevelWhenItsOn: 0,
          firstdata: true,
          year: years,
          month: month,
          day: days,
          dateCreatedAt: dayjs(),
        }).save();
        if (!!SaveFuelLevel) {
          await publishMqtt(
            await clientConnections,
            {
              "fuel-level": convertToPositive(fuelLevel),
            },
            `${siteName}  fuel level`
          );

          console.log("save to db");
        } else {
          console.log("Not save to db");
        }
      }
    }
  } catch (error) {
    console.log("error for fuel monitoring", error);
  }
};
exports.fuelMonitoring = async (
  DbnameFuelLevel,
  topic,
  fuelLevel,
  FuelLevelConsumption,
  FuelHistory,
  getTanksByDeviceId,
  statusDBName,
  statusDBNameSecond
) => {
  try {
    const { years, month, days, hour, minutes } = timeConstruct();
    const getfuelLevelToday = await DbnameFuelLevel.findOne({
      firstdata: true,
      year: years,
      month: month,
      day: days,
      companyName: getTanksByDeviceId.companyName,
      deviceId: getTanksByDeviceId.deviceId,
      companyId: getTanksByDeviceId.companyId,
      serviceid: getTanksByDeviceId.serviceid,
      dateCreatedAt: {
        $gte: dayjs().startOf("d"),
        $lte: dayjs().endOf("d"),
      },
    }).sort({ dateCreatedAt: -1 });
    console.log({ getfuelLevelToday });
    if (
      getTanksByDeviceId.monitorRuntime === true &&
      getTanksByDeviceId.isHavingTwoGen == true
    ) {
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
      if (
        (!!genDataStatusExistForToday &&
          genDataStatusExistForToday.generatorStatus == "ON") ||
        (!!genDataStatusExistForTodaySecond &&
          genDataStatusExistForTodaySecond.generatorStatus == "ON")
      ) {
        if (!!getfuelLevelToday) {
          let lowConsumption = getfuelLevelToday?.currentValue - fuelLevel;
          let currentfuelLevel = getfuelLevelToday.currentValue - fuelLevel;

          if (
            getfuelLevelToday.currentValue === fuelLevel ||
            lowConsumption <= 10
          ) {
            console.log("it enter greater than");
            return;
          } else if (currentfuelLevel < -10) {
            getfuelLevelToday.refill = convertToPositive(
              currentfuelLevel.toFixed(2)
            );
            getfuelLevelToday.currentValue = fuelLevel;

            const updateFirstValueToday = await getfuelLevelToday.save();
            console.log({ updateFirstValueToday });
            if (!!updateFirstValueToday) {
              console.log("it updated successfully");
            } else {
              console.log("it not updated successfully");
            }
            console.log("currentfuelLevel is ", currentfuelLevel);
          } else {
            if (hour === 0 && minutes == 0) {
              const SaveFuelLevel = await new DbnameFuelLevel({
                topic,
                currentValue: fuelLevel,
                firstdata: true,
                refill: 0,
                dateCreatedAt: dayjs(),
                companyName: getTanksByDeviceId.companyName,
                deviceId: getTanksByDeviceId.deviceId,
                companyId: getTanksByDeviceId.companyId,
                tag: getTanksByDeviceId.tag,
                serviceid: getTanksByDeviceId.serviceid,
              }).save();
              if (!!SaveFuelLevel) {
                const SaveFuelLevelConsumption = await new FuelLevelConsumption(
                  {
                    topic,
                    dailyConsumption: 0,
                    companyName: getTanksByDeviceId.companyName,
                    deviceId: getTanksByDeviceId.deviceId,
                    companyId: getTanksByDeviceId.companyId,
                    tag: getTanksByDeviceId.tag,
                    serviceid: getTanksByDeviceId.serviceid,
                    dateCreatedAt: dayjs(),
                  }
                ).save();
                const SaveFuelHistoryForToday = await new FuelHistory({
                  topic,
                  fuelCurrentValue: fuelLevel,
                  fuelDailyConsumption: 0,
                  genRuntimefor: 0,
                  year: years,
                  month: month,
                  day: days,
                  companyName: getTanksByDeviceId.companyName,
                  deviceId: getTanksByDeviceId.deviceId,
                  companyId: getTanksByDeviceId.companyId,
                  tag: getTanksByDeviceId.tag,
                  serviceid: getTanksByDeviceId.serviceid,

                  dateCreatedAt: dayjs(),
                }).save();

                if (!!SaveFuelLevelConsumption || !!SaveFuelHistoryForToday) {
                  console.log("save to fuel consumption time");
                } else {
                  console.log(" Not save to fuel consumption");
                }
                console.log("save to db");
              } else {
                console.log("Not save to db");
              }
            } else if (hour === 23 && minutes == 59) {
              const SaveFuelLevel = await new DbnameFuelLevel({
                topic,
                currentValue: fuelLevel,
                refill: 0,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                tag: getTanksByDeviceId.tag,
                companyName: getTanksByDeviceId.companyName,
                deviceId: getTanksByDeviceId.deviceId,
                companyId: getTanksByDeviceId.companyId,
                serviceid: getTanksByDeviceId.serviceid,
              }).save();
              if (!!SaveFuelLevel) {
                if (!!getfuelLevelToday) {
                  let currentfuelLevel =
                    getfuelLevelToday.currentValue - fuelLevel;

                  const SaveFuelLevelConsumption =
                    await new FuelLevelConsumption({
                      topic,
                      dailyConsumption: currentfuelLevel,
                      lastForTheDay: true,
                      tag: getTanksByDeviceId.tag,
                      serviceid: getTanksByDeviceId.serviceid,
                      dateCreatedAt: dayjs(),
                    }).save();

                  if (!!SaveFuelLevelConsumption) {
                    const fuelHistoryExistToday = await FuelHistory.findOne({
                      year: years,
                      month: month,
                      day: days,
                      status: "active",
                      companyName: getTanksByDeviceId.companyName,
                      deviceId: getTanksByDeviceId.deviceId,
                      companyId: getTanksByDeviceId.companyId,
                      serviceid: getTanksByDeviceId.serviceid,
                    });
                    if (!!fuelHistoryExistToday) {
                      fuelHistoryExistToday.fuelCurrentValue = fuelLevel;
                      fuelHistoryExistToday.fuelDailyConsumption =
                        currentfuelLevel;
                      const updateHistoryToday =
                        await fuelHistoryExistToday.save();
                      console.log({ updateHistoryToday });
                      if (!!updateHistoryToday) {
                        console.log("it updated history");
                      } else {
                        console.log("it not  updated history");
                      }
                    } else {
                      const SaveFuelHistoryForToday = await new FuelHistory({
                        topic,
                        fuelCurrentValue: fuelLevel,
                        fuelDailyConsumption: 0,
                        genRuntimefor: 0,
                        year: years,
                        month: month,
                        day: days,
                        companyName: getTanksByDeviceId.companyName,
                        tag: getTanksByDeviceId.tag,
                        deviceId: getTanksByDeviceId.deviceId,
                        companyId: getTanksByDeviceId.companyId,
                        serviceid: getTanksByDeviceId.serviceid,

                        dateCreatedAt: dayjs(),
                      }).save();
                      if (!!SaveFuelHistoryForToday) {
                        console.log("it saves first history to dp");
                      } else {
                        console.log("it not save today history");
                      }
                    }
                  } else {
                    console.log(" Not save to fuel consumption");
                  }
                } else {
                  console.log("Cant get fuel level");
                }
                console.log("save to db");
              } else {
                console.log("Not save to db");
              }
            } else {
              console.log({ getfuelLevelToday });
              if (!!getfuelLevelToday) {
                const SaveFuelLevel = await new DbnameFuelLevel({
                  topic,
                  currentValue: fuelLevel,
                  refill: 0,
                  companyName: getTanksByDeviceId.companyName,
                  deviceId: getTanksByDeviceId.deviceId,
                  companyId: getTanksByDeviceId.companyId,
                  tag: getTanksByDeviceId.tag,
                  serviceid: getTanksByDeviceId.serviceid,
                  dateCreatedAt: dayjs(),
                }).save();
                console.log({ SaveFuelLevel });
                if (!!SaveFuelLevel) {
                  let currentfuelLevel =
                    getfuelLevelToday.currentValue - fuelLevel;
                  if (currentfuelLevel < -10) {
                    getfuelLevelToday.currentValue = fuelLevel;
                    const updateFuelLevel = await getfuelLevelToday.save();
                    console.log({ updateFuelLevel });
                    if (!!updateFuelLevel) {
                      console.log("it updated successfully");
                    } else {
                      console.log("it not updated successfully");
                    }
                    console.log("currentfuelLevel is ", currentfuelLevel);
                  } else if (
                    currentfuelLevel >= -6 &&
                    !(currentfuelLevel > -1)
                  ) {
                    console.log("it return -5");
                    return;
                  } else {
                    const SaveFuelLevelConsumption =
                      await new FuelLevelConsumption({
                        topic,
                        dailyConsumption: currentfuelLevel,
                        companyName: getTanksByDeviceId.companyName,
                        deviceId: getTanksByDeviceId.deviceId,
                        companyId: getTanksByDeviceId.companyId,
                        tag: getTanksByDeviceId.tag,
                        serviceid: getTanksByDeviceId.serviceid,
                        dateCreatedAt: dayjs(),
                      }).save();

                    if (!!SaveFuelLevelConsumption) {
                      const fuelHistoryExistToday = await FuelHistory.findOne({
                        year: years,
                        month: month,
                        day: days,
                        status: "active",
                        companyName: getTanksByDeviceId.companyName,
                        deviceId: getTanksByDeviceId.deviceId,
                        companyId: getTanksByDeviceId.companyId,
                        serviceid: getTanksByDeviceId.serviceid,
                      });
                      console.log({ fuelHistoryExistToday });
                      if (!!fuelHistoryExistToday) {
                        fuelHistoryExistToday.fuelCurrentValue = fuelLevel;
                        fuelHistoryExistToday.fuelDailyConsumption =
                          currentfuelLevel;
                        const updateHistoryToday =
                          await fuelHistoryExistToday.save();
                        console.log({ updateHistoryToday });
                        if (!!updateHistoryToday) {
                          console.log("it updated history");
                        } else {
                          console.log("it not  updated history");
                        }
                      } else {
                        const SaveFuelHistoryForToday = await new FuelHistory({
                          topic,
                          fuelCurrentValue: fuelLevel,
                          fuelDailyConsumption: 0,
                          genRuntimefor: 0,
                          year: years,
                          tag: getTanksByDeviceId.tag,
                          serviceid: getTanksByDeviceId.serviceid,
                          month: month,
                          day: days,
                          companyName: getTanksByDeviceId.companyName,
                          deviceId: getTanksByDeviceId.deviceId,
                          companyId: getTanksByDeviceId.companyId,

                          dateCreatedAt: dayjs(),
                        }).save();
                        if (!!SaveFuelHistoryForToday) {
                          console.log("it saves first history to dp");
                        } else {
                          console.log("it not save today history");
                        }
                      }
                    } else {
                      console.log(" Not save to fuel consumption");
                    }
                  }
                } else {
                  console.log("Not save to db");
                }
              } else {
                console.log("it enter fuel level");
                const SaveFuelLevel = await new DbnameFuelLevel({
                  topic,
                  currentValue: fuelLevel,
                  refill: 0,
                  firstdata: true,
                  dateCreatedAt: dayjs(),
                  companyName: getTanksByDeviceId.companyName,
                  deviceId: getTanksByDeviceId.deviceId,
                  serviceid: getTanksByDeviceId.serviceid,
                  companyId: getTanksByDeviceId.companyId,
                  tag: getTanksByDeviceId.tag,
                }).save();
                if (!!SaveFuelLevel) {
                  const SaveFuelLevelConsumption =
                    await new FuelLevelConsumption({
                      topic,
                      dailyConsumption: 0,
                      dateCreatedAt: dayjs(),
                      companyName: getTanksByDeviceId.companyName,
                      deviceId: getTanksByDeviceId.deviceId,
                      companyId: getTanksByDeviceId.companyId,
                      tag: getTanksByDeviceId.tag,
                      serviceid: getTanksByDeviceId.serviceid,
                    }).save();

                  if (!!SaveFuelLevelConsumption) {
                    const SaveFuelHistoryForToday = await new FuelHistory({
                      topic,
                      fuelCurrentValue: fuelLevel,
                      fuelDailyConsumption: 0,
                      genRuntimefor: 0,
                      year: years,
                      month: month,
                      day: days,
                      companyName: getTanksByDeviceId.companyName,
                      deviceId: getTanksByDeviceId.deviceId,
                      companyId: getTanksByDeviceId.companyId,
                      tag: getTanksByDeviceId.tag,
                      serviceid: getTanksByDeviceId.serviceid,

                      dateCreatedAt: dayjs(),
                    }).save();
                    if (!!SaveFuelHistoryForToday) {
                      console.log("it saves first history to dp");
                    } else {
                      console.log("it not save today history");
                    }
                  } else {
                    console.log(" Not save to fuel consumption");
                  }
                  console.log("save to db");
                } else {
                  console.log("Not save to db");
                }
              }
            }
          }
        } else {
          console.log("it enter fuel level");
          const SaveFuelLevel = await new DbnameFuelLevel({
            topic,
            currentValue: fuelLevel,
            refill: 0,
            firstdata: true,
            dateCreatedAt: dayjs(),
            companyName: getTanksByDeviceId.companyName,
            deviceId: getTanksByDeviceId.deviceId,
            serviceid: getTanksByDeviceId.serviceid,
            companyId: getTanksByDeviceId.companyId,
            tag: getTanksByDeviceId.tag,
          }).save();
          if (!!SaveFuelLevel) {
            const SaveFuelLevelConsumption = await new FuelLevelConsumption({
              topic,
              dailyConsumption: 0,
              dateCreatedAt: dayjs(),
              companyName: getTanksByDeviceId.companyName,
              deviceId: getTanksByDeviceId.deviceId,
              companyId: getTanksByDeviceId.companyId,
              tag: getTanksByDeviceId.tag,
              serviceid: getTanksByDeviceId.serviceid,
            }).save();

            if (!!SaveFuelLevelConsumption) {
              const SaveFuelHistoryForToday = await new FuelHistory({
                topic,
                fuelCurrentValue: fuelLevel,
                fuelDailyConsumption: 0,
                genRuntimefor: 0,
                year: years,
                month: month,
                day: days,
                companyName: getTanksByDeviceId.companyName,
                deviceId: getTanksByDeviceId.deviceId,
                companyId: getTanksByDeviceId.companyId,
                tag: getTanksByDeviceId.tag,
                serviceid: getTanksByDeviceId.serviceid,

                dateCreatedAt: dayjs(),
              }).save();
              if (!!SaveFuelHistoryForToday) {
                console.log("it saves first history to dp");
              } else {
                console.log("it not save today history");
              }
            } else {
              console.log(" Not save to fuel consumption");
            }
            console.log("save to db");
          } else {
            console.log("Not save to db");
          }
        }
      } else {
        if (!!getfuelLevelToday) {
          let theftAlert = getfuelLevelToday?.currentValue - fuelLevel;

          let currentfuelLevel = getfuelLevelToday.currentValue - fuelLevel;
          let thereWillbeRefill = convertToPositive(currentfuelLevel);
          if (thereWillbeRefill > 10) {
            getfuelLevelToday.refill = convertToPositive(
              currentfuelLevel.toFixed(2)
            );
            getfuelLevelToday.currentValue = fuelLevel;

            const updateFirstValueToday = await getfuelLevelToday.save();
            console.log({ updateFirstValueToday });
            if (!!updateFirstValueToday) {
              let refills = updateFirstValueToday?.refill;
              //refil
              console.log("it updated successfully");
            } else {
              console.log("it not updated successfully");
            }
            console.log("currentfuelLevel is ", currentfuelLevel);
          } else if (theftAlert > 15 && emailSentPropelFm !== true) {
            // console.log({ emailSentIfeREsort });
            // send email notification
            console.log("it enter email sending");
            // await FeulTheftEmailNotification(
            //   siteName,
            //   convertToPositive(currentfuelLevel.toFixed(0))
            // );
            // emailSentPropelFm = true;
          }
        } else {
          const SaveFuelLevel = await new DbnameFuelLevel({
            topic,
            currentValue: fuelLevel,
            refill: 0,
            firstdata: true,
            dateCreatedAt: dayjs(),
            companyName: getTanksByDeviceId.companyName,
            deviceId: getTanksByDeviceId.deviceId,
            serviceid: getTanksByDeviceId.serviceid,
            companyId: getTanksByDeviceId.companyId,
            tag: getTanksByDeviceId.tag,
          }).save();
          if (!!SaveFuelLevel) {
            const SaveFuelLevelConsumption = await new FuelLevelConsumption({
              topic,
              dailyConsumption: 0,
              dateCreatedAt: dayjs(),
              companyName: getTanksByDeviceId.companyName,
              deviceId: getTanksByDeviceId.deviceId,
              companyId: getTanksByDeviceId.companyId,
              tag: getTanksByDeviceId.tag,
              serviceid: getTanksByDeviceId.serviceid,
            }).save();

            if (!!SaveFuelLevelConsumption) {
              const SaveFuelHistoryForToday = await new FuelHistory({
                topic,
                fuelCurrentValue: fuelLevel,
                fuelDailyConsumption: 0,
                genRuntimefor: 0,
                year: years,
                month: month,
                day: days,
                companyName: getTanksByDeviceId.companyName,
                deviceId: getTanksByDeviceId.deviceId,
                companyId: getTanksByDeviceId.companyId,
                tag: getTanksByDeviceId.tag,
                serviceid: getTanksByDeviceId.serviceid,

                dateCreatedAt: dayjs(),
              }).save();
              if (!!SaveFuelHistoryForToday) {
                console.log("it saves first history to dp");
              } else {
                console.log("it not save today history");
              }
            } else {
              console.log(" Not save to fuel consumption");
            }
            console.log("save to db");
          } else {
            console.log("Not save to db");
          }
        }
      }
    } else if (
      getTanksByDeviceId.monitorRuntime === true &&
      getTanksByDeviceId.isHavingTwoGen == false
    ) {
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
      if (
        !!genDataStatusExistForToday &&
        genDataStatusExistForToday.generatorStatus == "ON"
      ) {
        if (!!getfuelLevelToday) {
          let lowConsumption = getfuelLevelToday?.currentValue - fuelLevel;
          let currentfuelLevel = getfuelLevelToday.currentValue - fuelLevel;

          if (
            getfuelLevelToday.currentValue === fuelLevel ||
            lowConsumption <= 10
          ) {
            console.log("it enter greater than");
            return;
          } else if (currentfuelLevel < -10) {
            getfuelLevelToday.refill = convertToPositive(
              currentfuelLevel.toFixed(2)
            );
            getfuelLevelToday.currentValue = fuelLevel;

            const updateFirstValueToday = await getfuelLevelToday.save();
            console.log({ updateFirstValueToday });
            if (!!updateFirstValueToday) {
              console.log("it updated successfully");
            } else {
              console.log("it not updated successfully");
            }
            console.log("currentfuelLevel is ", currentfuelLevel);
          } else {
            if (hour === 0 && minutes == 0) {
              const SaveFuelLevel = await new DbnameFuelLevel({
                topic,
                currentValue: fuelLevel,
                firstdata: true,
                refill: 0,
                dateCreatedAt: dayjs(),
                companyName: getTanksByDeviceId.companyName,
                deviceId: getTanksByDeviceId.deviceId,
                companyId: getTanksByDeviceId.companyId,
                tag: getTanksByDeviceId.tag,
                serviceid: getTanksByDeviceId.serviceid,
              }).save();
              if (!!SaveFuelLevel) {
                const SaveFuelLevelConsumption = await new FuelLevelConsumption(
                  {
                    topic,
                    dailyConsumption: 0,
                    companyName: getTanksByDeviceId.companyName,
                    deviceId: getTanksByDeviceId.deviceId,
                    companyId: getTanksByDeviceId.companyId,
                    tag: getTanksByDeviceId.tag,
                    serviceid: getTanksByDeviceId.serviceid,
                    dateCreatedAt: dayjs(),
                  }
                ).save();
                const SaveFuelHistoryForToday = await new FuelHistory({
                  topic,
                  fuelCurrentValue: fuelLevel,
                  fuelDailyConsumption: 0,
                  genRuntimefor: 0,
                  year: years,
                  month: month,
                  day: days,
                  companyName: getTanksByDeviceId.companyName,
                  deviceId: getTanksByDeviceId.deviceId,
                  companyId: getTanksByDeviceId.companyId,
                  tag: getTanksByDeviceId.tag,
                  serviceid: getTanksByDeviceId.serviceid,

                  dateCreatedAt: dayjs(),
                }).save();

                if (!!SaveFuelLevelConsumption || !!SaveFuelHistoryForToday) {
                  console.log("save to fuel consumption time");
                } else {
                  console.log(" Not save to fuel consumption");
                }
                console.log("save to db");
              } else {
                console.log("Not save to db");
              }
            } else if (hour === 23 && minutes == 59) {
              const SaveFuelLevel = await new DbnameFuelLevel({
                topic,
                currentValue: fuelLevel,
                refill: 0,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                tag: getTanksByDeviceId.tag,
                companyName: getTanksByDeviceId.companyName,
                deviceId: getTanksByDeviceId.deviceId,
                companyId: getTanksByDeviceId.companyId,
                serviceid: getTanksByDeviceId.serviceid,
              }).save();
              if (!!SaveFuelLevel) {
                if (!!getfuelLevelToday) {
                  let currentfuelLevel =
                    getfuelLevelToday.currentValue - fuelLevel;

                  const SaveFuelLevelConsumption =
                    await new FuelLevelConsumption({
                      topic,
                      dailyConsumption: currentfuelLevel,
                      lastForTheDay: true,
                      tag: getTanksByDeviceId.tag,
                      serviceid: getTanksByDeviceId.serviceid,
                      dateCreatedAt: dayjs(),
                    }).save();

                  if (!!SaveFuelLevelConsumption) {
                    const fuelHistoryExistToday = await FuelHistory.findOne({
                      year: years,
                      month: month,
                      day: days,
                      status: "active",
                      companyName: getTanksByDeviceId.companyName,
                      deviceId: getTanksByDeviceId.deviceId,
                      companyId: getTanksByDeviceId.companyId,
                      serviceid: getTanksByDeviceId.serviceid,
                    });
                    if (!!fuelHistoryExistToday) {
                      fuelHistoryExistToday.fuelCurrentValue = fuelLevel;
                      fuelHistoryExistToday.fuelDailyConsumption =
                        currentfuelLevel;
                      const updateHistoryToday =
                        await fuelHistoryExistToday.save();
                      console.log({ updateHistoryToday });
                      if (!!updateHistoryToday) {
                        console.log("it updated history");
                      } else {
                        console.log("it not  updated history");
                      }
                    } else {
                      const SaveFuelHistoryForToday = await new FuelHistory({
                        topic,
                        fuelCurrentValue: fuelLevel,
                        fuelDailyConsumption: 0,
                        genRuntimefor: 0,
                        year: years,
                        month: month,
                        day: days,
                        companyName: getTanksByDeviceId.companyName,
                        tag: getTanksByDeviceId.tag,
                        deviceId: getTanksByDeviceId.deviceId,
                        companyId: getTanksByDeviceId.companyId,
                        serviceid: getTanksByDeviceId.serviceid,

                        dateCreatedAt: dayjs(),
                      }).save();
                      if (!!SaveFuelHistoryForToday) {
                        console.log("it saves first history to dp");
                      } else {
                        console.log("it not save today history");
                      }
                    }
                  } else {
                    console.log(" Not save to fuel consumption");
                  }
                } else {
                  console.log("Cant get fuel level");
                }
                console.log("save to db");
              } else {
                console.log("Not save to db");
              }
            } else {
              console.log({ getfuelLevelToday });
              if (!!getfuelLevelToday) {
                const SaveFuelLevel = await new DbnameFuelLevel({
                  topic,
                  currentValue: fuelLevel,
                  refill: 0,
                  companyName: getTanksByDeviceId.companyName,
                  deviceId: getTanksByDeviceId.deviceId,
                  companyId: getTanksByDeviceId.companyId,
                  tag: getTanksByDeviceId.tag,
                  serviceid: getTanksByDeviceId.serviceid,
                  dateCreatedAt: dayjs(),
                }).save();
                console.log({ SaveFuelLevel });
                if (!!SaveFuelLevel) {
                  let currentfuelLevel =
                    getfuelLevelToday.currentValue - fuelLevel;
                  if (currentfuelLevel < -10) {
                    getfuelLevelToday.currentValue = fuelLevel;
                    const updateFuelLevel = await getfuelLevelToday.save();
                    console.log({ updateFuelLevel });
                    if (!!updateFuelLevel) {
                      console.log("it updated successfully");
                    } else {
                      console.log("it not updated successfully");
                    }
                    console.log("currentfuelLevel is ", currentfuelLevel);
                  } else if (
                    currentfuelLevel >= -6 &&
                    !(currentfuelLevel > -1)
                  ) {
                    console.log("it return -5");
                    return;
                  } else {
                    const SaveFuelLevelConsumption =
                      await new FuelLevelConsumption({
                        topic,
                        dailyConsumption: currentfuelLevel,
                        companyName: getTanksByDeviceId.companyName,
                        deviceId: getTanksByDeviceId.deviceId,
                        companyId: getTanksByDeviceId.companyId,
                        tag: getTanksByDeviceId.tag,
                        serviceid: getTanksByDeviceId.serviceid,
                        dateCreatedAt: dayjs(),
                      }).save();

                    if (!!SaveFuelLevelConsumption) {
                      const fuelHistoryExistToday = await FuelHistory.findOne({
                        year: years,
                        month: month,
                        day: days,
                        status: "active",
                        companyName: getTanksByDeviceId.companyName,
                        deviceId: getTanksByDeviceId.deviceId,
                        companyId: getTanksByDeviceId.companyId,
                        serviceid: getTanksByDeviceId.serviceid,
                      });
                      console.log({ fuelHistoryExistToday });
                      if (!!fuelHistoryExistToday) {
                        fuelHistoryExistToday.fuelCurrentValue = fuelLevel;
                        fuelHistoryExistToday.fuelDailyConsumption =
                          currentfuelLevel;
                        const updateHistoryToday =
                          await fuelHistoryExistToday.save();
                        console.log({ updateHistoryToday });
                        if (!!updateHistoryToday) {
                          console.log("it updated history");
                        } else {
                          console.log("it not  updated history");
                        }
                      } else {
                        const SaveFuelHistoryForToday = await new FuelHistory({
                          topic,
                          fuelCurrentValue: fuelLevel,
                          fuelDailyConsumption: 0,
                          genRuntimefor: 0,
                          year: years,
                          tag: getTanksByDeviceId.tag,
                          serviceid: getTanksByDeviceId.serviceid,
                          month: month,
                          day: days,
                          companyName: getTanksByDeviceId.companyName,
                          deviceId: getTanksByDeviceId.deviceId,
                          companyId: getTanksByDeviceId.companyId,

                          dateCreatedAt: dayjs(),
                        }).save();
                        if (!!SaveFuelHistoryForToday) {
                          console.log("it saves first history to dp");
                        } else {
                          console.log("it not save today history");
                        }
                      }
                    } else {
                      console.log(" Not save to fuel consumption");
                    }
                  }
                } else {
                  console.log("Not save to db");
                }
              } else {
                console.log("it enter fuel level");
                const SaveFuelLevel = await new DbnameFuelLevel({
                  topic,
                  currentValue: fuelLevel,
                  refill: 0,
                  firstdata: true,
                  dateCreatedAt: dayjs(),
                  companyName: getTanksByDeviceId.companyName,
                  deviceId: getTanksByDeviceId.deviceId,
                  serviceid: getTanksByDeviceId.serviceid,
                  companyId: getTanksByDeviceId.companyId,
                  tag: getTanksByDeviceId.tag,
                }).save();
                if (!!SaveFuelLevel) {
                  const SaveFuelLevelConsumption =
                    await new FuelLevelConsumption({
                      topic,
                      dailyConsumption: 0,
                      dateCreatedAt: dayjs(),
                      companyName: getTanksByDeviceId.companyName,
                      deviceId: getTanksByDeviceId.deviceId,
                      companyId: getTanksByDeviceId.companyId,
                      tag: getTanksByDeviceId.tag,
                      serviceid: getTanksByDeviceId.serviceid,
                    }).save();

                  if (!!SaveFuelLevelConsumption) {
                    const SaveFuelHistoryForToday = await new FuelHistory({
                      topic,
                      fuelCurrentValue: fuelLevel,
                      fuelDailyConsumption: 0,
                      genRuntimefor: 0,
                      year: years,
                      month: month,
                      day: days,
                      companyName: getTanksByDeviceId.companyName,
                      deviceId: getTanksByDeviceId.deviceId,
                      companyId: getTanksByDeviceId.companyId,
                      tag: getTanksByDeviceId.tag,
                      serviceid: getTanksByDeviceId.serviceid,

                      dateCreatedAt: dayjs(),
                    }).save();
                    if (!!SaveFuelHistoryForToday) {
                      console.log("it saves first history to dp");
                    } else {
                      console.log("it not save today history");
                    }
                  } else {
                    console.log(" Not save to fuel consumption");
                  }
                  console.log("save to db");
                } else {
                  console.log("Not save to db");
                }
              }
            }
          }
        } else {
          console.log("it enter fuel level");
          const SaveFuelLevel = await new DbnameFuelLevel({
            topic,
            currentValue: fuelLevel,
            refill: 0,
            firstdata: true,
            dateCreatedAt: dayjs(),
            companyName: getTanksByDeviceId.companyName,
            deviceId: getTanksByDeviceId.deviceId,
            serviceid: getTanksByDeviceId.serviceid,
            companyId: getTanksByDeviceId.companyId,
            tag: getTanksByDeviceId.tag,
          }).save();
          if (!!SaveFuelLevel) {
            const SaveFuelLevelConsumption = await new FuelLevelConsumption({
              topic,
              dailyConsumption: 0,
              dateCreatedAt: dayjs(),
              companyName: getTanksByDeviceId.companyName,
              deviceId: getTanksByDeviceId.deviceId,
              companyId: getTanksByDeviceId.companyId,
              tag: getTanksByDeviceId.tag,
              serviceid: getTanksByDeviceId.serviceid,
            }).save();

            if (!!SaveFuelLevelConsumption) {
              const SaveFuelHistoryForToday = await new FuelHistory({
                topic,
                fuelCurrentValue: fuelLevel,
                fuelDailyConsumption: 0,
                genRuntimefor: 0,
                year: years,
                month: month,
                day: days,
                companyName: getTanksByDeviceId.companyName,
                deviceId: getTanksByDeviceId.deviceId,
                companyId: getTanksByDeviceId.companyId,
                tag: getTanksByDeviceId.tag,
                serviceid: getTanksByDeviceId.serviceid,

                dateCreatedAt: dayjs(),
              }).save();
              if (!!SaveFuelHistoryForToday) {
                console.log("it saves first history to dp");
              } else {
                console.log("it not save today history");
              }
            } else {
              console.log(" Not save to fuel consumption");
            }
            console.log("save to db");
          } else {
            console.log("Not save to db");
          }
        }
      } else {
        if (!!getfuelLevelToday) {
          let theftAlert = getfuelLevelToday?.currentValue - fuelLevel;

          let currentfuelLevel = getfuelLevelToday.currentValue - fuelLevel;
          console.log({ theftAlert, currentfuelLevel });
          let thereWillbeRefill = convertToPositive(currentfuelLevel);
          if (thereWillbeRefill > 10) {
            getfuelLevelToday.refill = convertToPositive(
              currentfuelLevel.toFixed(2)
            );
            getfuelLevelToday.currentValue = fuelLevel;

            const updateFirstValueToday = await getfuelLevelToday.save();
            console.log({ updateFirstValueToday });
            if (!!updateFirstValueToday) {
              let refills = updateFirstValueToday?.refill;
              //refil
              console.log("it updated successfully");
            } else {
              console.log("it not updated successfully");
            }
            console.log("currentfuelLevel is ", currentfuelLevel);
          } else if (theftAlert > 15 && emailSentPropelFm !== true) {
            // console.log({ emailSentIfeREsort });
            // send email notification
            console.log("it enter email sending");
            // await FeulTheftEmailNotification(
            //   siteName,
            //   convertToPositive(currentfuelLevel.toFixed(0))
            // );
            // emailSentPropelFm = true;
          }
        } else {
          const SaveFuelLevel = await new DbnameFuelLevel({
            topic,
            currentValue: fuelLevel,
            refill: 0,
            firstdata: true,
            dateCreatedAt: dayjs(),
            companyName: getTanksByDeviceId.companyName,
            deviceId: getTanksByDeviceId.deviceId,
            serviceid: getTanksByDeviceId.serviceid,
            companyId: getTanksByDeviceId.companyId,
            tag: getTanksByDeviceId.tag,
          }).save();
          if (!!SaveFuelLevel) {
            const SaveFuelLevelConsumption = await new FuelLevelConsumption({
              topic,
              dailyConsumption: 0,
              dateCreatedAt: dayjs(),
              companyName: getTanksByDeviceId.companyName,
              deviceId: getTanksByDeviceId.deviceId,
              companyId: getTanksByDeviceId.companyId,
              tag: getTanksByDeviceId.tag,
              serviceid: getTanksByDeviceId.serviceid,
            }).save();

            if (!!SaveFuelLevelConsumption) {
              const SaveFuelHistoryForToday = await new FuelHistory({
                topic,
                fuelCurrentValue: fuelLevel,
                fuelDailyConsumption: 0,
                genRuntimefor: 0,
                year: years,
                month: month,
                day: days,
                companyName: getTanksByDeviceId.companyName,
                deviceId: getTanksByDeviceId.deviceId,
                companyId: getTanksByDeviceId.companyId,
                tag: getTanksByDeviceId.tag,
                serviceid: getTanksByDeviceId.serviceid,

                dateCreatedAt: dayjs(),
              }).save();
              if (!!SaveFuelHistoryForToday) {
                console.log("it saves first history to dp");
              } else {
                console.log("it not save today history");
              }
            } else {
              console.log(" Not save to fuel consumption");
            }
            console.log("save to db");
          } else {
            console.log("Not save to db");
          }
        }
      }
    } else if (
      getTanksByDeviceId.monitorRuntime === false &&
      getTanksByDeviceId.isHavingTwoGen == false
    ) {
      /// false
      if (!!getfuelLevelToday) {
        let lowConsumption = getfuelLevelToday?.currentValue - fuelLevel;
        let currentfuelLevel = getfuelLevelToday.currentValue - fuelLevel;

        if (
          getfuelLevelToday.currentValue === fuelLevel ||
          lowConsumption <= 10
        ) {
          console.log("it enter greater than");
          return;
        } else if (currentfuelLevel < -10) {
          getfuelLevelToday.refill = convertToPositive(
            currentfuelLevel.toFixed(2)
          );
          getfuelLevelToday.currentValue = fuelLevel;

          const updateFirstValueToday = await getfuelLevelToday.save();
          console.log({ updateFirstValueToday });
          if (!!updateFirstValueToday) {
            console.log("it updated successfully");
          } else {
            console.log("it not updated successfully");
          }
          console.log("currentfuelLevel is ", currentfuelLevel);
        } else {
          if (hour === 0 && minutes == 0) {
            const SaveFuelLevel = await new DbnameFuelLevel({
              topic,
              currentValue: fuelLevel,
              firstdata: true,
              refill: 0,
              dateCreatedAt: dayjs(),
              companyName: getTanksByDeviceId.companyName,
              deviceId: getTanksByDeviceId.deviceId,
              companyId: getTanksByDeviceId.companyId,
              tag: getTanksByDeviceId.tag,
              serviceid: getTanksByDeviceId.serviceid,
            }).save();
            if (!!SaveFuelLevel) {
              const SaveFuelLevelConsumption = await new FuelLevelConsumption({
                topic,
                dailyConsumption: 0,
                companyName: getTanksByDeviceId.companyName,
                deviceId: getTanksByDeviceId.deviceId,
                companyId: getTanksByDeviceId.companyId,
                tag: getTanksByDeviceId.tag,
                serviceid: getTanksByDeviceId.serviceid,
                dateCreatedAt: dayjs(),
              }).save();
              const SaveFuelHistoryForToday = await new FuelHistory({
                topic,
                fuelCurrentValue: fuelLevel,
                fuelDailyConsumption: 0,
                genRuntimefor: 0,
                year: years,
                month: month,
                day: days,
                companyName: getTanksByDeviceId.companyName,
                deviceId: getTanksByDeviceId.deviceId,
                companyId: getTanksByDeviceId.companyId,
                tag: getTanksByDeviceId.tag,
                serviceid: getTanksByDeviceId.serviceid,

                dateCreatedAt: dayjs(),
              }).save();

              if (!!SaveFuelLevelConsumption || !!SaveFuelHistoryForToday) {
                console.log("save to fuel consumption time");
              } else {
                console.log(" Not save to fuel consumption");
              }
              console.log("save to db");
            } else {
              console.log("Not save to db");
            }
          } else if (hour === 23 && minutes == 59) {
            const SaveFuelLevel = await new DbnameFuelLevel({
              topic,
              currentValue: fuelLevel,
              refill: 0,
              lastForTheDay: true,
              dateCreatedAt: dayjs(),
              tag: getTanksByDeviceId.tag,
              companyName: getTanksByDeviceId.companyName,
              deviceId: getTanksByDeviceId.deviceId,
              companyId: getTanksByDeviceId.companyId,
              serviceid: getTanksByDeviceId.serviceid,
            }).save();
            if (!!SaveFuelLevel) {
              if (!!getfuelLevelToday) {
                let currentfuelLevel =
                  getfuelLevelToday.currentValue - fuelLevel;

                const SaveFuelLevelConsumption = await new FuelLevelConsumption(
                  {
                    topic,
                    dailyConsumption: currentfuelLevel,
                    lastForTheDay: true,
                    tag: getTanksByDeviceId.tag,
                    serviceid: getTanksByDeviceId.serviceid,
                    dateCreatedAt: dayjs(),
                  }
                ).save();

                if (!!SaveFuelLevelConsumption) {
                  const fuelHistoryExistToday = await FuelHistory.findOne({
                    year: years,
                    month: month,
                    day: days,
                    status: "active",
                    companyName: getTanksByDeviceId.companyName,
                    deviceId: getTanksByDeviceId.deviceId,
                    companyId: getTanksByDeviceId.companyId,
                    serviceid: getTanksByDeviceId.serviceid,
                  });
                  if (!!fuelHistoryExistToday) {
                    fuelHistoryExistToday.fuelCurrentValue = fuelLevel;
                    fuelHistoryExistToday.fuelDailyConsumption =
                      currentfuelLevel;
                    const updateHistoryToday =
                      await fuelHistoryExistToday.save();
                    console.log({ updateHistoryToday });
                    if (!!updateHistoryToday) {
                      console.log("it updated history");
                    } else {
                      console.log("it not  updated history");
                    }
                  } else {
                    const SaveFuelHistoryForToday = await new FuelHistory({
                      topic,
                      fuelCurrentValue: fuelLevel,
                      fuelDailyConsumption: 0,
                      genRuntimefor: 0,
                      year: years,
                      month: month,
                      day: days,
                      companyName: getTanksByDeviceId.companyName,
                      tag: getTanksByDeviceId.tag,
                      deviceId: getTanksByDeviceId.deviceId,
                      companyId: getTanksByDeviceId.companyId,
                      serviceid: getTanksByDeviceId.serviceid,

                      dateCreatedAt: dayjs(),
                    }).save();
                    if (!!SaveFuelHistoryForToday) {
                      console.log("it saves first history to dp");
                    } else {
                      console.log("it not save today history");
                    }
                  }
                } else {
                  console.log(" Not save to fuel consumption");
                }
              } else {
                console.log("Cant get fuel level");
              }
              console.log("save to db");
            } else {
              console.log("Not save to db");
            }
          } else {
            console.log({ getfuelLevelToday });
            if (!!getfuelLevelToday) {
              const SaveFuelLevel = await new DbnameFuelLevel({
                topic,
                currentValue: fuelLevel,
                refill: 0,
                companyName: getTanksByDeviceId.companyName,
                deviceId: getTanksByDeviceId.deviceId,
                companyId: getTanksByDeviceId.companyId,
                tag: getTanksByDeviceId.tag,
                serviceid: getTanksByDeviceId.serviceid,
                dateCreatedAt: dayjs(),
              }).save();
              console.log({ SaveFuelLevel });
              if (!!SaveFuelLevel) {
                let currentfuelLevel =
                  getfuelLevelToday.currentValue - fuelLevel;
                if (currentfuelLevel < -10) {
                  getfuelLevelToday.currentValue = fuelLevel;
                  const updateFuelLevel = await getfuelLevelToday.save();
                  console.log({ updateFuelLevel });
                  if (!!updateFuelLevel) {
                    console.log("it updated successfully");
                  } else {
                    console.log("it not updated successfully");
                  }
                  console.log("currentfuelLevel is ", currentfuelLevel);
                } else if (currentfuelLevel >= -6 && !(currentfuelLevel > -1)) {
                  console.log("it return -5");
                  return;
                } else {
                  const SaveFuelLevelConsumption =
                    await new FuelLevelConsumption({
                      topic,
                      dailyConsumption: currentfuelLevel,
                      companyName: getTanksByDeviceId.companyName,
                      deviceId: getTanksByDeviceId.deviceId,
                      companyId: getTanksByDeviceId.companyId,
                      tag: getTanksByDeviceId.tag,
                      serviceid: getTanksByDeviceId.serviceid,
                      dateCreatedAt: dayjs(),
                    }).save();

                  if (!!SaveFuelLevelConsumption) {
                    const fuelHistoryExistToday = await FuelHistory.findOne({
                      year: years,
                      month: month,
                      day: days,
                      status: "active",
                      companyName: getTanksByDeviceId.companyName,
                      deviceId: getTanksByDeviceId.deviceId,
                      companyId: getTanksByDeviceId.companyId,
                      serviceid: getTanksByDeviceId.serviceid,
                    });
                    console.log({ fuelHistoryExistToday });
                    if (!!fuelHistoryExistToday) {
                      fuelHistoryExistToday.fuelCurrentValue = fuelLevel;
                      fuelHistoryExistToday.fuelDailyConsumption =
                        currentfuelLevel;
                      const updateHistoryToday =
                        await fuelHistoryExistToday.save();
                      console.log({ updateHistoryToday });
                      if (!!updateHistoryToday) {
                        console.log("it updated history");
                      } else {
                        console.log("it not  updated history");
                      }
                    } else {
                      const SaveFuelHistoryForToday = await new FuelHistory({
                        topic,
                        fuelCurrentValue: fuelLevel,
                        fuelDailyConsumption: 0,
                        genRuntimefor: 0,
                        year: years,
                        tag: getTanksByDeviceId.tag,
                        serviceid: getTanksByDeviceId.serviceid,
                        month: month,
                        day: days,
                        companyName: getTanksByDeviceId.companyName,
                        deviceId: getTanksByDeviceId.deviceId,
                        companyId: getTanksByDeviceId.companyId,

                        dateCreatedAt: dayjs(),
                      }).save();
                      if (!!SaveFuelHistoryForToday) {
                        console.log("it saves first history to dp");
                      } else {
                        console.log("it not save today history");
                      }
                    }
                  } else {
                    console.log(" Not save to fuel consumption");
                  }
                }
              } else {
                console.log("Not save to db");
              }
            } else {
              console.log("it enter fuel level");
              const SaveFuelLevel = await new DbnameFuelLevel({
                topic,
                currentValue: fuelLevel,
                refill: 0,
                firstdata: true,
                dateCreatedAt: dayjs(),
                companyName: getTanksByDeviceId.companyName,
                deviceId: getTanksByDeviceId.deviceId,
                serviceid: getTanksByDeviceId.serviceid,
                companyId: getTanksByDeviceId.companyId,
                tag: getTanksByDeviceId.tag,
              }).save();
              if (!!SaveFuelLevel) {
                const SaveFuelLevelConsumption = await new FuelLevelConsumption(
                  {
                    topic,
                    dailyConsumption: 0,
                    dateCreatedAt: dayjs(),
                    companyName: getTanksByDeviceId.companyName,
                    deviceId: getTanksByDeviceId.deviceId,
                    companyId: getTanksByDeviceId.companyId,
                    tag: getTanksByDeviceId.tag,
                    serviceid: getTanksByDeviceId.serviceid,
                  }
                ).save();

                if (!!SaveFuelLevelConsumption) {
                  const SaveFuelHistoryForToday = await new FuelHistory({
                    topic,
                    fuelCurrentValue: fuelLevel,
                    fuelDailyConsumption: 0,
                    genRuntimefor: 0,
                    year: years,
                    month: month,
                    day: days,
                    companyName: getTanksByDeviceId.companyName,
                    deviceId: getTanksByDeviceId.deviceId,
                    companyId: getTanksByDeviceId.companyId,
                    tag: getTanksByDeviceId.tag,
                    serviceid: getTanksByDeviceId.serviceid,

                    dateCreatedAt: dayjs(),
                  }).save();
                  if (!!SaveFuelHistoryForToday) {
                    console.log("it saves first history to dp");
                  } else {
                    console.log("it not save today history");
                  }
                } else {
                  console.log(" Not save to fuel consumption");
                }
                console.log("save to db");
              } else {
                console.log("Not save to db");
              }
            }
          }
        }
      } else {
        console.log("it enter fuel level");
        const SaveFuelLevel = await new DbnameFuelLevel({
          topic,
          currentValue: fuelLevel,
          refill: 0,
          firstdata: true,
          dateCreatedAt: dayjs(),
          companyName: getTanksByDeviceId.companyName,
          deviceId: getTanksByDeviceId.deviceId,
          serviceid: getTanksByDeviceId.serviceid,
          companyId: getTanksByDeviceId.companyId,
          tag: getTanksByDeviceId.tag,
        }).save();
        if (!!SaveFuelLevel) {
          const SaveFuelLevelConsumption = await new FuelLevelConsumption({
            topic,
            dailyConsumption: 0,
            dateCreatedAt: dayjs(),
            companyName: getTanksByDeviceId.companyName,
            deviceId: getTanksByDeviceId.deviceId,
            companyId: getTanksByDeviceId.companyId,
            tag: getTanksByDeviceId.tag,
            serviceid: getTanksByDeviceId.serviceid,
          }).save();

          if (!!SaveFuelLevelConsumption) {
            const SaveFuelHistoryForToday = await new FuelHistory({
              topic,
              fuelCurrentValue: fuelLevel,
              fuelDailyConsumption: 0,
              genRuntimefor: 0,
              year: years,
              month: month,
              day: days,
              companyName: getTanksByDeviceId.companyName,
              deviceId: getTanksByDeviceId.deviceId,
              companyId: getTanksByDeviceId.companyId,
              tag: getTanksByDeviceId.tag,
              serviceid: getTanksByDeviceId.serviceid,

              dateCreatedAt: dayjs(),
            }).save();
            if (!!SaveFuelHistoryForToday) {
              console.log("it saves first history to dp");
            } else {
              console.log("it not save today history");
            }
          } else {
            console.log(" Not save to fuel consumption");
          }
          console.log("save to db");
        } else {
          console.log("Not save to db");
        }
      }
    }
  } catch (error) {
    console.log("error for fuel monitoring", error);
  }
};
