const dayjs = require("dayjs");
const {
  calculateDuration,
  publishMqtt,
  calculateDuration2,
} = require("./helper");
const { timeConstruct } = require("./timeConstruct");

exports.getGenruntimeMaitama = async (getResult, publishUrl, message) => {
  const gridRuntime = getResult?.newTimeDiff + getResult?.timeDiff;
  console.log("calculateDuration 0 ajose", calculateDuration2(gridRuntime));
  if (getResult === null) {
    // console.log(
    //   "calculateDuration 0 ajose",
    //   calculateDuration2(getResult.updatedAt - getResult.dateCreatedAt)
    // );

    await publishMqtt(
      await publishUrl,
      {
        "generator-runtime": calculateDuration(0),
      },
      message
    );
  } else if (!!getResult) {
    await publishMqtt(
      await publishUrl,
      {
        "generator-runtime": calculateDuration2(gridRuntime),
      },
      message
    );
  }
};
exports.getGenruntimeStatusMaitama = async (getResult, publishUrl, message) => {
  if (!!getResult) {
    await publishMqtt(
      await publishUrl,
      {
        "generator-status": getResult.generatorStatus,
      },
      message
    );
  } else if (getResult === null) {
    await publishMqtt(
      await publishUrl,
      {
        "generator-status": "OFF",
      },
      message
    );
  }
};
exports.getVencoBigGenRuntimeStatus = async (
  getResult,
  publishUrl,
  message
) => {
  if (!!getResult) {
    await publishMqtt(
      await publishUrl,
      {
        "big-generator-status": getResult.generatorStatus,
      },
      message
    );
  } else if (getResult === null) {
    await publishMqtt(
      await publishUrl,
      {
        "big-generator-status": "OFF",
      },
      message
    );
  }
};
exports.getGenruntimeStatusVencoGenSmall = async (
  getResult,
  publishUrl,
  message
) => {
  if (!!getResult) {
    await publishMqtt(
      await publishUrl,
      {
        "small-generator-status": getResult.generatorStatus,
      },
      message
    );
  } else if (getResult === null) {
    await publishMqtt(
      await publishUrl,
      {
        "small-generator-status": "OFF",
      },
      message
    );
  }
};
exports.getGridruntimeMaitama = async (getResult, publishUrl, message) => {
  // let dateCreated = dayjs(getResult?.dateCreatedAt);
  // let dateUpdated = dayjs(getResult?.updatedAt);
  // let timeDiff = dateUpdated.diff(dateCreated, "m");
  const gridRuntime = getResult?.newTimeDiff + getResult?.timeDiff;
  console.log({ gridRuntime });
  console.log("calculateDuration 0 ajose", calculateDuration2(gridRuntime));
  if (getResult === null) {
    // console.log(
    //   "calculateDuration 0 ajose",
    //   calculateDuration2(getResult.updatedAt - getResult.dateCreatedAt)
    // );

    await publishMqtt(
      await publishUrl,
      {
        "grid-runtime": calculateDuration(0),
      },
      message
    );
  } else if (!!getResult) {
    await publishMqtt(
      await publishUrl,
      {
        "grid-runtime": calculateDuration2(gridRuntime),
      },
      message
    );
  }
};

exports.getGridruntimeStatusMaitama = async (
  getResult,
  publishUrl,
  message
) => {
  if (!!getResult) {
    // console.log("getResult grid", getResult.gridStatus);
    await publishMqtt(
      await publishUrl,
      {
        "grid-status": getResult.gridStatus,
      },
      message
    );
  } else if (getResult === null) {
    await publishMqtt(
      await publishUrl,
      {
        "grid-status": "OFF",
      },
      message
    );
  }
};

exports.getGridruntimeStatusVencoGrid = async (
  getResult,
  publishUrl,
  message
) => {
  if (!!getResult) {
    // console.log("getResult grid", getResult.gridStatus);
    await publishMqtt(
      await publishUrl,
      {
        "grid-status": getResult.gridStatus,
      },
      message
    );
  } else if (getResult == null) {
    await publishMqtt(
      await publishUrl,
      {
        "grid-status": "OFF",
      },
      message
    );
  }
};

exports.getGenruntimeVencoGrid = async (getResult, publishUrl, message) => {
  const gridRuntime = getResult?.newTimeDiff + getResult?.timeDiff;
  console.log("calculateDuration 0 ajose", calculateDuration2(gridRuntime));
  if (getResult === null) {
    // console.log(
    //   "calculateDuration 0 ajose",
    //   calculateDuration2(getResult.updatedAt - getResult.dateCreatedAt)
    // );

    await publishMqtt(
      await publishUrl,
      {
        "grid-runtime": calculateDuration(0),
      },
      message
    );
  } else if (!!getResult) {
    await publishMqtt(
      await publishUrl,
      {
        "grid-runtime": calculateDuration2(gridRuntime),
      },
      message
    );
  }
};

