# Implementasi CRUD GRPC dan protobuf dengan NODE JS
## yang digunakan :
* node.js
* mysql

## Main code :
.js
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



.proto
syntax = "proto3";

package data;

service UserManagement {
    rpc createNewUser (User) returns (User) {}
    rpc getUser (UserRequest) returns (User) {}
    rpc updateUserDetails (User) returns (User) {}
    rpc removeUser (UserRequest) returns (User) {}
}

message User {
    string name = 1;
    int32 absenNumber = 2;
    float mathScore = 3;
    float physicsScore = 4;
    float biologyScore = 5;
}

message UserRequest {
    int32 id = 1;
}



## Testing dengan postman
* Create User
[![grpc.png](https://i.postimg.cc/2SmJFmCm/grpc.png)](https://postimg.cc/nCR0pysw)
* Read User
[![grpc.png](https://i.postimg.cc/FR2CfXTM/grpc.png)](https://postimg.cc/njGG5gb2)
* Update User
[![grpc.png](https://i.postimg.cc/9FB129j5/grpc.png)](https://postimg.cc/3dd2CdRn)
* Delete User
[![grpc.png](https://i.postimg.cc/MTyVDk62/grpc.png)](https://postimg.cc/zbGyzcH0)