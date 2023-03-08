const dayjs = require("dayjs");
const { convertToPositive } = require("./helper");
const { timeConstruct } = require("./timeConstruct");

exports.getDailyEnergyConsumption = async (
  data,
  sixChar,
  topic,
  energyDbName,
  energyServiceObject,
  dbNameCalculation,
  StatusDb,
  StatusDbGen
) => {
  const { years, month, days, hour, minutes } = timeConstruct();
  console.log({ data, energyServiceObject });
  if (
    energyServiceObject.isHavingGenAndGrid === true &&
    energyServiceObject.monitorRuntime === true
  ) {
    const gridDataStatusExistForToday = await StatusDb.findOne({
      year: years,
      month: month,
      day: days,
      companyName: energyServiceObject.companyName,
      deviceId: energyServiceObject.deviceId,
      companyId: energyServiceObject.companyId,
      serviceid: energyServiceObject.serviceid,
      status: "active",
    }).sort({ dateCreatedAt: -1 });
    const genDataStatusExistForToday = await StatusDbGen.findOne({
      year: years,
      month: month,
      day: days,
      companyName: energyServiceObject.companyName,
      deviceId: energyServiceObject.deviceId,
      companyId: energyServiceObject.companyId,
      serviceid: energyServiceObject.serviceid,
      status: "active",
    }).sort({ dateCreatedAt: -1 });
    if (
      !!gridDataStatusExistForToday &&
      gridDataStatusExistForToday.gridStatus === "ON"
    ) {
      if (energyServiceObject.isHavingCalculation === true) {
        const energyServiceCalcExist = await dbNameCalculation
          .findOne({
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            tag: energyServiceObject.tag,
            companyId: energyServiceObject.companyId,
            serviceid: energyServiceObject.serviceid,
            // status: "active",
          })
          .sort({ dateCreatedAt: -1 });
        if (!!energyServiceCalcExist) {
          if (hour === 0 && minutes == 0) {
            if (sixChar === "010378") {
              //energy 1
              let energyValueDivide =
                data.energy1 / energyServiceCalcExist.energy +
                data.energy2 / energyServiceCalcExist.energy +
                data.energy3 / energyServiceCalcExist.energy;

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                firstdata: true,
                energyCurrentValue:
                  convertToPositive(energyValueDivide).toFixed(2),
                energyOrGenType: "gridEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020378") {
              // energy 2
              let energyValueDivide = convertToPositive(
                data.secondEnergy1 / energyServiceCalcExist.energy +
                  data.secondEnergy2 / energyServiceCalcExist.energy +
                  data.secondEnergy3 / energyServiceCalcExist.energy
              ).toFixed(2);

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                energyCurrentValue2: energyValueDivide,
                energyOrGenType: "gridEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                serviceid: energyServiceObject.serviceid,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010320") {
              // power 1
              let powerValueDivide = convertToPositive(
                data.power1 / energyServiceCalcExist.power +
                  data.power2 / energyServiceCalcExist.power +
                  data.power3 / energyServiceCalcExist.power +
                  data.power4 / energyServiceCalcExist.power
              ).toFixed(2);

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                power: powerValueDivide,
                energyOrGenType: "gridPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                serviceid: energyServiceObject.serviceid,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020320") {
              // power 2
              let powerValueDivide = convertToPositive(
                data.secondPower1 / energyServiceCalcExist.power +
                  data.secondPower2 / energyServiceCalcExist.power +
                  data.secondPower3 / energyServiceCalcExist.power +
                  data.secondPower4 / energyServiceCalcExist.power
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                power2: powerValueDivide,
                energyOrGenType: "gridPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010310") {
              // current
              let currentValueDivide = convertToPositive(
                data.current1 / energyServiceCalcExist.current +
                  data.current2 / energyServiceCalcExist.current +
                  data.current3 / energyServiceCalcExist.current
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                current: currentValueDivide,
                energyOrGenType: "gridCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                serviceid: energyServiceObject.serviceid,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020310") {
              // current 2
              let currentValueDivide = convertToPositive(
                data.secondCurrent1 / energyServiceCalcExist.current +
                  data.secondCurrent2 / energyServiceCalcExist.current +
                  data.secondCurrent3 / energyServiceCalcExist.current
              ).toFixed(2);

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                current2: currentValueDivide,
                energyOrGenType: "gridCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "01030C") {
              // voltage
              let voltageValueDivide = convertToPositive(
                data.voltage1 / energyServiceCalcExist.voltage +
                  data.voltage2 / energyServiceCalcExist.voltage
              ).toFixed(2);

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                voltage: voltageValueDivide,
                energyOrGenType: "gridVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                serviceid: energyServiceObject.serviceid,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption voltage");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "02030C") {
              // voltage 2
              let voltageValueDivide = convertToPositive(
                data.secondVoltage1 / energyServiceCalcExist.voltage +
                  data.secondVoltage2 / energyServiceCalcExist.voltage
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                voltage2: voltageValueDivide,
                energyOrGenType: "gridVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            }
          } else if (hour === 23 && minutes == 59) {
            if (sixChar === "010378") {
              //energy 1
              let energyValueDivide = convertToPositive(
                data.energy1 / energyServiceCalcExist.energy +
                  data.energy2 / energyServiceCalcExist.energy +
                  data.energy3 / energyServiceCalcExist.energy
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                lastForTheDay: true,
                energyCurrentValue: energyValueDivide,
                energyOrGenType: "gridEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                serviceid: energyServiceObject.serviceid,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020378") {
              // energy 2
              let energyValueDivide = convertToPositive(
                data.secondEnergy1 / energyServiceCalcExist.energy +
                  data.secondEnergy2 / energyServiceCalcExist.energy +
                  data.secondEnergy3 / energyServiceCalcExist.energy
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                lastForTheDay: true,
                energyCurrentValue2: energyValueDivide,
                energyOrGenType: "gridEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010320") {
              // power 1
              let powerValueDivide = convertToPositive(
                data.power1 / energyServiceCalcExist.power +
                  data.power2 / energyServiceCalcExist.power +
                  data.power3 / energyServiceCalcExist.power
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                power: powerValueDivide,
                energyOrGenType: "gridPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020320") {
              // power 2
              let powerValueDivide = convertToPositive(
                data.secondPower1 / energyServiceCalcExist.power +
                  data.secondPower2 / energyServiceCalcExist.power +
                  data.secondPower3 / energyServiceCalcExist.power +
                  data.secondPower4 / energyServiceCalcExist.power
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                power2: powerValueDivide,
                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "gridPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves power consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010310") {
              // current
              let currentValueDivide = convertToPositive(
                data.current1 / energyServiceCalcExist.current +
                  data.current2 / energyServiceCalcExist.current +
                  data.current3 / energyServiceCalcExist.current
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                current: currentValueDivide,
                energyOrGenType: "gridCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                serviceid: energyServiceObject.serviceid,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020310") {
              // current 2
              let currentValueDivide = convertToPositive(
                data.secondCurrent1 / energyServiceCalcExist.current +
                  data.secondCurrent2 / energyServiceCalcExist.current +
                  data.secondCurrent3 / energyServiceCalcExist.current
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                current2: currentValueDivide,
                energyOrGenType: "gridCurrent",
                serviceid: energyServiceObject.serviceid,
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "01030C") {
              // voltage
              let voltageValueDivide = convertToPositive(
                data.voltage1 / energyServiceCalcExist.voltage +
                  data.voltage2 / energyServiceCalcExist.voltage
              ).toFixed(2);

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                voltage: voltageValueDivide,
                energyOrGenType: "gridVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "02030C") {
              // voltage 2
              let voltageValueDivide = convertToPositive(
                data.secondVoltage1 / energyServiceCalcExist.voltage +
                  data.secondVoltage2 / energyServiceCalcExist.voltage
              ).toFixed(2);

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                voltage2: voltageValueDivide,
                energyOrGenType: "gridVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                serviceid: energyServiceObject.serviceid,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            }
          } else {
            if (sixChar === "010378") {
              //energy 1
              let energyValueDivide = convertToPositive(
                data.energy1 / energyServiceCalcExist.energy +
                  data.energy2 / energyServiceCalcExist.energy +
                  data.energy3 / energyServiceCalcExist.energy
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                firstdata: true,
                energyCurrentValue2: energyValueDivide,
                energyOrGenType: "gridEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020378") {
              // energy 2
              let energyValueDivide = convertToPositive(
                data.secondEnergy1 / energyServiceCalcExist.energy +
                  data.secondEnergy2 / energyServiceCalcExist.energy +
                  data.secondEnergy3 / energyServiceCalcExist.energy
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                energyCurrentValue2: energyValueDivide,
                energyOrGenType: "gridEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                serviceid: energyServiceObject.serviceid,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010320") {
              // power 1
              let powerValueDivide = convertToPositive(
                data.power1 / energyServiceCalcExist.power +
                  data.power2 / energyServiceCalcExist.power +
                  data.power3 / energyServiceCalcExist.power +
                  data.power4 / energyServiceCalcExist.power
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                power: powerValueDivide,
                energyOrGenType: "gridPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020320") {
              // power 2
              let powerValueDivide = convertToPositive(
                data.secondPower1 / energyServiceCalcExist.power +
                  data.secondPower2 / energyServiceCalcExist.power +
                  data.secondPower3 / energyServiceCalcExist.power +
                  data.secondPower4 / energyServiceCalcExist.power
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                power2: powerValueDivide,
                energyOrGenType: "gridPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                serviceid: energyServiceObject.serviceid,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010310") {
              // current
              let currentValueDivide = convertToPositive(
                data.current1 / energyServiceCalcExist.current +
                  data.current2 / energyServiceCalcExist.current +
                  data.current3 / energyServiceCalcExist.current
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                current: currentValueDivide,
                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "gridCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020310") {
              // current 2
              let currentValueDivide = convertToPositive(
                data.secondCurrent1 / energyServiceCalcExist.current +
                  data.secondCurrent2 / energyServiceCalcExist.current +
                  data.secondCurrent3 / energyServiceCalcExist.current
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                current2: currentValueDivide,
                energyOrGenType: "gridCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                serviceid: energyServiceObject.serviceid,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "01030C") {
              // voltage
              let voltageValueDivide = convertToPositive(
                data.voltage1 / energyServiceCalcExist.voltage +
                  data.voltage2 / energyServiceCalcExist.voltage
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                voltage: voltageValueDivide,
                energyOrGenType: "gridVoltage",
                serviceid: energyServiceObject.serviceid,
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "02030C") {
              // voltage 2voltageValueDivide
              let voltageValueDivide = convertToPositive(
                data.secondVoltage1 / energyServiceCalcExist.voltage +
                  data.secondVoltage2 / energyServiceCalcExist.voltage
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                voltage2: voltageValueDivide,
                energyOrGenType: "gridVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            }
          }
        } else {
          if (hour === 0 && minutes == 0) {
            if (sixChar === "010378") {
              //energy 1
              let totalEnergy = data.energy1 + data.energy2 + data.energy3;
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                firstdata: true,
                serviceid: energyServiceObject.serviceid,
                energyCurrentValue: convertToPositive(totalEnergy).toFixed(2),
                energyOrGenType: "gridEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020378") {
              // energy 2
              let totalEnergy =
                data.secondEnergy1 + data.secondEnergy2 + data.secondEnergy3;
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                energyCurrentValue2: convertToPositive(totalEnergy),
                energyOrGenType: "gridEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010320") {
              // power 1
              let TotalPower =
                data.power1 + data.power2 + data.power3 + data.power4;
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                power: convertToPositive(TotalPower),
                energyOrGenType: "gridPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020320") {
              // power 2

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                power2: convertToPositive(
                  data.secondPower1 +
                    data.secondPower2 +
                    data.secondPower3 +
                    data.secondPower4
                ).toFixed(2),

                energyOrGenType: "gridPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010310") {
              // current
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                current: convertToPositive(
                  data.current1 + data.current2 + data.current3
                ).toFixed(2),

                energyOrGenType: "gridCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020310") {
              // current 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                current2: convertToPositive(
                  data.secondCurrent1 +
                    data.secondCurrent2 +
                    data.secondCurrent3
                ).toFixed(2),

                energyOrGenType: "gridCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "01030C") {
              // voltage
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                voltage: [
                  convertToPositive(data.voltage1 + data.voltage2).toFixed(2),
                ],
                energyOrGenType: "gridVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "02030C") {
              // voltage 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                voltage2: [
                  convertToPositive(
                    data.secondVoltage1 + data.secondVoltage2
                  ).toFixed(2),
                ],
                energyOrGenType: "gridVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            }
          } else if (hour === 23 && minutes == 59) {
            if (sixChar === "010378") {
              //energy 1
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                serviceid: energyServiceObject.serviceid,
                lastForTheDay: true,
                energyCurrentValue: convertToPositive(
                  data.energy1 + data.energy2 + data.energy3
                ).toFixed(2),

                energyOrGenType: "gridEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020378") {
              // energy 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                lastForTheDay: true,
                energyCurrentValue2: convertToPositive(
                  data.secondEnergy1 + data.secondEnergy2 + data.secondEnergy3
                ).toFixed(2),

                energyOrGenType: "gridEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010320") {
              // power 1
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                power: convertToPositive(
                  data.power1 + data.power2 + data.power3 + data.power4
                ).toFixed(2),

                energyOrGenType: "gridPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020320") {
              // power 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                power2: convertToPositive(
                  data.secondPower1 +
                    data.secondPower2 +
                    data.secondPower3 +
                    data.secondPower4
                ).toFixed(2),

                energyOrGenType: "gridPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010310") {
              // current
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                current: convertToPositive(
                  data.current1 + data.current2 + data.current3
                ).toFixed(2),

                energyOrGenType: "gridCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020310") {
              // current 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                current2: convertToPositive(
                  data.secondCurrent1 +
                    data.secondCurrent2 +
                    data.secondCurrent3
                ).toFixed(2),

                energyOrGenType: "gridCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "01030C") {
              // voltage
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                voltage: convertToPositive(
                  data.voltage1 + data.voltage2
                ).toFixed(2),

                energyOrGenType: "gridVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "02030C") {
              // voltage 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                voltage2: convertToPositive(
                  data.secondVoltage1 + data.secondVoltage2
                ).toFixed(2),

                energyOrGenType: "gridVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            }
          } else {
            if (sixChar === "010378") {
              //energy 1
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                firstdata: true,
                energyCurrentValue: convertToPositive(
                  data.energy1 + data.energy2 + data.energy3
                ).toFixed(2),

                energyOrGenType: "gridEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020378") {
              // energy 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                energyCurrentValue2: [
                  convertToPositive(
                    data.secondEnergy1 + data.secondEnergy2 + data.secondEnergy3
                  ).toFixed(2),
                ],
                energyOrGenType: "gridEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010320") {
              // power 1
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                power: convertToPositive(
                  data.power1 + data.power2 + data.power3 + data.power4
                ).toFixed(2),

                energyOrGenType: "gridPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020320") {
              // power 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                power2: convertToPositive(
                  data.secondPower1 +
                    data.secondPower2 +
                    data.secondPower3 +
                    data.secondPower4
                ).toFixed(2),

                energyOrGenType: "gridPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010310") {
              // current
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                current: convertToPositive(
                  data.current1 + data.current2 + data.current3
                ).toFixed(2),

                energyOrGenType: "gridCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020310") {
              // current 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                current2: convertToPositive(
                  data.secondCurrent1 +
                    data.secondCurrent2 +
                    data.secondCurrent3
                ).toFixed(2),

                energyOrGenType: "gridCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                serviceid: energyServiceObject.serviceid,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "01030C") {
              // voltage
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                voltage: convertToPositive(
                  data.voltage1 + data.voltage2
                ).toFixed(2),

                energyOrGenType: "gridVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "02030C") {
              // voltage 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                voltage2: [
                  convertToPositive(
                    data.secondVoltage1 + data.secondVoltage2
                  ).toFixed(2),
                ],
                energyOrGenType: "gridVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            }
          }
        }
      } else {
        if (hour === 0 && minutes == 0) {
          if (sixChar === "010378") {
            //energy 1
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              dateCreatedAt: dayjs(),
              firstdata: true,
              energyCurrentValue: convertToPositive(
                data.energy1 + data.energy2 + data.energy3
              ).toFixed(2),

              energyOrGenType: "gridEnergy",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020378") {
            // energy 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              energyCurrentValue2: convertToPositive(
                data.secondEnergy1 + data.secondEnergy2 + data.secondEnergy3
              ).toFixed(2),

              energyOrGenType: "gridEnergy",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "010320") {
            // power 1
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              power: convertToPositive(
                data.power1 + data.power2 + data.power3 + data.power4
              ).toFixed(2),

              energyOrGenType: "gridPower",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020320") {
            // power 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              power2: convertToPositive(
                data.secondPower1 +
                  data.secondPower2 +
                  data.secondPower3 +
                  data.secondPower4
              ).toFixed(2),

              energyOrGenType: "gridPower",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "010310") {
            // current
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              current: convertToPositive(
                data.current1 + data.current2 + data.current3
              ).toFixed(2),

              energyOrGenType: "gridCurrent",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020310") {
            // current 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              current2: convertToPositive(
                data.secondCurrent1 + data.secondCurrent2 + data.secondCurrent3
              ).toFixed(2),

              energyOrGenType: "gridCurrent",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "01030C") {
            // voltage
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              voltage: convertToPositive(data.voltage1 + data.voltage2).toFixed(
                2
              ),

              energyOrGenType: "gridVoltage",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "02030C") {
            // voltage 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              voltage2: convertToPositive(
                data.secondVoltage1 + data.secondVoltage2
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridVoltage",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          }
        } else if (hour === 23 && minutes == 59) {
          if (sixChar === "010378") {
            //energy 1
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              dateCreatedAt: dayjs(),
              lastForTheDay: true,
              energyCurrentValue: convertToPositive(
                data.energy1 + data.energy2data.energy3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridEnergy",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020378") {
            // energy 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              dateCreatedAt: dayjs(),
              lastForTheDay: true,
              energyCurrentValue2: convertToPositive(
                data.secondEnergy1 + data.secondEnergy2 + data.secondEnergy3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridEnergy",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "010320") {
            // power 1
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              lastForTheDay: true,
              dateCreatedAt: dayjs(),
              power: convertToPositive(
                data.power1 + data.power2 + data.power3 + data.power4
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridPower",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020320") {
            // power 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              lastForTheDay: true,
              dateCreatedAt: dayjs(),
              power2: convertToPositive(
                data.secondPower1 +
                  data.secondPower2 +
                  data.secondPower3 +
                  data.secondPower4
              ).toFixed(2),

              energyOrGenType: "gridPower",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "010310") {
            // current
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              lastForTheDay: true,
              dateCreatedAt: dayjs(),
              current: convertToPositive(
                data.current1 + data.current2 + data.current3
              ).toFixed(2),

              energyOrGenType: "gridCurrent",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020310") {
            // current 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              lastForTheDay: true,
              dateCreatedAt: dayjs(),
              current2: convertToPositive(
                data.secondCurrent1 + data.secondCurrent2 + data.secondCurrent3
              ).toFixed(2),

              energyOrGenType: "gridCurrent",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "01030C") {
            // voltage
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              lastForTheDay: true,
              dateCreatedAt: dayjs(),
              voltage: convertToPositive(data.voltage1 + data.voltage2).toFixed(
                2
              ),

              energyOrGenType: "gridVoltage",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "02030C") {
            // voltage 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              lastForTheDay: true,
              dateCreatedAt: dayjs(),
              voltage2: convertToPositive(
                data.secondVoltage1 + data.secondVoltage2
              ).toFixed(2),

              energyOrGenType: "gridVoltage",
              companyName: energyServiceObject.companyName,
              serviceid: energyServiceObject.serviceid,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          }
        } else {
          if (sixChar === "010378") {
            //energy 1
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              dateCreatedAt: dayjs(),
              firstdata: true,
              energyCurrentValue: convertToPositive(
                data.energy1 + data.energy2 + data.energy3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridEnergy",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020378") {
            // energy 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              energyCurrentValue2: convertToPositive(
                data.secondEnergy1 + data.secondEnergy2 + data.secondEnergy3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridEnergy",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "010320") {
            // power 1
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              power: convertToPositive(
                data.power1 + data.power2 + data.power3 + data.power4
              ).toFixed(2),

              energyOrGenType: "gridPower",
              serviceid: energyServiceObject.serviceid,
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020320") {
            // power 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              power2: convertToPositive(
                data.secondPower1 +
                  data.secondPower2 +
                  data.secondPower3 +
                  data.secondPower4
              ).toFixed(2),

              energyOrGenType: "gridPower",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "010310") {
            // current
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              current: convertToPositive(
                data.current1 + data.current2 + data.current3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridCurrent",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020310") {
            // current 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              current2: convertToPositive(
                data.secondCurrent1 + data.secondCurrent2 + data.secondCurrent3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridCurrent",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "01030C") {
            // voltage
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              voltage: convertToPositive(data.voltage1 + data.voltage2).toFixed(
                2
              ),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridVoltage",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "02030C") {
            // voltage 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              voltage2: convertToPositive(
                data.secondVoltage1 + data.secondVoltage2
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridVoltage",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          }
        }
      }
    } else if (
      !!genDataStatusExistForToday &&
      genDataStatusExistForToday.genStatus == "ON"
    ) {
      if (energyServiceObject.isHavingCalculation === true) {
        const energyServiceCalcExist = await dbNameCalculation
          .findOne({
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            tag: energyServiceObject.tag,
            companyId: energyServiceObject.companyId,
            serviceid: energyServiceObject.serviceid,
            status: "active",
          })
          .sort({ dateCreatedAt: -1 });
        if (!!energyServiceCalcExist) {
          if (hour === 0 && minutes == 0) {
            if (sixChar === "010378") {
              //energy 1
              let energyValueDivide = convertToPositive(
                data.energy1 / energyServiceCalcExist.energy +
                  data.energy2 / energyServiceCalcExist.energy +
                  data.energy3 / energyServiceCalcExist.energy
              ).toFixed(2);

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                firstdata: true,
                energyCurrentValue: energyValueDivide,
                energyOrGenType: "genEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020378") {
              // energy 2
              let energyValueDivide = convertToPositive(
                data.secondEnergy1 / energyServiceCalcExist.energy +
                  data.secondEnergy2 / energyServiceCalcExist.energy +
                  data.secondEnergy3 / energyServiceCalcExist.energy
              ).toFixed(2);

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                energyCurrentValue2: energyValueDivide,
                energyOrGenType: "genEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010320") {
              // power 1
              let powerValueDivide = convertToPositive(
                data.power1 / energyServiceCalcExist.power +
                  data.power2 / energyServiceCalcExist.power +
                  data.power3 / energyServiceCalcExist.power +
                  data.power4 / energyServiceCalcExist.power
              ).toFixed(2);

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                power: powerValueDivide,
                energyOrGenType: "genPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020320") {
              // power 2
              let powerValueDivide = convertToPositive(
                data.secondPower1 / energyServiceCalcExist.power +
                  data.secondPower2 / energyServiceCalcExist.power +
                  data.secondPower3 / energyServiceCalcExist.power +
                  data.secondPower4 / energyServiceCalcExist.power
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                power2: powerValueDivide,
                energyOrGenType: "genPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010310") {
              // current
              let currentValueDivide = convertToPositive(
                data.current1 / energyServiceCalcExist.current +
                  data.current2 / energyServiceCalcExist.current +
                  data.current3 / energyServiceCalcExist.current
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                current: currentValueDivide,
                energyOrGenType: "genCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020310") {
              // current 2
              let currentValueDivide = convertToPositive(
                data.secondCurrent1 / energyServiceCalcExist.current +
                  data.secondCurrent2 / energyServiceCalcExist.current +
                  data.secondCurrent3 / energyServiceCalcExist.current
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                current2: currentValueDivide,
                energyOrGenType: "genCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "01030C") {
              // voltage
              let voltageValueDivide = convertToPositive(
                data.voltage1 / energyServiceCalcExist.voltage +
                  data.voltage2 / energyServiceCalcExist.voltage
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                voltage: voltageValueDivide,
                energyOrGenType: "genVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption voltage");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "02030C") {
              // voltage 2
              let voltageValueDivide = convertToPositive(
                data.secondVoltage1 / energyServiceCalcExist.voltage +
                  data.secondVoltage2 / energyServiceCalcExist.voltage
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                voltage2: voltageValueDivide,
                energyOrGenType: "genVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            }
          } else if (hour === 23 && minutes == 59) {
            if (sixChar === "010378") {
              //energy 1
              let energyValueDivide = convertToPositive(
                data.energy1 / energyServiceCalcExist.energy +
                  data.energy2 / energyServiceCalcExist.energy +
                  data.energy3 / energyServiceCalcExist.energy
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                lastForTheDay: true,
                energyCurrentValue: energyValueDivide,
                energyOrGenType: "genEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020378") {
              // energy 2
              let energyValueDivide = convertToPositive(
                data.secondEnergy1 / energyServiceCalcExist.energy +
                  data.secondEnergy2 / energyServiceCalcExist.energy +
                  data.secondEnergy3 / energyServiceCalcExist.energy
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                lastForTheDay: true,
                energyCurrentValue2: energyValueDivide,
                energyOrGenType: "genEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010320") {
              // power 1
              let powerValueDivide = convertToPositive(
                data.power1 / energyServiceCalcExist.power +
                  data.power2 / energyServiceCalcExist.power +
                  data.power3 / energyServiceCalcExist.power +
                  data.power4 / energyServiceCalcExist.power
              ).toFixed(2);

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                power: powerValueDivide,
                energyOrGenType: "genPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020320") {
              // power 2
              let powerValueDivide = convertToPositive(
                data.power1 / energyServiceCalcExist.power +
                  data.power2 / energyServiceCalcExist.power +
                  data.power3 / energyServiceCalcExist.power +
                  data.power4 / energyServiceCalcExist.power
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                power2: powerValueDivide,
                energyOrGenType: "genPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves power consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010310") {
              // current
              let currentValueDivide = convertToPositive(
                data.current1 / energyServiceCalcExist.current +
                  data.current2 / energyServiceCalcExist.current +
                  data.current3 / energyServiceCalcExist.current
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                current: currentValueDivide,
                energyOrGenType: "genCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020310") {
              // current 2
              let currentValueDivide = convertToPositive(
                data.secondCurrent1 / energyServiceCalcExist.current +
                  data.secondCurrent2 / energyServiceCalcExist.current +
                  data.secondCurrent3 / energyServiceCalcExist.current
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                current2: currentValueDivide,
                energyOrGenType: "genCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "01030C") {
              // voltage
              let voltageValueDivide = convertToPositive(
                data.voltage1 / energyServiceCalcExist.voltage +
                  data.voltage2 / energyServiceCalcExist.voltage
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                voltage: voltageValueDivide,
                energyOrGenType: "genVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "02030C") {
              // voltage 2
              let voltageValueDivide = convertToPositive(
                data.secondVoltage1 / energyServiceCalcExist.voltage +
                  data.secondVoltage2 / energyServiceCalcExist.voltage
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                voltage2: voltageValueDivide,
                energyOrGenType: "genVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            }
          } else {
            if (sixChar === "010378") {
              //energy 1
              let energyValueDivide = convertToPositive(
                data.energy1 / energyServiceCalcExist.energy +
                  data.energy2 / energyServiceCalcExist.energy +
                  data.energy3 / energyServiceCalcExist.energy
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                firstdata: true,
                energyCurrentValue2: energyValueDivide,
                energyOrGenType: "genEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020378") {
              // energy 2
              let energyValueDivide = convertToPositive(
                data.secondEnergy1 / energyServiceCalcExist.energy +
                  data.secondEnergy2 / energyServiceCalcExist.energy +
                  data.secondEnergy3 / energyServiceCalcExist.energy
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                energyCurrentValue2: energyValueDivide,
                energyOrGenType: "genEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010320") {
              // power 1
              let powerValueDivide = convertToPositive(
                data.power1 / energyServiceCalcExist.power +
                  data.power2 / energyServiceCalcExist.power +
                  data.power3 / energyServiceCalcExist.power +
                  data.power4 / energyServiceCalcExist.power
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                power: powerValueDivide,
                energyOrGenType: "genPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020320") {
              // power 2
              let powerValueDivide = convertToPositive(
                data.secondPower1 / energyServiceCalcExist.power +
                  data.secondPower2 / energyServiceCalcExist.power +
                  data.secondPower3 / energyServiceCalcExist.power +
                  data.secondPower4 / energyServiceCalcExist.power
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                power2: powerValueDivide,
                energyOrGenType: "genPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010310") {
              // current
              let currentValueDivide = convertToPositive(
                data.current1 / energyServiceCalcExist.current +
                  data.current2 / energyServiceCalcExist.current +
                  data.current3 / energyServiceCalcExist.current
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                current: currentValueDivide,
                energyOrGenType: "genCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020310") {
              // current 2
              let currentValueDivide = convertToPositive(
                data.secondCurrent1 / energyServiceCalcExist.current +
                  data.secondCurrent2 / energyServiceCalcExist.current +
                  data.secondCurrent3 / energyServiceCalcExist.current
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                current2: currentValueDivide,
                energyOrGenType: "genCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "01030C") {
              // voltage
              let voltageValueDivide = convertToPositive(
                data.voltage1 / energyServiceCalcExist.voltage +
                  data.voltage2 / energyServiceCalcExist.voltage
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                voltage: voltageValueDivide,
                energyOrGenType: "genVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "02030C") {
              // voltage 2voltageValueDivide
              let voltageValueDivide = convertToPositive(
                data.secondVoltage1 / energyServiceCalcExist.voltage +
                  data.secondVoltage2 / energyServiceCalcExist.voltage
              ).toFixed(2);
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                voltage2: voltageValueDivide,
                energyOrGenType: "genVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            }
          }
        } else {
          if (hour === 0 && minutes == 0) {
            if (sixChar === "010378") {
              //energy 1
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                firstdata: true,
                energyCurrentValue: convertToPositive(
                  data.energy1 + data.energy2 + data.energy3
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "genEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020378") {
              // energy 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                energyCurrentValue2: convertToPositive(
                  data.secondEnergy1 + data.secondEnergy2 + data.secondEnergy3
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "genEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010320") {
              // power 1
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                power: convertToPositive(
                  data.power1 + data.power2 + data.power3 + data.power4
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "genPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020320") {
              // power 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                power2: convertToPositive(
                  data.secondPower1 +
                    data.secondPower2 +
                    data.secondPower3 +
                    data.secondPower4
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "genPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010310") {
              // current
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                current: convertToPositive(
                  data.current1 + data.current2 + data.current3
                ).toFixed(2),

                energyOrGenType: "genCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020310") {
              // current 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                current2: convertToPositive(
                  data.secondCurrent1 +
                    data.secondCurrent2 +
                    data.secondCurrent3
                ).toFixed(2),

                energyOrGenType: "genCurrent",
                companyName: energyServiceObject.companyName,
                serviceid: energyServiceObject.serviceid,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "01030C") {
              // voltage
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                voltage: convertToPositive(
                  data.voltage1 + data.voltage2
                ).toFixed(2),

                energyOrGenType: "genVoltage",
                serviceid: energyServiceObject.serviceid,
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "02030C") {
              // voltage 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                voltage2: convertToPositive(
                  data.secondVoltage1 + data.secondVoltage2
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "genVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            }
          } else if (hour === 23 && minutes == 59) {
            if (sixChar === "010378") {
              //energy 1
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                lastForTheDay: true,
                energyCurrentValue: convertToPositive(
                  data.energy1 + data.energy2 + data.energy3
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "genEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020378") {
              // energy 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                lastForTheDay: true,
                energyCurrentValue2: convertToPositive(
                  data.secondEnergy1 + data.secondEnergy2 + data.secondEnergy3
                ).toFixed(2),

                energyOrGenType: "genEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010320") {
              // power 1
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                power: convertToPositive(
                  data.power1 + data.power2 + data.power3 + data.power4
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "genPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020320") {
              // power 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                power2: convertToPositive(
                  data.secondPower1 +
                    data.secondPower2 +
                    data.secondPower3 +
                    data.secondPower4
                ).toFixed(2),

                energyOrGenType: "genPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010310") {
              // current
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                current: convertToPositive(
                  data.current1 + data.current2 + data.current3
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "genCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020310") {
              // current 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                current2: convertToPositive(
                  data.secondCurrent1 +
                    data.secondCurrent2 +
                    data.secondCurrent3
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "genCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "01030C") {
              // voltage
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                voltage: convertToPositive(
                  data.voltage1 + data.voltage2
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "genVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "02030C") {
              // voltage 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                voltage2: convertToPositive(
                  data.secondVoltage1 + data.secondVoltage2
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "genVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            }
          } else {
            if (sixChar === "010378") {
              //energy 1
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                firstdata: true,
                energyCurrentValue: convertToPositive(
                  data.energy1 + data.energy2 + data.energy3
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "genEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020378") {
              // energy 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                energyCurrentValue2: convertToPositive(
                  data.secondEnergy1 + data.secondEnergy2 + data.secondEnergy3
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "genEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010320") {
              // power 1
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                power: convertToPositive(
                  data.power1 + data.power2 + data.power3 + data.power4
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "genPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020320") {
              // power 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                serviceid: energyServiceObject.serviceid,
                power2: convertToPositive(
                  data.secondPower1 +
                    data.secondPower2 +
                    data.secondPower3 +
                    data.secondPower4
                ).toFixed(2),

                energyOrGenType: "genPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010310") {
              // current
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                current: convertToPositive(
                  data.current1 + data.current2 + data.current3
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "genCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020310") {
              // current 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                current2: convertToPositive(
                  data.secondCurrent1 +
                    data.secondCurrent2 +
                    data.secondCurrent3
                ).toFixed(2),

                energyOrGenType: "genCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "01030C") {
              // voltage
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                voltage: convertToPositive(
                  data.voltage1 + data.voltage2
                ).toFixed(2),

                energyOrGenType: "genVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                serviceid: energyServiceObject.serviceid,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "02030C") {
              // voltage 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                voltage2: convertToPositive(
                  data.secondVoltage1 + data.secondVoltage2
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "genVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            }
          }
        }
      } else {
        if (hour === 0 && minutes == 0) {
          if (sixChar === "010378") {
            //energy 1
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              dateCreatedAt: dayjs(),
              firstdata: true,
              energyCurrentValue: convertToPositive(
                data.energy1 + data.energy2 + data.energy3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "genEnergy",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020378") {
            // energy 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              energyCurrentValue2: convertToPositive(
                data.secondEnergy1 + data.secondEnergy2 + data.secondEnergy3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "genEnergy",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "010320") {
            // power 1
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              power: convertToPositive(
                data.power1 + data.power2 + data.power3 + data.power4
              ).toFixed(2),

              energyOrGenType: "genPower",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020320") {
            // power 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              power2: convertToPositive(
                data.secondPower1 +
                  data.secondPower2 +
                  data.secondPower3 +
                  data.secondPower4
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "genPower",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "010310") {
            // current
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              current: convertToPositive(
                data.current1 + data.current2 + data.current3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "genCurrent",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020310") {
            // current 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              current2: convertToPositive(
                data.secondCurrent1 + data.secondCurrent2 + data.secondCurrent3
              ).toFixed(2),
              serviceid: energyServiceObject.serviceid,

              energyOrGenType: "genCurrent",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "01030C") {
            // voltage
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              voltage: convertToPositive(data.voltage1 + data.voltage2).toFixed(
                2
              ),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "genVoltage",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "02030C") {
            // voltage 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              voltage2: convertToPositive(
                data.secondVoltage1 + data.secondVoltage2
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "genVoltage",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          }
        } else if (hour === 23 && minutes == 59) {
          if (sixChar === "010378") {
            //energy 1
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              dateCreatedAt: dayjs(),
              lastForTheDay: true,
              energyCurrentValue: convertToPositive(
                data.energy1 + data.energy2 + data.energy3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "genEnergy",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020378") {
            // energy 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              dateCreatedAt: dayjs(),
              lastForTheDay: true,
              energyCurrentValue2: convertToPositive(
                data.secondEnergy1 + data.secondEnergy2 + data.secondEnergy3
              ).toFixed(2),

              energyOrGenType: "genEnergy",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              serviceid: energyServiceObject.serviceid,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "010320") {
            // power 1
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              lastForTheDay: true,
              dateCreatedAt: dayjs(),
              power: convertToPositive(
                data.power1 + data.power2 + data.power3 + data.power4
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "genPower",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020320") {
            // power 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              lastForTheDay: true,
              dateCreatedAt: dayjs(),
              power2: convertToPositive(
                data.secondPower1 +
                  data.secondPower2 +
                  data.secondPower3 +
                  data.secondPower4
              ).toFixed(2),

              energyOrGenType: "genPower",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "010310") {
            // current
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              lastForTheDay: true,
              dateCreatedAt: dayjs(),
              current: convertToPositive(
                data.current1 + data.current2 + data.current3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "genCurrent",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020310") {
            // current 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              lastForTheDay: true,
              dateCreatedAt: dayjs(),
              current2: convertToPositive(
                data.secondCurrent1 + data.secondCurrent2 + data.secondCurrent3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "genCurrent",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "01030C") {
            // voltage
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              lastForTheDay: true,
              dateCreatedAt: dayjs(),
              voltage: convertToPositive(data.voltage1 + data.voltage2).toFixed(
                2
              ),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "genVoltage",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "02030C") {
            // voltage 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              lastForTheDay: true,
              dateCreatedAt: dayjs(),
              voltage2: convertToPositive(
                data.secondVoltage1 + data.secondVoltage2
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "genVoltage",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          }
        } else {
          if (sixChar === "010378") {
            //energy 1
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              dateCreatedAt: dayjs(),
              firstdata: true,
              energyCurrentValue: convertToPositive(
                data.energy1 + data.energy2 + data.energy3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "genEnergy",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020378") {
            // energy 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              energyCurrentValue2: convertToPositive(
                data.secondEnergy1 + data.secondEnergy2 + data.secondEnergy3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "genEnergy",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "010320") {
            // power 1
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              power: convertToPositive(
                data.power1 + data.power2 + data.power3 + data.power4
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "genPower",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020320") {
            // power 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              power2: convertToPositive(
                data.secondPower1 +
                  data.secondPower2 +
                  data.secondPower3 +
                  data.secondPower4
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "genPower",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "010310") {
            // current
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              current: convertToPositive(
                data.current1 + data.current2 + data.current3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "genCurrent",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020310") {
            // current 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              current2: convertToPositive(
                data.secondCurrent1 + data.secondCurrent2 + data.secondCurrent3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "genCurrent",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "01030C") {
            // voltage
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              voltage: convertToPositive(data.voltage1 + data.voltage2).toFixed(
                2
              ),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "genVoltage",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "02030C") {
            // voltage 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              voltage2: convertToPositive(
                data.secondVoltage1 + data.secondVoltage2
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "genVoltage",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          }
        }
      }
    }
  } else if (
    energyServiceObject.isHavingGenAndGrid === false &&
    energyServiceObject.monitorRuntime === true
  ) {
    const gridDataStatusExistForToday = await StatusDb.findOne({
      year: years,
      month: month,
      day: days,
      companyName: energyServiceObject.companyName,
      deviceId: energyServiceObject.deviceId,
      companyId: energyServiceObject.companyId,
      serviceid: energyServiceObject.serviceid,
      status: "active",
    }).sort({ dateCreatedAt: -1 });
    console.log({ gridDataStatusExistForToday });
    if (
      !!gridDataStatusExistForToday &&
      gridDataStatusExistForToday.gridStatus == "ON"
    ) {
      if (energyServiceObject.isHavingCalculation === true) {
        const energyServiceCalcExist = await dbNameCalculation
          .findOne({
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            tag: energyServiceObject.tag,
            companyId: energyServiceObject.companyId,
            serviceid: energyServiceObject.serviceid,
            // status: "active",
          })
          .sort({ dateCreatedAt: -1 });
        if (!!energyServiceCalcExist) {
          if (hour === 0 && minutes == 0) {
            if (sixChar === "010378") {
              //energy 1
              let energyValueDivide =
                data.energy1 / energyServiceCalcExist.energy +
                data.energy2 / energyServiceCalcExist.energy +
                data.energy3 / energyServiceCalcExist.energy;

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                firstdata: true,
                energyCurrentValue:
                  convertToPositive(energyValueDivide).toFixed(2),
                energyOrGenType: "gridEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020378") {
              // energy 2
              let energyValueDivide =
                data.secondEnergy1 / energyServiceCalcExist.energy +
                data.secondEnergy2 / energyServiceCalcExist.energy +
                data.secondEnergy3 / energyServiceCalcExist.energy;

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                energyCurrentValue2:
                  convertToPositive(energyValueDivide).toFixed(2),
                energyOrGenType: "gridEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010320") {
              // power 1
              let powerValueDivide =
                data.power1 / energyServiceCalcExist.power +
                data.power2 / energyServiceCalcExist.power +
                data.power3 / energyServiceCalcExist.power +
                data.power4 / energyServiceCalcExist.power;

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                power: convertToPositive(powerValueDivide).toFixed(2),
                energyOrGenType: "gridPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020320") {
              // power 2
              let powerValueDivide =
                data.secondPower1 / energyServiceCalcExist.power +
                data.secondPower2 / energyServiceCalcExist.power +
                data.secondPower3 / energyServiceCalcExist.power +
                data.secondPower4 / energyServiceCalcExist.power;

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                power2: convertToPositive(powerValueDivide).toFixed(2),
                energyOrGenType: "gridPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010310") {
              // current
              let currentValueDivide =
                data.current1 / energyServiceCalcExist.current +
                data.current2 / energyServiceCalcExist.current +
                data.current3 / energyServiceCalcExist.current;

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                current: convertToPositive(currentValueDivide).toFixed(2),
                energyOrGenType: "gridCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020310") {
              // current 2
              let currentValueDivide =
                data.secondCurrent1 / energyServiceCalcExist.current +
                data.secondCurrent2 / energyServiceCalcExist.current +
                data.secondCurrent3 / energyServiceCalcExist.current;

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                serviceid: energyServiceObject.serviceid,
                firstdata: true,
                dateCreatedAt: dayjs(),
                current2: convertToPositive(currentValueDivide).toFixed(2),
                energyOrGenType: "gridCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "01030C") {
              // voltage
              let voltageValueDivide =
                data.voltage1 / energyServiceCalcExist.voltage +
                data.voltage2 / energyServiceCalcExist.voltage;

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                voltage: convertToPositive(voltageValueDivide).toFixed(2),
                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "gridVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption voltage");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "02030C") {
              // voltage 2
              let voltageValueDivide =
                data.secondVoltage1 / energyServiceCalcExist.voltage +
                data.secondVoltage2 / energyServiceCalcExist.voltage;

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                voltage2: convertToPositive(voltageValueDivide).toFixed(2),
                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "gridVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            }
          } else if (hour === 23 && minutes == 59) {
            if (sixChar === "010378") {
              //energy 1
              let energyValueDivide =
                data.energy1 / energyServiceCalcExist.energy +
                data.energy2 / energyServiceCalcExist.energy +
                data.energy3 / energyServiceCalcExist.energy;

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                lastForTheDay: true,
                energyCurrentValue:
                  convertToPositive(energyValueDivide).toFixed(2),
                energyOrGenType: "gridEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020378") {
              // energy 2
              let energyValueDivide =
                data.secondEnergy1 / energyServiceCalcExist.energy +
                data.secondEnergy2 / energyServiceCalcExist.energy +
                data.secondEnergy3 / energyServiceCalcExist.energy;

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                lastForTheDay: true,
                energyCurrentValue2:
                  convertToPositive(energyValueDivide).toFixed(2),
                energyOrGenType: "gridEnergy",
                companyName: energyServiceObject.companyName,
                serviceid: energyServiceObject.serviceid,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010320") {
              // power 1
              let powerValueDivide =
                data.power1 / energyServiceCalcExist.power +
                data.power2 / energyServiceCalcExist.power +
                data.power3 / energyServiceCalcExist.power +
                data.power4 / energyServiceCalcExist.power;

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                power: convertToPositive(powerValueDivide).toFixed(2),
                energyOrGenType: "gridPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020320") {
              // power 2
              let powerValueDivide =
                data.secondPower1 / energyServiceCalcExist.power +
                data.secondPower2 / energyServiceCalcExist.power +
                data.secondPower3 / energyServiceCalcExist.power +
                data.secondPower4 / energyServiceCalcExist.power;

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                power2: convertToPositive(powerValueDivide).toFixed(2),
                energyOrGenType: "gridPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves power consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010310") {
              // current
              let currentValueDivide =
                data.current1 / energyServiceCalcExist.current +
                data.current2 / energyServiceCalcExist.current +
                data.current3 / energyServiceCalcExist.current;

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                current: convertToPositive(currentValueDivide).toFixed(2),
                energyOrGenType: "gridCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020310") {
              // current 2
              let currentValueDivide =
                data.secondCurrent1 / energyServiceCalcExist.current +
                data.secondCurrent2 / energyServiceCalcExist.current +
                data.secondCurrent3 / energyServiceCalcExist.current;

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                current2: convertToPositive(currentValueDivide).toFixed(2),
                energyOrGenType: "gridCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "01030C") {
              // voltage
              let voltageValueDivide =
                data.voltage1 / energyServiceCalcExist.voltage +
                data.voltage2 / energyServiceCalcExist.voltage;

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                voltage: convertToPositive(voltageValueDivide).toFixed(2),
                energyOrGenType: "gridVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "02030C") {
              // voltage 2
              let voltageValueDivide =
                data.secondVoltage1 / energyServiceCalcExist.voltage +
                data.secondVoltage2 / energyServiceCalcExist.voltage;

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                voltage2: convertToPositive(voltageValueDivide).toFixed(2),
                energyOrGenType: "gridVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            }
          } else {
            if (sixChar === "010378") {
              //energy 1
              let energyValueDivide =
                data.energy1 / energyServiceCalcExist.energy +
                data.energy2 / energyServiceCalcExist.energy +
                data.energy3 / energyServiceCalcExist.energy;

              console.log({ energyValueDivide });
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                firstdata: true,
                energyCurrentValue:
                  convertToPositive(energyValueDivide).toFixed(2),
                energyOrGenType: "gridEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020378") {
              // energy 2
              let energyValueDivide =
                data.secondEnergy1 / energyServiceCalcExist.energy +
                data.secondEnergy2 / energyServiceCalcExist.energy +
                data.secondEnergy3 / energyServiceCalcExist.energy;

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                energyCurrentValue2:
                  convertToPositive(energyValueDivide).toFixed(2),
                energyOrGenType: "gridEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010320") {
              // power 1
              let powerValueDivide =
                data.power1 / energyServiceCalcExist.power +
                data.power2 / energyServiceCalcExist.power +
                data.power3 / energyServiceCalcExist.power +
                data.power4 / energyServiceCalcExist.power;

              console.log({ powerValueDivide });
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                power: convertToPositive(powerValueDivide).toFixed(2),
                energyOrGenType: "gridPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                serviceid: energyServiceObject.serviceid,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020320") {
              // power 2
              let powerValueDivide =
                data.secondPower1 / energyServiceCalcExist.power +
                data.secondPower2 / energyServiceCalcExist.power +
                data.secondPower3 / energyServiceCalcExist.power +
                data.secondPower4 / energyServiceCalcExist.power;

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                power2: convertToPositive(powerValueDivide).toFixed(2),
                energyOrGenType: "gridPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010310") {
              // current
              let currentValueDivide =
                data.current1 / energyServiceCalcExist.current +
                data.current2 / energyServiceCalcExist.current +
                data.current3 / energyServiceCalcExist.current;

              console.log({ currentValueDivide });
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                current: convertToPositive(currentValueDivide).toFixed(2),
                energyOrGenType: "gridCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                serviceid: energyServiceObject.serviceid,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020310") {
              // current 2
              let currentValueDivide =
                data.secondCurrent1 / energyServiceCalcExist.current +
                data.secondCurrent2 / energyServiceCalcExist.current +
                data.secondCurrent3 / energyServiceCalcExist.current;

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                current2: convertToPositive(currentValueDivide).toFixed(2),
                energyOrGenType: "gridCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                serviceid: energyServiceObject.serviceid,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "01030C") {
              // voltage
              let voltageValueDivide =
                data.voltage1 / energyServiceCalcExist.voltage +
                data.voltage2 / energyServiceCalcExist.voltage;

              console.log({ voltageValueDivide });
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                voltage: convertToPositive(voltageValueDivide).toFixed(2),
                energyOrGenType: "gridVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "02030C") {
              // voltage 2voltageValueDivide
              let voltageValueDivide =
                data.secondVoltage1 / energyServiceCalcExist.voltage +
                data.secondVoltage2 / energyServiceCalcExist.voltage;

              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                voltage2: convertToPositive(voltageValueDivide).toFixed(2),
                energyOrGenType: "gridVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            }
          }
        } else {
          if (hour === 0 && minutes == 0) {
            if (sixChar === "010378") {
              //energy 1
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                firstdata: true,
                energyCurrentValue: convertToPositive(
                  data.energy1 + data.energy2 + data.energy3
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "gridEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020378") {
              // energy 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                energyCurrentValue2: convertToPositive(
                  data.secondEnergy1 + data.secondEnergy2 + data.secondEnergy3
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "gridEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010320") {
              // power 1
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                power: convertToPositive(
                  data.power1 + data.power2 + data.power3 + data.power4
                ).toFixed(2),

                energyOrGenType: "gridPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020320") {
              // power 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                power2: convertToPositive(
                  data.secondPower1 +
                    data.secondPower2 +
                    data.secondPower3 +
                    data.secondPower4
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "gridPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010310") {
              // current
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                current: convertToPositive(
                  data.current1 + data.current2 + data.current3
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "gridCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020310") {
              // current 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                current2: convertToPositive(
                  data.secondCurrent1 +
                    data.secondCurrent2 +
                    data.secondCurrent3
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "gridCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "01030C") {
              // voltage
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                voltage: convertToPositive(
                  data.voltage1 + data.voltage2
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "gridVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "02030C") {
              // voltage 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                voltage2: convertToPositive(
                  data.secondVoltage1 + data.secondVoltage2
                ).toFixed(2),

                energyOrGenType: "gridVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
                serviceid: energyServiceObject.serviceid,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            }
          } else if (hour === 23 && minutes == 59) {
            if (sixChar === "010378") {
              //energy 1
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                lastForTheDay: true,
                energyCurrentValue: convertToPositive(
                  data.energy1 + data.energy2 + data.energy3
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "gridEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020378") {
              // energy 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                lastForTheDay: true,
                energyCurrentValue2: convertToPositive(
                  data.secondEnergy1 + data.secondEnergy2 + data.secondEnergy3
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "gridEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010320") {
              // power 1
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                power: convertToPositive(
                  data.power1 + data.power2 + data.power3 + data.power4
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "gridPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020320") {
              // power 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                power2: convertToPositive(
                  data.secondPower1 +
                    data.secondPower2 +
                    data.secondPower3 +
                    data.secondPower4
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "gridPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010310") {
              // current
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                current: convertToPositive(
                  data.current1 + data.current2 + data.current3
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "gridCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020310") {
              // current 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                current2: convertToPositive(
                  data.secondCurrent1 +
                    data.secondCurrent2 +
                    data.secondCurrent3
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "gridCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "01030C") {
              // voltage
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                voltage: convertToPositive(
                  data.voltage1 + data.voltage2
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "gridVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "02030C") {
              // voltage 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                lastForTheDay: true,
                dateCreatedAt: dayjs(),
                voltage2: convertToPositive(
                  data.secondVoltage1 + data.secondVoltage2
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "gridVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            }
          } else {
            if (sixChar === "010378") {
              //energy 1
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                dateCreatedAt: dayjs(),
                firstdata: true,
                energyCurrentValue: convertToPositive(
                  data.energy1 + data.energy2 + data.energy3
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "gridEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020378") {
              // energy 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                energyCurrentValue2: convertToPositive(
                  data.secondEnergy1 + data.secondEnergy2 + data.secondEnergy3
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "gridEnergy",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010320") {
              // power 1
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                power: convertToPositive(
                  data.power1 + data.power2 + data.power3 + data.power4
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "gridPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020320") {
              // power 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                power2: convertToPositive(
                  data.secondPower1 +
                    data.secondPower2 +
                    data.secondPower3 +
                    data.secondPower4
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "gridPower",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "010310") {
              // current
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                current: convertToPositive(
                  data.current1 + data.current2 + data.current3
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "gridCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "020310") {
              // current 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                current2: convertToPositive(
                  data.secondCurrent1 +
                    data.secondCurrent2 +
                    data.secondCurrent3
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "gridCurrent",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "01030C") {
              // voltage
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                voltage: convertToPositive(
                  data.voltage1 + data.voltage2
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "gridVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            } else if (sixChar === "02030C") {
              // voltage 2
              const saveEnergyConsumptionToDB = await new energyDbName({
                topic,
                year: years,
                month: month,
                day: days,
                firstdata: true,
                dateCreatedAt: dayjs(),
                voltage2: convertToPositive(
                  data.secondVoltage1 + data.secondVoltage2
                ).toFixed(2),

                serviceid: energyServiceObject.serviceid,
                energyOrGenType: "gridVoltage",
                companyName: energyServiceObject.companyName,
                deviceId: energyServiceObject.deviceId,
                tag: energyServiceObject.tag,
                companyId: energyServiceObject.companyId,
              }).save();
              if (!!saveEnergyConsumptionToDB) {
                console.log("it saves energy consumption");
              } else {
                console.log("it not saved ");
              }
            }
          }
        }
      } else {
        if (hour === 0 && minutes == 0) {
          if (sixChar === "010378") {
            //energy 1
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              dateCreatedAt: dayjs(),
              firstdata: true,
              energyCurrentValue: convertToPositive(
                data.energy1 + data.energy2 + data.energy3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridEnergy",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020378") {
            // energy 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              energyCurrentValue2: convertToPositive(
                data.secondEnergy1 + data.secondEnergy2 + data.secondEnergy3
              ).toFixed(2),

              energyOrGenType: "gridEnergy",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "010320") {
            // power 1
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              power: convertToPositive(
                data.power1 + data.power2 + data.power3 + data.power4
              ).toFixed(2),

              energyOrGenType: "gridPower",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020320") {
            // power 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              power2: convertToPositive(
                data.secondPower1 +
                  data.secondPower2 +
                  data.secondPower3 +
                  data.secondPower4
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridPower",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "010310") {
            // current
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              current: convertToPositive(
                data.current1 + data.current2 + data.current3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridCurrent",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020310") {
            // current 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              current2: convertToPositive(
                data.secondCurrent1 + data.secondCurrent2 + data.secondCurrent3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridCurrent",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "01030C") {
            // voltage
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              voltage: convertToPositive(data.voltage1 + data.voltage2).toFixed(
                2
              ),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridVoltage",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "02030C") {
            // voltage 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              voltage2: convertToPositive(
                data.secondVoltage1 + data.secondVoltage2
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridVoltage",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          }
        } else if (hour === 23 && minutes == 59) {
          if (sixChar === "010378") {
            //energy 1
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              dateCreatedAt: dayjs(),
              lastForTheDay: true,
              energyCurrentValue: convertToPositive(
                data.energy1 + data.energy2 + data.energy3
              ).toFixed(2),

              energyOrGenType: "gridEnergy",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020378") {
            // energy 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              dateCreatedAt: dayjs(),
              lastForTheDay: true,
              energyCurrentValue2: convertToPositive(
                data.secondEnergy1 + data.secondEnergy2 + data.secondEnergy3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridEnergy",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "010320") {
            // power 1
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              lastForTheDay: true,
              dateCreatedAt: dayjs(),
              power: convertToPositive(
                data.power1 + data.power2 + data.power3 + data.power4
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridPower",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020320") {
            // power 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              lastForTheDay: true,
              dateCreatedAt: dayjs(),
              power2: convertToPositive(
                data.secondPower1 +
                  data.secondPower2 +
                  data.secondPower3 +
                  data.secondPower4
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridPower",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "010310") {
            // current
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              lastForTheDay: true,
              dateCreatedAt: dayjs(),
              current: convertToPositive(
                data.current1 + data.current2 + data.current3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridCurrent",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020310") {
            // current 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              lastForTheDay: true,
              dateCreatedAt: dayjs(),
              current2: convertToPositive(
                data.secondCurrent1 + data.secondCurrent2 + data.secondCurrent3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridCurrent",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "01030C") {
            // voltage
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              lastForTheDay: true,
              dateCreatedAt: dayjs(),
              voltage: convertToPositive(data.voltage1 + data.voltage2).toFixed(
                2
              ),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridVoltage",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "02030C") {
            // voltage 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              lastForTheDay: true,
              dateCreatedAt: dayjs(),
              voltage2: convertToPositive(
                data.secondVoltage1 + data.secondVoltage2
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridVoltage",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          }
        } else {
          if (sixChar === "010378") {
            //energy 1
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              dateCreatedAt: dayjs(),
              firstdata: true,
              energyCurrentValue: convertToPositive(
                data.energy1 + data.energy2 + data.energy3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridEnergy",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020378") {
            // energy 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              energyCurrentValue2: convertToPositive(
                data.secondEnergy1 + data.secondEnergy2 + data.secondEnergy3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridEnergy",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "010320") {
            // power 1
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              power: convertToPositive(
                data.power1 + data.power2 + data.power3 + data.power4
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridPower",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020320") {
            // power 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              power2: convertToPositive(
                data.secondPower1 +
                  data.secondPower2 +
                  data.secondPower3 +
                  data.secondPower4
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridPower",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "010310") {
            // current
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              current: convertToPositive(
                data.current1 + data.current2 + data.current3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridCurrent",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020310") {
            // current 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              current2: convertToPositive(
                data.secondCurrent1 + data.secondCurrent2 + data.secondCurrent3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridCurrent",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "01030C") {
            // voltage
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              voltage: convertToPositive(data.voltage1 + data.voltage2).toFixed(
                2
              ),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridVoltage",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "02030C") {
            // voltage 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              voltage2: convertToPositive(
                data.secondVoltage1 + data.secondVoltage2
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridVoltage",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          }
        }
      }
    }
  } else if (
    energyServiceObject.isHavingGenAndGrid === false &&
    energyServiceObject.monitorRuntime === false
  ) {
    if (energyServiceObject.isHavingCalculation === true) {
      const energyServiceCalcExist = await dbNameCalculation
        .findOne({
          companyName: energyServiceObject.companyName,
          deviceId: energyServiceObject.deviceId,
          tag: energyServiceObject.tag,
          companyId: energyServiceObject.companyId,
          serviceid: energyServiceObject.serviceid,
          // status: "active",
        })
        .sort({ dateCreatedAt: -1 });
      if (!!energyServiceCalcExist) {
        if (hour === 0 && minutes == 0) {
          if (sixChar === "010378") {
            //energy 1
            let energyValueDivide =
              data.energy1 / energyServiceCalcExist.energy +
              data.energy2 / energyServiceCalcExist.energy +
              data.energy3 / energyServiceCalcExist.energy;

            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              dateCreatedAt: dayjs(),
              firstdata: true,
              energyCurrentValue:
                convertToPositive(energyValueDivide).toFixed(2),
              energyOrGenType: "gridEnergy",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020378") {
            // energy 2
            let energyValueDivide =
              data.secondEnergy1 / energyServiceCalcExist.energy +
              data.secondEnergy2 / energyServiceCalcExist.energy +
              data.secondEnergy3 / energyServiceCalcExist.energy;

            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              energyCurrentValue2:
                convertToPositive(energyValueDivide).toFixed(2),
              energyOrGenType: "gridEnergy",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "010320") {
            // power 1
            let powerValueDivide =
              data.power1 / energyServiceCalcExist.power +
              data.power2 / energyServiceCalcExist.power +
              data.power3 / energyServiceCalcExist.power +
              data.power4 / energyServiceCalcExist.power;

            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              power: convertToPositive(powerValueDivide).toFixed(2),
              energyOrGenType: "gridPower",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020320") {
            // power 2
            let powerValueDivide =
              data.secondPower1 / energyServiceCalcExist.power +
              data.secondPower2 / energyServiceCalcExist.power +
              data.secondPower3 / energyServiceCalcExist.power +
              data.secondPower4 / energyServiceCalcExist.power;

            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              power2: convertToPositive(powerValueDivide).toFixed(2),
              energyOrGenType: "gridPower",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "010310") {
            // current
            let currentValueDivide =
              data.current1 / energyServiceCalcExist.current +
              data.current2 / energyServiceCalcExist.current +
              data.current3 / energyServiceCalcExist.current;

            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              current: convertToPositive(currentValueDivide).toFixed(2),
              energyOrGenType: "gridCurrent",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020310") {
            // current 2
            let currentValueDivide =
              data.secondCurrent1 / energyServiceCalcExist.current +
              data.secondCurrent2 / energyServiceCalcExist.current +
              data.secondCurrent3 / energyServiceCalcExist.current;

            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              serviceid: energyServiceObject.serviceid,
              firstdata: true,
              dateCreatedAt: dayjs(),
              current2: convertToPositive(currentValueDivide).toFixed(2),
              energyOrGenType: "gridCurrent",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "01030C") {
            // voltage
            let voltageValueDivide =
              data.voltage1 / energyServiceCalcExist.voltage +
              data.voltage2 / energyServiceCalcExist.voltage;

            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              voltage: convertToPositive(voltageValueDivide).toFixed(2),
              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridVoltage",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption voltage");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "02030C") {
            // voltage 2
            let voltageValueDivide =
              data.secondVoltage1 / energyServiceCalcExist.voltage +
              data.secondVoltage2 / energyServiceCalcExist.voltage;

            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              voltage2: convertToPositive(voltageValueDivide).toFixed(2),
              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridVoltage",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          }
        } else if (hour === 23 && minutes == 59) {
          if (sixChar === "010378") {
            //energy 1
            let energyValueDivide =
              data.energy1 / energyServiceCalcExist.energy +
              data.energy2 / energyServiceCalcExist.energy +
              data.energy3 / energyServiceCalcExist.energy;

            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              dateCreatedAt: dayjs(),
              lastForTheDay: true,
              energyCurrentValue:
                convertToPositive(energyValueDivide).toFixed(2),
              energyOrGenType: "gridEnergy",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020378") {
            // energy 2
            let energyValueDivide =
              data.secondEnergy1 / energyServiceCalcExist.energy +
              data.secondEnergy2 / energyServiceCalcExist.energy +
              data.secondEnergy3 / energyServiceCalcExist.energy;

            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              dateCreatedAt: dayjs(),
              lastForTheDay: true,
              energyCurrentValue2:
                convertToPositive(energyValueDivide).toFixed(2),
              energyOrGenType: "gridEnergy",
              companyName: energyServiceObject.companyName,
              serviceid: energyServiceObject.serviceid,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "010320") {
            // power 1
            let powerValueDivide =
              data.power1 / energyServiceCalcExist.power +
              data.power2 / energyServiceCalcExist.power +
              data.power3 / energyServiceCalcExist.power +
              data.power4 / energyServiceCalcExist.power;

            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              lastForTheDay: true,
              dateCreatedAt: dayjs(),
              power: convertToPositive(powerValueDivide).toFixed(2),
              energyOrGenType: "gridPower",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020320") {
            // power 2
            let powerValueDivide =
              data.secondPower1 / energyServiceCalcExist.power +
              data.secondPower2 / energyServiceCalcExist.power +
              data.secondPower3 / energyServiceCalcExist.power +
              data.secondPower4 / energyServiceCalcExist.power;

            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              lastForTheDay: true,
              dateCreatedAt: dayjs(),
              power2: convertToPositive(powerValueDivide).toFixed(2),
              energyOrGenType: "gridPower",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves power consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "010310") {
            // current
            let currentValueDivide =
              data.current1 / energyServiceCalcExist.current +
              data.current2 / energyServiceCalcExist.current +
              data.current3 / energyServiceCalcExist.current;

            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              lastForTheDay: true,
              dateCreatedAt: dayjs(),
              current: convertToPositive(currentValueDivide).toFixed(2),
              energyOrGenType: "gridCurrent",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020310") {
            // current 2
            let currentValueDivide =
              data.secondCurrent1 / energyServiceCalcExist.current +
              data.secondCurrent2 / energyServiceCalcExist.current +
              data.secondCurrent3 / energyServiceCalcExist.current;

            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              lastForTheDay: true,
              dateCreatedAt: dayjs(),
              current2: convertToPositive(currentValueDivide).toFixed(2),
              energyOrGenType: "gridCurrent",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "01030C") {
            // voltage
            let voltageValueDivide =
              data.voltage1 / energyServiceCalcExist.voltage +
              data.voltage2 / energyServiceCalcExist.voltage;

            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              lastForTheDay: true,
              dateCreatedAt: dayjs(),
              voltage: convertToPositive(voltageValueDivide).toFixed(2),
              energyOrGenType: "gridVoltage",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "02030C") {
            // voltage 2
            let voltageValueDivide =
              data.secondVoltage1 / energyServiceCalcExist.voltage +
              data.secondVoltage2 / energyServiceCalcExist.voltage;

            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              lastForTheDay: true,
              dateCreatedAt: dayjs(),
              voltage2: convertToPositive(voltageValueDivide).toFixed(2),
              energyOrGenType: "gridVoltage",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          }
        } else {
          if (sixChar === "010378") {
            //energy 1
            let energyValueDivide =
              data.energy1 / energyServiceCalcExist.energy +
              data.energy2 / energyServiceCalcExist.energy +
              data.energy3 / energyServiceCalcExist.energy;

            console.log({ energyValueDivide });
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              dateCreatedAt: dayjs(),
              firstdata: true,
              energyCurrentValue:
                convertToPositive(energyValueDivide).toFixed(2),
              energyOrGenType: "gridEnergy",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020378") {
            // energy 2
            let energyValueDivide =
              data.secondEnergy1 / energyServiceCalcExist.energy +
              data.secondEnergy2 / energyServiceCalcExist.energy +
              data.secondEnergy3 / energyServiceCalcExist.energy;

            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              energyCurrentValue2:
                convertToPositive(energyValueDivide).toFixed(2),
              energyOrGenType: "gridEnergy",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "010320") {
            // power 1
            let powerValueDivide =
              data.power1 / energyServiceCalcExist.power +
              data.power2 / energyServiceCalcExist.power +
              data.power3 / energyServiceCalcExist.power +
              data.power4 / energyServiceCalcExist.power;

            console.log({ powerValueDivide });
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              power: convertToPositive(powerValueDivide).toFixed(2),
              energyOrGenType: "gridPower",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              serviceid: energyServiceObject.serviceid,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020320") {
            // power 2
            let powerValueDivide =
              data.secondPower1 / energyServiceCalcExist.power +
              data.secondPower2 / energyServiceCalcExist.power +
              data.secondPower3 / energyServiceCalcExist.power +
              data.secondPower4 / energyServiceCalcExist.power;

            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              power2: convertToPositive(powerValueDivide).toFixed(2),
              energyOrGenType: "gridPower",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "010310") {
            // current
            let currentValueDivide =
              data.current1 / energyServiceCalcExist.current +
              data.current2 / energyServiceCalcExist.current +
              data.current3 / energyServiceCalcExist.current;

            console.log({ currentValueDivide });
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              current: convertToPositive(currentValueDivide).toFixed(2),
              energyOrGenType: "gridCurrent",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              serviceid: energyServiceObject.serviceid,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020310") {
            // current 2
            let currentValueDivide =
              data.secondCurrent1 / energyServiceCalcExist.current +
              data.secondCurrent2 / energyServiceCalcExist.current +
              data.secondCurrent3 / energyServiceCalcExist.current;

            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              current2: convertToPositive(currentValueDivide).toFixed(2),
              energyOrGenType: "gridCurrent",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              serviceid: energyServiceObject.serviceid,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "01030C") {
            // voltage
            let voltageValueDivide =
              data.voltage1 / energyServiceCalcExist.voltage +
              data.voltage2 / energyServiceCalcExist.voltage;

            console.log({ voltageValueDivide });
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              voltage: convertToPositive(voltageValueDivide).toFixed(2),
              energyOrGenType: "gridVoltage",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "02030C") {
            // voltage 2voltageValueDivide
            let voltageValueDivide =
              data.secondVoltage1 / energyServiceCalcExist.voltage +
              data.secondVoltage2 / energyServiceCalcExist.voltage;

            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              voltage2: convertToPositive(voltageValueDivide).toFixed(2),
              energyOrGenType: "gridVoltage",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          }
        }
      } else {
        if (hour === 0 && minutes == 0) {
          if (sixChar === "010378") {
            //energy 1
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              dateCreatedAt: dayjs(),
              firstdata: true,
              energyCurrentValue: convertToPositive(
                data.energy1 + data.energy2 + data.energy3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridEnergy",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020378") {
            // energy 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              energyCurrentValue2: convertToPositive(
                data.secondEnergy1 + data.secondEnergy2 + data.secondEnergy3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridEnergy",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "010320") {
            // power 1
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              power: convertToPositive(
                data.power1 + data.power2 + data.power3 + data.power4
              ).toFixed(2),

              energyOrGenType: "gridPower",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020320") {
            // power 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              power2: convertToPositive(
                data.secondPower1 +
                  data.secondPower2 +
                  data.secondPower3 +
                  data.secondPower4
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridPower",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "010310") {
            // current
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              current: convertToPositive(
                data.current1 + data.current2 + data.current3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridCurrent",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020310") {
            // current 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              current2: convertToPositive(
                data.secondCurrent1 + data.secondCurrent2 + data.secondCurrent3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridCurrent",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "01030C") {
            // voltage
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              voltage: convertToPositive(data.voltage1 + data.voltage2).toFixed(
                2
              ),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridVoltage",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "02030C") {
            // voltage 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              voltage2: convertToPositive(
                data.secondVoltage1 + data.secondVoltage2
              ).toFixed(2),

              energyOrGenType: "gridVoltage",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
              serviceid: energyServiceObject.serviceid,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          }
        } else if (hour === 23 && minutes == 59) {
          if (sixChar === "010378") {
            //energy 1
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              dateCreatedAt: dayjs(),
              lastForTheDay: true,
              energyCurrentValue: convertToPositive(
                data.energy1 + data.energy2 + data.energy3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridEnergy",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020378") {
            // energy 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              dateCreatedAt: dayjs(),
              lastForTheDay: true,
              energyCurrentValue2: convertToPositive(
                data.secondEnergy1 + data.secondEnergy2 + data.secondEnergy3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridEnergy",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "010320") {
            // power 1
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              lastForTheDay: true,
              dateCreatedAt: dayjs(),
              power: convertToPositive(
                data.power1 + data.power2 + data.power3 + data.power4
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridPower",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020320") {
            // power 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              lastForTheDay: true,
              dateCreatedAt: dayjs(),
              power2: convertToPositive(
                data.secondPower1 +
                  data.secondPower2 +
                  data.secondPower3 +
                  data.secondPower4
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridPower",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "010310") {
            // current
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              lastForTheDay: true,
              dateCreatedAt: dayjs(),
              current: convertToPositive(
                data.current1 + data.current2 + data.current3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridCurrent",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020310") {
            // current 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              lastForTheDay: true,
              dateCreatedAt: dayjs(),
              current2: convertToPositive(
                data.secondCurrent1 + data.secondCurrent2 + data.secondCurrent3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridCurrent",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "01030C") {
            // voltage
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              lastForTheDay: true,
              dateCreatedAt: dayjs(),
              voltage: convertToPositive(data.voltage1 + data.voltage2).toFixed(
                2
              ),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridVoltage",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "02030C") {
            // voltage 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              lastForTheDay: true,
              dateCreatedAt: dayjs(),
              voltage2: convertToPositive(
                data.secondVoltage1 + data.secondVoltage2
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridVoltage",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          }
        } else {
          if (sixChar === "010378") {
            //energy 1
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              dateCreatedAt: dayjs(),
              firstdata: true,
              energyCurrentValue: convertToPositive(
                data.energy1 + data.energy2 + data.energy3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridEnergy",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020378") {
            // energy 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              energyCurrentValue2: convertToPositive(
                data.secondEnergy1 + data.secondEnergy2 + data.secondEnergy3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridEnergy",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "010320") {
            // power 1
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              power: convertToPositive(
                data.power1 + data.power2 + data.power3 + data.power4
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridPower",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020320") {
            // power 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              power2: convertToPositive(
                data.secondPower1 +
                  data.secondPower2 +
                  data.secondPower3 +
                  data.secondPower4
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridPower",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "010310") {
            // current
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              current: convertToPositive(
                data.current1 + data.current2 + data.current3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridCurrent",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "020310") {
            // current 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              current2: convertToPositive(
                data.secondCurrent1 + data.secondCurrent2 + data.secondCurrent3
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridCurrent",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "01030C") {
            // voltage
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              voltage: convertToPositive(data.voltage1 + data.voltage2).toFixed(
                2
              ),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridVoltage",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          } else if (sixChar === "02030C") {
            // voltage 2
            const saveEnergyConsumptionToDB = await new energyDbName({
              topic,
              year: years,
              month: month,
              day: days,
              firstdata: true,
              dateCreatedAt: dayjs(),
              voltage2: convertToPositive(
                data.secondVoltage1 + data.secondVoltage2
              ).toFixed(2),

              serviceid: energyServiceObject.serviceid,
              energyOrGenType: "gridVoltage",
              companyName: energyServiceObject.companyName,
              deviceId: energyServiceObject.deviceId,
              tag: energyServiceObject.tag,
              companyId: energyServiceObject.companyId,
            }).save();
            if (!!saveEnergyConsumptionToDB) {
              console.log("it saves energy consumption");
            } else {
              console.log("it not saved ");
            }
          }
        }
      }
    } else {
      if (hour === 0 && minutes == 0) {
        if (sixChar === "010378") {
          //energy 1
          const saveEnergyConsumptionToDB = await new energyDbName({
            topic,
            year: years,
            month: month,
            day: days,
            dateCreatedAt: dayjs(),
            firstdata: true,
            energyCurrentValue: convertToPositive(
              data.energy1 + data.energy2 + data.energy3
            ).toFixed(2),

            serviceid: energyServiceObject.serviceid,
            energyOrGenType: "gridEnergy",
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            tag: energyServiceObject.tag,
            companyId: energyServiceObject.companyId,
          }).save();
          if (!!saveEnergyConsumptionToDB) {
            console.log("it saves energy consumption");
          } else {
            console.log("it not saved ");
          }
        } else if (sixChar === "020378") {
          // energy 2
          const saveEnergyConsumptionToDB = await new energyDbName({
            topic,
            year: years,
            month: month,
            day: days,
            firstdata: true,
            dateCreatedAt: dayjs(),
            energyCurrentValue2: convertToPositive(
              data.secondEnergy1 + data.secondEnergy2 + data.secondEnergy3
            ).toFixed(2),

            energyOrGenType: "gridEnergy",
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            tag: energyServiceObject.tag,
            companyId: energyServiceObject.companyId,
          }).save();
          if (!!saveEnergyConsumptionToDB) {
            console.log("it saves energy consumption");
          } else {
            console.log("it not saved ");
          }
        } else if (sixChar === "010320") {
          // power 1
          const saveEnergyConsumptionToDB = await new energyDbName({
            topic,
            year: years,
            month: month,
            day: days,
            firstdata: true,
            dateCreatedAt: dayjs(),
            power: convertToPositive(
              data.power1 + data.power2 + data.power3 + data.power4
            ).toFixed(2),

            energyOrGenType: "gridPower",
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            tag: energyServiceObject.tag,
            companyId: energyServiceObject.companyId,
            serviceid: energyServiceObject.serviceid,
          }).save();
          if (!!saveEnergyConsumptionToDB) {
            console.log("it saves energy consumption");
          } else {
            console.log("it not saved ");
          }
        } else if (sixChar === "020320") {
          // power 2
          const saveEnergyConsumptionToDB = await new energyDbName({
            topic,
            year: years,
            month: month,
            day: days,
            firstdata: true,
            dateCreatedAt: dayjs(),
            power2: convertToPositive(
              data.secondPower1 +
                data.secondPower2 +
                data.secondPower3 +
                data.secondPower4
            ).toFixed(2),

            serviceid: energyServiceObject.serviceid,
            energyOrGenType: "gridPower",
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            tag: energyServiceObject.tag,
            companyId: energyServiceObject.companyId,
          }).save();
          if (!!saveEnergyConsumptionToDB) {
            console.log("it saves energy consumption");
          } else {
            console.log("it not saved ");
          }
        } else if (sixChar === "010310") {
          // current
          const saveEnergyConsumptionToDB = await new energyDbName({
            topic,
            year: years,
            month: month,
            day: days,
            firstdata: true,
            dateCreatedAt: dayjs(),
            current: convertToPositive(
              data.current1 + data.current2 + data.current3
            ).toFixed(2),

            serviceid: energyServiceObject.serviceid,
            energyOrGenType: "gridCurrent",
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            tag: energyServiceObject.tag,
            companyId: energyServiceObject.companyId,
          }).save();
          if (!!saveEnergyConsumptionToDB) {
            console.log("it saves energy consumption");
          } else {
            console.log("it not saved ");
          }
        } else if (sixChar === "020310") {
          // current 2
          const saveEnergyConsumptionToDB = await new energyDbName({
            topic,
            year: years,
            month: month,
            day: days,
            firstdata: true,
            dateCreatedAt: dayjs(),
            current2: convertToPositive(
              data.secondCurrent1 + data.secondCurrent2 + data.secondCurrent3
            ).toFixed(2),

            serviceid: energyServiceObject.serviceid,
            energyOrGenType: "gridCurrent",
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            tag: energyServiceObject.tag,
            companyId: energyServiceObject.companyId,
          }).save();
          if (!!saveEnergyConsumptionToDB) {
            console.log("it saves energy consumption");
          } else {
            console.log("it not saved ");
          }
        } else if (sixChar === "01030C") {
          // voltage
          const saveEnergyConsumptionToDB = await new energyDbName({
            topic,
            year: years,
            month: month,
            day: days,
            firstdata: true,
            dateCreatedAt: dayjs(),
            voltage: convertToPositive(data.voltage1 + data.voltage2).toFixed(
              2
            ),

            serviceid: energyServiceObject.serviceid,
            energyOrGenType: "gridVoltage",
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            tag: energyServiceObject.tag,
            companyId: energyServiceObject.companyId,
          }).save();
          if (!!saveEnergyConsumptionToDB) {
            console.log("it saves energy consumption");
          } else {
            console.log("it not saved ");
          }
        } else if (sixChar === "02030C") {
          // voltage 2
          const saveEnergyConsumptionToDB = await new energyDbName({
            topic,
            year: years,
            month: month,
            day: days,
            firstdata: true,
            dateCreatedAt: dayjs(),
            voltage2: convertToPositive(
              data.secondVoltage1 + data.secondVoltage2
            ).toFixed(2),

            serviceid: energyServiceObject.serviceid,
            energyOrGenType: "gridVoltage",
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            tag: energyServiceObject.tag,
            companyId: energyServiceObject.companyId,
          }).save();
          if (!!saveEnergyConsumptionToDB) {
            console.log("it saves energy consumption");
          } else {
            console.log("it not saved ");
          }
        }
      } else if (hour === 23 && minutes == 59) {
        if (sixChar === "010378") {
          //energy 1
          const saveEnergyConsumptionToDB = await new energyDbName({
            topic,
            year: years,
            month: month,
            day: days,
            dateCreatedAt: dayjs(),
            lastForTheDay: true,
            energyCurrentValue: convertToPositive(
              data.energy1 + data.energy2 + data.energy3
            ).toFixed(2),

            energyOrGenType: "gridEnergy",
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            tag: energyServiceObject.tag,
            companyId: energyServiceObject.companyId,
            serviceid: energyServiceObject.serviceid,
          }).save();
          if (!!saveEnergyConsumptionToDB) {
            console.log("it saves energy consumption");
          } else {
            console.log("it not saved ");
          }
        } else if (sixChar === "020378") {
          // energy 2
          const saveEnergyConsumptionToDB = await new energyDbName({
            topic,
            year: years,
            month: month,
            day: days,
            dateCreatedAt: dayjs(),
            lastForTheDay: true,
            energyCurrentValue2: convertToPositive(
              data.secondEnergy1 + data.secondEnergy2 + data.secondEnergy3
            ).toFixed(2),

            serviceid: energyServiceObject.serviceid,
            energyOrGenType: "gridEnergy",
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            tag: energyServiceObject.tag,
            companyId: energyServiceObject.companyId,
          }).save();
          if (!!saveEnergyConsumptionToDB) {
            console.log("it saves energy consumption");
          } else {
            console.log("it not saved ");
          }
        } else if (sixChar === "010320") {
          // power 1
          const saveEnergyConsumptionToDB = await new energyDbName({
            topic,
            year: years,
            month: month,
            day: days,
            lastForTheDay: true,
            dateCreatedAt: dayjs(),
            power: convertToPositive(
              data.power1 + data.power2 + data.power3 + data.power4
            ).toFixed(2),

            serviceid: energyServiceObject.serviceid,
            energyOrGenType: "gridPower",
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            tag: energyServiceObject.tag,
            companyId: energyServiceObject.companyId,
          }).save();
          if (!!saveEnergyConsumptionToDB) {
            console.log("it saves energy consumption");
          } else {
            console.log("it not saved ");
          }
        } else if (sixChar === "020320") {
          // power 2
          const saveEnergyConsumptionToDB = await new energyDbName({
            topic,
            year: years,
            month: month,
            day: days,
            lastForTheDay: true,
            dateCreatedAt: dayjs(),
            power2: convertToPositive(
              data.secondPower1 +
                data.secondPower2 +
                data.secondPower3 +
                data.secondPower4
            ).toFixed(2),

            serviceid: energyServiceObject.serviceid,
            energyOrGenType: "gridPower",
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            tag: energyServiceObject.tag,
            companyId: energyServiceObject.companyId,
          }).save();
          if (!!saveEnergyConsumptionToDB) {
            console.log("it saves energy consumption");
          } else {
            console.log("it not saved ");
          }
        } else if (sixChar === "010310") {
          // current
          const saveEnergyConsumptionToDB = await new energyDbName({
            topic,
            year: years,
            month: month,
            day: days,
            lastForTheDay: true,
            dateCreatedAt: dayjs(),
            current: convertToPositive(
              data.current1 + data.current2 + data.current3
            ).toFixed(2),

            serviceid: energyServiceObject.serviceid,
            energyOrGenType: "gridCurrent",
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            tag: energyServiceObject.tag,
            companyId: energyServiceObject.companyId,
          }).save();
          if (!!saveEnergyConsumptionToDB) {
            console.log("it saves energy consumption");
          } else {
            console.log("it not saved ");
          }
        } else if (sixChar === "020310") {
          // current 2
          const saveEnergyConsumptionToDB = await new energyDbName({
            topic,
            year: years,
            month: month,
            day: days,
            lastForTheDay: true,
            dateCreatedAt: dayjs(),
            current2: convertToPositive(
              data.secondCurrent1 + data.secondCurrent2 + data.secondCurrent3
            ).toFixed(2),

            serviceid: energyServiceObject.serviceid,
            energyOrGenType: "gridCurrent",
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            tag: energyServiceObject.tag,
            companyId: energyServiceObject.companyId,
          }).save();
          if (!!saveEnergyConsumptionToDB) {
            console.log("it saves energy consumption");
          } else {
            console.log("it not saved ");
          }
        } else if (sixChar === "01030C") {
          // voltage
          const saveEnergyConsumptionToDB = await new energyDbName({
            topic,
            year: years,
            month: month,
            day: days,
            lastForTheDay: true,
            dateCreatedAt: dayjs(),
            voltage: convertToPositive(data.voltage1 + data.voltage2).toFixed(
              2
            ),

            serviceid: energyServiceObject.serviceid,
            energyOrGenType: "gridVoltage",
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            tag: energyServiceObject.tag,
            companyId: energyServiceObject.companyId,
          }).save();
          if (!!saveEnergyConsumptionToDB) {
            console.log("it saves energy consumption");
          } else {
            console.log("it not saved ");
          }
        } else if (sixChar === "02030C") {
          // voltage 2
          const saveEnergyConsumptionToDB = await new energyDbName({
            topic,
            year: years,
            month: month,
            day: days,
            lastForTheDay: true,
            dateCreatedAt: dayjs(),
            voltage2: convertToPositive(
              data.secondVoltage1 + data.secondVoltage2
            ).toFixed(2),

            serviceid: energyServiceObject.serviceid,
            energyOrGenType: "gridVoltage",
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            tag: energyServiceObject.tag,
            companyId: energyServiceObject.companyId,
          }).save();
          if (!!saveEnergyConsumptionToDB) {
            console.log("it saves energy consumption");
          } else {
            console.log("it not saved ");
          }
        }
      } else {
        if (sixChar === "010378") {
          //energy 1
          const saveEnergyConsumptionToDB = await new energyDbName({
            topic,
            year: years,
            month: month,
            day: days,
            dateCreatedAt: dayjs(),
            firstdata: true,
            energyCurrentValue: convertToPositive(
              data.energy1 + data.energy2 + data.energy3
            ).toFixed(2),

            serviceid: energyServiceObject.serviceid,
            energyOrGenType: "gridEnergy",
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            tag: energyServiceObject.tag,
            companyId: energyServiceObject.companyId,
          }).save();
          if (!!saveEnergyConsumptionToDB) {
            console.log("it saves energy consumption");
          } else {
            console.log("it not saved ");
          }
        } else if (sixChar === "020378") {
          // energy 2
          const saveEnergyConsumptionToDB = await new energyDbName({
            topic,
            year: years,
            month: month,
            day: days,
            firstdata: true,
            dateCreatedAt: dayjs(),
            energyCurrentValue2: convertToPositive(
              data.secondEnergy1 + data.secondEnergy2 + data.secondEnergy3
            ).toFixed(2),

            serviceid: energyServiceObject.serviceid,
            energyOrGenType: "gridEnergy",
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            tag: energyServiceObject.tag,
            companyId: energyServiceObject.companyId,
          }).save();
          if (!!saveEnergyConsumptionToDB) {
            console.log("it saves energy consumption");
          } else {
            console.log("it not saved ");
          }
        } else if (sixChar === "010320") {
          // power 1
          const saveEnergyConsumptionToDB = await new energyDbName({
            topic,
            year: years,
            month: month,
            day: days,
            firstdata: true,
            dateCreatedAt: dayjs(),
            power: convertToPositive(
              data.power1 + data.power2 + data.power3 + data.power4
            ).toFixed(2),

            serviceid: energyServiceObject.serviceid,
            energyOrGenType: "gridPower",
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            tag: energyServiceObject.tag,
            companyId: energyServiceObject.companyId,
          }).save();
          if (!!saveEnergyConsumptionToDB) {
            console.log("it saves energy consumption");
          } else {
            console.log("it not saved ");
          }
        } else if (sixChar === "020320") {
          // power 2
          const saveEnergyConsumptionToDB = await new energyDbName({
            topic,
            year: years,
            month: month,
            day: days,
            firstdata: true,
            dateCreatedAt: dayjs(),
            power2: convertToPositive(
              data.secondPower1 +
                data.secondPower2 +
                data.secondPower3 +
                data.secondPower4
            ).toFixed(2),

            serviceid: energyServiceObject.serviceid,
            energyOrGenType: "gridPower",
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            tag: energyServiceObject.tag,
            companyId: energyServiceObject.companyId,
          }).save();
          if (!!saveEnergyConsumptionToDB) {
            console.log("it saves energy consumption");
          } else {
            console.log("it not saved ");
          }
        } else if (sixChar === "010310") {
          // current
          const saveEnergyConsumptionToDB = await new energyDbName({
            topic,
            year: years,
            month: month,
            day: days,
            firstdata: true,
            dateCreatedAt: dayjs(),
            current: convertToPositive(
              data.current1 + data.current2 + data.current3
            ).toFixed(2),

            serviceid: energyServiceObject.serviceid,
            energyOrGenType: "gridCurrent",
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            tag: energyServiceObject.tag,
            companyId: energyServiceObject.companyId,
          }).save();
          if (!!saveEnergyConsumptionToDB) {
            console.log("it saves energy consumption");
          } else {
            console.log("it not saved ");
          }
        } else if (sixChar === "020310") {
          // current 2
          const saveEnergyConsumptionToDB = await new energyDbName({
            topic,
            year: years,
            month: month,
            day: days,
            firstdata: true,
            dateCreatedAt: dayjs(),
            current2: convertToPositive(
              data.secondCurrent1 + data.secondCurrent2 + data.secondCurrent3
            ).toFixed(2),

            serviceid: energyServiceObject.serviceid,
            energyOrGenType: "gridCurrent",
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            tag: energyServiceObject.tag,
            companyId: energyServiceObject.companyId,
          }).save();
          if (!!saveEnergyConsumptionToDB) {
            console.log("it saves energy consumption");
          } else {
            console.log("it not saved ");
          }
        } else if (sixChar === "01030C") {
          // voltage
          const saveEnergyConsumptionToDB = await new energyDbName({
            topic,
            year: years,
            month: month,
            day: days,
            firstdata: true,
            dateCreatedAt: dayjs(),
            voltage: convertToPositive(data.voltage1 + data.voltage2).toFixed(
              2
            ),

            serviceid: energyServiceObject.serviceid,
            energyOrGenType: "gridVoltage",
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            tag: energyServiceObject.tag,
            companyId: energyServiceObject.companyId,
          }).save();
          if (!!saveEnergyConsumptionToDB) {
            console.log("it saves energy consumption");
          } else {
            console.log("it not saved ");
          }
        } else if (sixChar === "02030C") {
          // voltage 2
          const saveEnergyConsumptionToDB = await new energyDbName({
            topic,
            year: years,
            month: month,
            day: days,
            firstdata: true,
            dateCreatedAt: dayjs(),
            voltage2: convertToPositive(
              data.secondVoltage1 + data.secondVoltage2
            ).toFixed(2),

            serviceid: energyServiceObject.serviceid,
            energyOrGenType: "gridVoltage",
            companyName: energyServiceObject.companyName,
            deviceId: energyServiceObject.deviceId,
            tag: energyServiceObject.tag,
            companyId: energyServiceObject.companyId,
          }).save();
          if (!!saveEnergyConsumptionToDB) {
            console.log("it saves energy consumption");
          } else {
            console.log("it not saved ");
          }
        }
      }
    }
  }
};