exports.getGridruntimeVencoGenBig = async (getResult, publishUrl, message) => {
  // let dateCreated = dayjs(getResult?.dateCreatedAt);
  // let dateUpdated = dayjs(getResult?.updatedAt);
  // let timeDiff = dateUpdated.diff(dateCreated, "m");
  const gridRuntime = getResult?.newTimeDiff + getResult?.timeDiff;
  console.log({ gridRuntime });
  console.log("calculateDuration 0 ajose", calculateDuration2(gridRuntime));
  if (getResult === null) {
    // console.log(
    //   "calculateDuration 0 ajose",
    //   calculateDuration2(getResult.updatedAt - getResult.dateCreatedAt)
    // );

    await publishMqtt(
      await publishUrl,
      {
        "big-generator-runtime": calculateDuration(0),
      },
      message
    );
  } else if (!!getResult) {
    await publishMqtt(
      await publishUrl,
      {
        "big-generator-runtime": calculateDuration2(gridRuntime),
      },
      message
    );
  }
};
exports.getGridruntimeVencoGenSmall = async (
  getResult,
  publishUrl,
  message
) => {
  // let dateCreated = dayjs(getResult?.dateCreatedAt);
  // let dateUpdated = dayjs(getResult?.updatedAt);
  // let timeDiff = dateUpdated.diff(dateCreated, "m");
  const gridRuntime = getResult?.newTimeDiff + getResult?.timeDiff;
  console.log({ gridRuntime });
  console.log("calculateDuration 0 ajose", calculateDuration2(gridRuntime));
  if (getResult === null) {
    // console.log(
    //   "calculateDuration 0 ajose",
    //   calculateDuration2(getResult.updatedAt - getResult.dateCreatedAt)
    // );

    await publishMqtt(
      await publishUrl,
      {
        "small-generator-runtime": calculateDuration(0),
      },
      message
    );
  } else if (!!getResult) {
    await publishMqtt(
      await publishUrl,
      {
        "small-generator-runtime": calculateDuration2(gridRuntime),
      },
      message
    );
  }
};
exports.getGenruntimeGarki = async (getResult, publishUrl, message) => {
  const gridRuntime = getResult?.newTimeDiff + getResult?.timeDiff;
  console.log("calculateDuration 0 ajose", calculateDuration2(gridRuntime));
  if (getResult === null) {
    // console.log(
    //   "calculateDuration 0 ajose",
    //   calculateDuration2(getResult.updatedAt - getResult.dateCreatedAt)
    // );

    await publishMqtt(
      await publishUrl,
      {
        "generator-runtime": calculateDuration(0),
      },
      message
    );
  } else if (!!getResult) {
    await publishMqtt(
      await publishUrl,
      {
        "generator-runtime": calculateDuration2(gridRuntime),
      },
      message
    );
  }
};
exports.getGenruntimeStatusGarki = async (getResult, publishUrl, message) => {
  if (!!getResult) {
    await publishMqtt(
      await publishUrl,
      {
        "generator-status": getResult.generatorStatus,
      },
      message
    );
  } else if (getResult === null) {
    await publishMqtt(
      await publishUrl,
      {
        "generator-status": "OFF",
      },
      message
    );
  }
};
exports.getGridruntimeGarki = async (getResult, publishUrl, message) => {
  // let dateCreated = dayjs(getResult?.dateCreatedAt);
  // let dateUpdated = dayjs(getResult?.updatedAt);
  // let timeDiff = dateUpdated.diff(dateCreated, "m");
  const gridRuntime = getResult?.newTimeDiff + getResult?.timeDiff;
  console.log({ gridRuntime });
  console.log("calculateDuration 0 ajose", calculateDuration2(gridRuntime));
  if (getResult === null) {
    // console.log(
    //   "calculateDuration 0 ajose",
    //   calculateDuration2(getResult.updatedAt - getResult.dateCreatedAt)
    // );

    await publishMqtt(
      await publishUrl,
      {
        "grid-runtime": calculateDuration(0),
      },
      message
    );
  } else if (!!getResult) {
    await publishMqtt(
      await publishUrl,
      {
        "grid-runtime": calculateDuration2(gridRuntime),
      },
      message
    );
  }
};

