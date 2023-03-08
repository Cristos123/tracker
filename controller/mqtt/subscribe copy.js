const mqtt = require("mqtt");
const Subscribes = require("../../model/Subscribe");

const splitWords = async (longText) => {
  const sixChar = longText.slice(0, 6);
  let lastText = longText.slice(6);
  console.log({ lastText });
  const worksSplit = lastText.split("");

  let eightWords = [];
  let charCounter = "";
  for (const char of worksSplit) {
    if (charCounter.length === 8) {
      eightWords = [...eightWords, charCounter];
      charCounter = "";
      // console.log("eightWords in forloop", eightWords);
    }
    charCounter = charCounter.concat(char);
    // console.log("charCounter in for loop", charCounter);
  }
  console.log({ sixChar, eightWords });

  return {
    sixChar,
    eightWords,
  };
};

const SubscribeMqtt = async () => {
  let host = "4g.bridge.iotrouter.com";
  let port = "1883";
  // try {

  // } catch (error) {

  // }
  const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
  const connectUrl = `mqtt://${host}:${port}`;

  const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: "test-user4",
    password: "12345678",
    reconnectPeriod: 1000,
  });
  client.on("connect", () => {
    console.log("connected");
  });

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

    const buffer = new ArrayBuffer(16);
    const view = new DataView(buffer, 0);

    view.setInt16(1, longText);
    view.getInt16(1); // 42
    // console.log({ view });
    function hexToFloat(hex) {
      var s = hex >> 31 ? -1 : 1;
      var e = (hex >> 23) & 0xff;
      return (
        ((s * ((hex & 0x7fffff) | 0x800000) * 1.0) / Math.pow(2, 23)) *
        Math.pow(2, e - 127)
      );
    }
    let words = await splitWords(longText.replace(/"/g, ""));
    // let toDecimal = [];
    const toDecimal = words.eightWords.map((todec) => {
      const buffer = new ArrayBuffer(16);
      // let toFloat = hexToFloat(todec, 8);
      let decimal = parseInt(todec, 16);
      const view = new DataView(buffer);
      view.setUint32(0, todec);
      console.log({ decimal });
      console.log(view.getFloat32(0));
      // let decimal = new DataView(new ArrayBuffer(4));
      // decimal.setInt16(0, todec);
      // decimal.getFloat32(0);
      // const buffer = new ArrayBuffer(16);
      // const view = new DataView(buffer, 0);
      // view.setInt16(1, todec);
      // view.getInt16(1); // 42
      // console.log({ view });
      return decimal;
    });
    // let toDecimal = parseInt(words.eightWords, 16);
    // const savetoDbSubscribes = await new Subscribes({
    //   topic,
    //   sixChar: words.sixChar,
    //   eightWords: toDecimal,
    // }).save();
    console.log({ toDecimal });
    // if (!!savetoDbSubscribes) {
    //   console.log("successfull");
    // } else {
    //   console.log("error not successful");
    // }
    // console.log(
    //   "words",
    //   //   (await words).sixChar,
    //   "savetoDbSubscribes",
    //   savetoDbSubscribes
    // );
    // console.log(splitWords(longText.replace(/"/g, "")));
    // console.log(
    //   // "message is " + JSON.stringify(msgObject, "", 2),
    //   "msgObject.data",
    //   //   JSON.stringify(msgObject.data),
    //   "chunks"
    //   // chunks
    // );
    // // console.log("topic is " + topic);
  });
  client.on("packetsend", (packet) => {
    console.log(packet, "packet2");
  });
  // console.log({ client });
};

module.exports = { SubscribeMqtt };
