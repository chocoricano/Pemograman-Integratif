import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import readline from "readline";

const PROTO_PATH = "./siswa.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const userManagement = grpcObject.data.UserManagement;

const client = new userManagement(
  "localhost:50052",
  grpc.credentials.createInsecure()
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter user id: ", (id) => {
  rl.question("Enter user name: ", (name) => {
    rl.question("Enter absen number: ", (absenNumber) => {
      rl.question("Enter math score: ", (mathScore) => {
        rl.question("Enter physics score: ", (physicsScore) => {
          rl.question("Enter biology score: ", (biologyScore) => {
            const userData = {
              id: parseInt(id),
              name: name,
              absenNumber: parseInt(absenNumber),
              mathScore: parseInt(mathScore),
              physicsScore: parseInt(physicsScore),
              biologyScore: parseInt(biologyScore),
            };

            client.updateUserDetails(userData, (err, response) => {
              if (err) {
                console.error(err);
                return;
              }

              console.log("User data updated successfully:");
              console.log(response);
            });

            rl.close();
          });
        });
      });
    });
  });
});
