const { Kafka, Partitioners } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["dory.srvs.cloudkafka.com:9094"],
  ssl: true,
  sasl: {
    mechanism: "scram-sha-512",
    username: "ggpmigms",
    password: "mU25R3uuBuit3qoscZUMsOYHMFydY5-r",
  },
  createPartitioner: Partitioners.LegacyPartitioner,
});

const producer = kafka.producer();

const runProducer = async () => {
  try {
    await producer.connect();
    await producer.send({
      topic: "ggpmigms-kaumrumputneon",
      messages: [
        { key: "key1", value: "hello world" },
        { key: "key2", value: "hey hey!" },
      ],
    });
    await producer.disconnect();
  } catch (error) {
    console.error("Terjadi kesalahan saat menjalankan producer:", error);
  }
};

runProducer();