exports.getGridruntimeStatusGarki = async (getResult, publishUrl, message) => {
  if (!!getResult) {
    // console.log("getResult grid", getResult.gridStatus);
    await publishMqtt(
      await publishUrl,
      {
        "grid-status": getResult.gridStatus,
      },
      message
    );
  } else if (getResult === null) {
    await publishMqtt(
      await publishUrl,
      {
        "grid-status": "OFF",
      },
      message
    );
  }
};
exports.getGenruntimeGbagada = async (getResult, publishUrl, message) => {
  const gridRuntime = getResult?.newTimeDiff + getResult?.timeDiff;
  console.log("calculateDuration 0 ajose", calculateDuration2(gridRuntime));
  if (getResult === null) {
    // console.log(
    //   "calculateDuration 0 ajose",
    //   calculateDuration2(getResult.updatedAt - getResult.dateCreatedAt)
    // );

    await publishMqtt(
      await publishUrl,
      {
        "generator-runtime": calculateDuration(0),
      },
      message
    );
  } else if (!!getResult) {
    await publishMqtt(
      await publishUrl,
      {
        "generator-runtime": calculateDuration2(gridRuntime),
      },
      message
    );
  }
};
exports.getGenruntimeGeneral = async (genDbName, publishUrl, message) => {
  const { years, month, days } = timeConstruct();
  const getGenRunTimeToday = await genDbName.findOne({
    status: "active",
    year: years,
    month: month,
    day: days,
    generatorOnTime: 1,
    dateCreatedAt: {
      $gte: dayjs().startOf("d"),
      $lte: dayjs().endOf("d"),
    },
  });
  console.log({ getGenRunTimeToday }, "test");

  const gridRuntime =
    getGenRunTimeToday?.newTimeDiff + getGenRunTimeToday?.timeDiff;
  console.log("calculateDuration 0 ajose", calculateDuration2(gridRuntime));
  if (getGenRunTimeToday === null) {
    await publishMqtt(
      await publishUrl,
      {
        "generator-runtime": calculateDuration(0),
      },
      message
    );
  } else if (!!getGenRunTimeToday) {
    await publishMqtt(
      await publishUrl,
      {
        "generator-runtime": calculateDuration2(gridRuntime),
      },
      message
    );
  }
};
exports.getGenruntimeCorona = async (
  genDbName,
  publishUrl,
  message,
  secondgenDbName
) => {
  const { years, month, days } = timeConstruct();
  const getGenRunTimeToday = await genDbName.findOne({
    status: "active",
    year: years,
    month: month,
    day: days,
    generatorOnTime: 1,
    dateCreatedAt: {
      $gte: dayjs().startOf("d"),
      $lte: dayjs().endOf("d"),
    },
  });
  const getGenRunTimeTodaySecond = await secondgenDbName.findOne({
    status: "active",
    year: years,
    month: month,
    day: days,
    generatorOnTime: 1,
    dateCreatedAt: {
      $gte: dayjs().startOf("d"),
      $lte: dayjs().endOf("d"),
    },
  });
  console.log({ getGenRunTimeToday }, "test");

  const genRuntime =
    getGenRunTimeToday?.newTimeDiff + getGenRunTimeToday?.timeDiff;
  // console.log("calculateDuration 0 ajose", calculateDuration2(gridRuntime));

  const genRuntimeSecond =
    getGenRunTimeTodaySecond?.newTimeDiff + getGenRunTimeTodaySecond?.timeDiff;
  // console.log("calculateDuration 0 ajose", calculateDuration2(gridRuntime));
  if (getGenRunTimeToday === null) {
    await publishMqtt(
      await publishUrl,
      {
        "first-generator-runtime": calculateDuration(0),
      },
      message
    );
  } else if (!!getGenRunTimeToday) {
    await publishMqtt(
      await publishUrl,
      {
        "first-generator-runtime": calculateDuration2(genRuntime),
      },
      message
    );
  }

  if (getGenRunTimeTodaySecond === null) {
    await publishMqtt(
      await publishUrl,
      {
        "second-generator-runtime": calculateDuration(0),
      },
      message
    );
  } else if (!!getGenRunTimeTodaySecond) {
    await publishMqtt(
      await publishUrl,
      {
        "second-generator-runtime": calculateDuration2(genRuntimeSecond),
      },
      message
    );
  }
};
exports.getGenruntimeStatusGbagada = async (getResult, publishUrl, message) => {
  if (!!getResult) {
    await publishMqtt(
      await publishUrl,
      {
        "generator-status": getResult.generatorStatus,
      },
      message
    );
  } else if (getResult === null) {
    await publishMqtt(
      await publishUrl,
      {
        "generator-status": "OFF",
      },
      message
    );
  }
};
exports.getGenruntimeStatus = async (statusDBName, publishUrl, message) => {
  console.log("it enter runtime status");
  const { years, month, days } = timeConstruct();

  const genDataStatusExistForToday = await statusDBName.findOne({
    year: years,
    month: month,
    day: days,
    status: "active",
    dateCreatedAt: {
      $gte: dayjs().startOf("d"),
      $lte: dayjs().endOf("d"),
    },
  });
  if (!!genDataStatusExistForToday) {
    await publishMqtt(
      await publishUrl,
      {
        "generator-status": genDataStatusExistForToday.generatorStatus,
      },
      message
    );
  } else if (genDataStatusExistForToday === null) {
    await publishMqtt(
      await publishUrl,
      {
        "generator-status": "OFF",
      },
      message
    );
  }
};
exports.getGenruntimeStatusCorona = async (
  statusDBName,
  statusDBNameSecond,
  publishUrl,
  message
) => {
  console.log("it enter runtime status");
  const { years, month, days } = timeConstruct();

  const genDataStatusExistForToday = await statusDBName.findOne({
    year: years,
    month: month,
    day: days,
    status: "active",
    dateCreatedAt: {
      $gte: dayjs().startOf("d"),
      $lte: dayjs().endOf("d"),
    },
  });
  const genDataStatusExistForTodaySecond = await statusDBNameSecond.findOne({
    year: years,
    month: month,
    day: days,
    status: "active",
    dateCreatedAt: {
      $gte: dayjs().startOf("d"),
      $lte: dayjs().endOf("d"),
    },
  });

  if (!!genDataStatusExistForToday) {
    await publishMqtt(
      await publishUrl,
      {
        "first-generator-status": genDataStatusExistForToday.generatorStatus,
      },
      message
    );
  } else if (genDataStatusExistForToday === null) {
    await publishMqtt(
      await publishUrl,
      {
        "first-generator-status": "OFF",
      },
      message
    );
  }
  if (!!genDataStatusExistForTodaySecond) {
    await publishMqtt(
      await publishUrl,
      {
        "second-generator-status":
          genDataStatusExistForTodaySecond.generatorStatus,
      },
      message
    );
  } else if (genDataStatusExistForTodaySecond === null) {
    await publishMqtt(
      await publishUrl,
      {
        "second-generator-status": "OFF",
      },
      message
    );
  }
};

