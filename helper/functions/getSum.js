const { publishMqtt, convertToPositive } = require("../helper");

exports.getSum = async (responseValue, publishUrl, message) => {
  // const toArray = Object.values(responseValue);
  const results = responseValue.reduce((acc, curr) => acc + curr, 0);
  const divideBy1000 = (results / 1000).toFixed(2);
  console.log({ results, divideBy1000, responseValue });

  await publishMqtt(
    await publishUrl,
    {
      [`total-energy`]: convertToPositive(divideBy1000),
    },
    message
  );
};
