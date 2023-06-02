const mqtt = require("mqtt");

const url_broker = "broker.hivemq.com"; // url dari broker yang digunakan
const port_broker = 1883; // port yang digunakan

const client = mqtt.connect(`mqtt://${url_broker}:${port_broker}`); // buat koneksi ke broker

// send message to topic
client.on("connect", () => {
  client.publish("topic/jeno", "Hello mqtt"); // publish pesan ke topik
  client.end();
});
