const mqtt = require("mqtt");

const url_broker = "broker.hivemq.com"; // url dari broker yang digunakan
const port_broker = 1883; // port yang digunakan

const client = mqtt.connect(`mqtt://${url_broker}:${port_broker}`); // buat koneksi ke broker

// subscribe to topic
client.on("connect", () => {
  client.subscribe("topic/jeno");
});

// receive message from topic
client.on("message", (topic, message) => {
  console.log(message.toString());
});