exports.getGenruntimeJakande = async (getResult, publishUrl, message) => {
  const gridRuntime = getResult?.newTimeDiff + getResult?.timeDiff;
  console.log("calculateDuration 0 ajose", calculateDuration2(gridRuntime));
  if (getResult === null) {
    // console.log(
    //   "calculateDuration 0 ajose",
    //   calculateDuration2(getResult.updatedAt - getResult.dateCreatedAt)
    // );

    await publishMqtt(
      await publishUrl,
      {
        "generator-runtime": calculateDuration(0),
      },
      message
    );
  } else if (!!getResult) {
    await publishMqtt(
      await publishUrl,
      {
        "generator-runtime": calculateDuration2(gridRuntime),
      },
      message
    );
  }
};
exports.getGenruntimeStatusJakande = async (getResult, publishUrl, message) => {
  if (!!getResult) {
    await publishMqtt(
      await publishUrl,
      {
        "generator-status": getResult.generatorStatus,
      },
      message
    );
  } else if (getResult === null) {
    await publishMqtt(
      await publishUrl,
      {
        "generator-status": "OFF",
      },
      message
    );
  }
};
// exports.getGridruntimeJakande = async (getResult, publishUrl, message) => {
//   // let dateCreated = dayjs(getResult?.dateCreatedAt);
//   // let dateUpdated = dayjs(getResult?.updatedAt);
//   // let timeDiff = dateUpdated.diff(dateCreated, "m");
//   const gridRuntime = getResult?.newTimeDiff + getResult?.timeDiff;
//   console.log({ gridRuntime });
//   console.log("calculateDuration 0 ajose", calculateDuration2(gridRuntime));
//   if (getResult === null) {
//     // console.log(
//     //   "calculateDuration 0 ajose",
//     //   calculateDuration2(getResult.updatedAt - getResult.dateCreatedAt)
//     // );

//     await publishMqtt(
//       await publishUrl,
//       {
//         "grid-runtime": calculateDuration(0),
//       },
//       message
//     );
//   } else if (!!getResult) {
//     await publishMqtt(
//       await publishUrl,
//       {
//         "grid-runtime": calculateDuration2(gridRuntime),
//       },
//       message
//     );
//   }
// };

// exports.getGridruntimeStatusJakande = async (
//   getResult,
//   publishUrl,
//   message
// ) => {
//   if (!!getResult) {
//     // console.log("getResult grid", getResult.gridStatus);
//     await publishMqtt(
//       await publishUrl,
//       {
//         "grid-status": getResult.gridStatus,
//       },
//       message
//     );
//   } else if (getResult === null) {
//     await publishMqtt(
//       await publishUrl,
//       {
//         "grid-status": "OFF",
//       },
//       message
//     );
//   }
// };
