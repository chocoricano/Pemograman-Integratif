const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["dory.srvs.cloudkafka.com:9094"],
  ssl: true,
  sasl: {
    mechanism: "scram-sha-512",
    username: "ggpmigms",
    password: "mU25R3uuBuit3qoscZUMsOYHMFydY5-r",
  },
});

const consumer = kafka.consumer({ groupId: "ggpmigms-grupandy" });

const runConsumer = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({
      topic: "ggpmigms-kaumrumputneon",
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          topik: topic,
          partisi: partition,
          offset: message.offset,
          kunci: message.key ? message.key.toString() : null,
          nilai: message.value.toString(),
        });
      },
    });
  } catch (error) {
    console.error("Terjadi kesalahan saat menjalankan consumer:", error);
  }
};

runConsumer();
