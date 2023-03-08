const dayjs = require("dayjs");
const { publishMqtt, convertToPositive } = require("../helper");

const now = new Date();
const hour = now.getHours();
const minutes = now.getMinutes();
const years = new Date().getFullYear();
const month = new Date().getMonth() + 1;
const days = new Date().getDate();

exports.gridEnergyRealTimeLogic = async (
  DbName,
  responseData,
  publishUrl,

  topic,
  message
) => {
  const energyRealTimeExistToday = await DbName.findOne({
    year: years,
    month: month,
    day: days,
    status: "active",
    dateCreatedAt: {
      $gte: dayjs().startOf("d"),
      $lte: dayjs().endOf("d"),
    },
  });

  if (!!energyRealTimeExistToday) {
    let energyEealTimeConsumpValue =
      energyRealTimeExistToday.gridEnergycurrentValue === 0
        ? energyRealTimeExistToday.gridEnergycurrentValue
        : energyRealTimeExistToday.gridEnergycurrentValue - responseData;

    console.log(
      { energyEealTimeConsumpValue },
      "realTimeConsumpValue",
      Math.abs(energyEealTimeConsumpValue)
    );

    await publishMqtt(
      await publishUrl,
      {
        "grid-energy-real-time": convertToPositive(energyEealTimeConsumpValue),
      },
      message
    );

    energyRealTimeExistToday.gridEnergycurrentValue = responseData;

    const updateRealTime = await energyRealTimeExistToday.save();
    console.log({ updateRealTime });
    if (!!updateRealTime) {
      console.log("it updated ajose energy real time");
    } else {
      console.log("its not updated  energy real time");
    }
  } else {
    const SaveGridEnergyConsumpt = await new DbName({
      topic,
      gridEnergycurrentValue: responseData,
      year: years,
      month: month,
      day: days,
      dateCreatedAt: dayjs(),
    }).save();
    console.log({ SaveGridEnergyConsumpt });
    if (!!SaveGridEnergyConsumpt) {
      console.log("It saves ajose energy real time data to db");
    } else {
      console.log("it did not save energy realtime to db");
    }
  }
};
exports.genEnergyRealTimeLogic = async (
  DbName,
  responseData,
  publishUrl,

  topic,
  message
) => {
  const energyRealTimeExistToday = await DbName.findOne({
    year: years,
    month: month,
    day: days,
    status: "active",
    dateCreatedAt: {
      $gte: dayjs().startOf("d"),
      $lte: dayjs().endOf("d"),
    },
  });

  if (!!energyRealTimeExistToday) {
    let energyEealTimeConsumpValue =
      energyRealTimeExistToday.genEnergycurrentValue === 0
        ? energyRealTimeExistToday.genEnergycurrentValue
        : energyRealTimeExistToday.genEnergycurrentValue - responseData;

    console.log(
      { energyEealTimeConsumpValue },
      "realTimeConsumpValue",
      Math.abs(energyEealTimeConsumpValue)
    );

    await publishMqtt(
      await publishUrl,
      {
        "gen-energy-real-time": convertToPositive(energyEealTimeConsumpValue),
      },
      message
    );

    energyRealTimeExistToday.genEnergycurrentValue = responseData;

    const updateRealTime = await energyRealTimeExistToday.save();
    console.log({ updateRealTime });
    if (!!updateRealTime) {
      console.log("it updated ajose gen energy real time");
    } else {
      console.log("its not updated gen  energy real time");
    }
  } else {
    const SaveGridEnergyConsumpt = await new DbName({
      topic,
      genEnergycurrentValue: responseData,
      year: years,
      month: month,
      day: days,
      dateCreatedAt: dayjs(),
    }).save();
    console.log({ SaveGridEnergyConsumpt });
    if (!!SaveGridEnergyConsumpt) {
      console.log("It saves ajose  gen energy real time data to db");
    } else {
      console.log("it did not save gen  energy realtime to db");
    }
  }
};
