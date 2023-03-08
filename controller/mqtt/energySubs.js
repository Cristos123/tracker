const mqtt = require("mqtt");

const splitWords = async (longText) => {
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

// const hexToDecimal = (hex) => parseInt(hex, 16);
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
const formatDataToObject = (data = [], sixchar) => {
  const formatedData = {};
  if (sixchar === "010378") {
    data.forEach((value, i) => {
      formatedData[`voltage${i + 1}`] = HexToFloat32(value);
    });
  } else if (sixchar === "01030C") {
    data.forEach((value, i) => {
      formatedData[`current${i + 1}`] = HexToFloat32(value);
    });
  } else if (sixchar === "010310") {
    data.forEach((value, i) => {
      formatedData[`frequency${i + 1}`] = HexToFloat32(value);
    });
  } else if (sixchar === "010320") {
    data.forEach((value, i) => {
      formatedData[`energy${i + 1}`] = HexToFloat32(value);
    });
  }
  return formatedData;
};

const energySubscribeMqtt = async () => {
  let host = "driver.cloudmqtt.com"; //"4g.bridge.iotrouter.com";
  let host2 = "demo.thingsboard.io";
  let port = "18798"; //"1883"; //process.env.PORT;
  let port2 = "1883"; //"1883"; //process.env.PORT;
  // try {

  // } catch (error) {

  // }
  const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
  const connectUrl = `mqtt://${host}:${port}`;
  const connectUrl2 = `mqtt://${host2}:${port2}`;

  const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: "pmhwzljg",
    password: "dppg5l-50r6b",
    reconnectPeriod: 1000,
  });
  const client2 = mqtt.connect(connectUrl2, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: "AWt1B9PXD4SHge0gFAht",
    // password: "12345678",
    reconnectPeriod: 1000,
  });
  client.on("connect", () => {
    console.log("connected");
  });
  client2.on("connect", () => {
    console.log("connected client2");
  });
  // let toDecimal;
  client.on("connect", () => {
    client.subscribe("Energy", (err, granted) => {
      if (err) {
        console.log(err, "err");
      }
      console.log(granted, "granted");
    });
  });

  client.on("message", async (topic, message, packet) => {
    var msgObject = JSON.parse(message.toString());

    let longText = JSON.stringify(msgObject.data);
    console.log({ msgObject });
    let words = await splitWords(longText.replace(/"/g, ""));
    // console.log({ words });
    if (words.sixChar === "010378") {
      let voltages = formatDataToObject(words.eightWords, words.sixChar);
      // console.log("formatDataToObject", voltages);
      client2.publish(
        "v1/devices/me/telemetry",
        JSON.stringify(voltages),
        { qos: 0, retain: false },
        (error) => {
          if (error) {
            console.error(error);
          }
          console.log("it publish and response sent ");
        }
      );

      // console.log("tope is 010378");
    } else if (words.sixChar === "01030C") {
      let currents = formatDataToObject(words.eightWords, words.sixChar);
      console.log("currents", currents);

      client2.publish(
        "v1/devices/me/telemetry",
        JSON.stringify(currents),
        { qos: 0, retain: false },
        (error) => {
          if (error) {
            console.error(error);
          }
          console.log("it publish and response sent ");
        }
      );
      // console.log({ toDecimal });
      console.log("tope is 01030C");
    } else if (words.sixChar === "010310") {
      let frequency = formatDataToObject(words.eightWords, words.sixChar);
      console.log("frequency", frequency);
      client2.publish(
        "v1/devices/me/telemetry",
        JSON.stringify(frequency),
        { qos: 0, retain: false },
        (error) => {
          if (error) {
            console.error(error);
          }
          console.log("it publish and response sent ");
        }
      );
      // console.log("tope is 010310");
    } else if (words.sixChar === "010320") {
      let energy = formatDataToObject(words.eightWords, words.sixChar);
      console.log("energy", energy);
      client2.publish(
        "v1/devices/me/telemetry",
        JSON.stringify(energy),
        { qos: 0, retain: false },
        (error) => {
          if (error) {
            console.error(error);
          }
          console.log("it publish and response sent ");
        }
      );
      // console.log("tope is 010320");
    }
    // console.log({ words });
  });
  client.on("packetsend", (packet) => {
    console.log(packet, "packet2");
  });
};
module.exports = { energySubscribeMqtt };
