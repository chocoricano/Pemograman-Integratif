import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import mysql from "mysql";

const PROTO_PATH = './siswa.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const userManagement = grpcObject.data.UserManagement;


const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "grpcsiswa",
});

dbConnection.connect();

function createNewUser(call, callback) {
  const user = call.request;

  dbConnection.query("INSERT INTO users SET ?", user, (err, result) => {
    if (err) throw err;

    user.id = result.insertId;
    callback(null, user);
  });
}

function getUser(call, callback) {
  const id = call.request.id;

  dbConnection.query("SELECT * FROM users WHERE id = ?", id, (err, results) => {
    if (err) throw err;

    const user = results[0];
    callback(null, user);
  });
}

function updateUserDetails(call, callback) {
  const user = call.request;

  dbConnection.query(
    "UPDATE users SET name = ?, absenNumber = ?, mathScore = ?, physicsScore = ?, biologyScore = ? WHERE id = ?",
    [user.name, user.absenNumber, user.mathScore, user.physicsScore, user.biologyScore, user.id],
    (err, result) => {
      if (err) throw err;

      callback(null, user);
    }
  );
}

function removeUser(call, callback) {
  const id = call.request.id;

  dbConnection.query("DELETE FROM users WHERE id = ?", id, (err, result) => {
    if (err) throw err;

    callback(null, "User deleted successfully");
  });
}

function startGRPCServer() {
  const server = new grpc.Server();
  server.addService(userManagement.service, {
    createNewUser: createNewUser,
    getUser: getUser,
    updateUserDetails: updateUserDetails,
    removeUser: removeUser,
  });

  server.bindAsync(
    "localhost:50052",
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
      console.log("GRPC server started on port 50052");
    }
  );
}

startGRPCServer();
