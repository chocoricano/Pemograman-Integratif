# Implementasi CRUD GRPC dan protobuf dengan NODE JS

## yang digunakan :

- node.js
- mysql

## Main code :

.js

```
/* Import library yang dibutuhkan */
import grpc from "@grpc/grpc-js"; // import library grpc untuk mengimplementasikan gRPC pada JavaScript
import protoLoader from "@grpc/proto-loader"; // import library protoLoader untuk memuat protokol gRPC pada JavaScript
import mysql from "mysql"; // import library mysql untuk melakukan koneksi dengan database MySQL

/* Mendefinisikan path untuk file .proto */
const PROTO_PATH = "./siswa.proto";

/* Memuat protokol gRPC dan mengembalikan definisi untuk paket yang di-load */
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDefinition);

/* Mengambil definisi service userManagement dari protobuf yang telah dimuat */
const userManagement = grpcObject.data.UserManagement;

/* Membuat koneksi dengan database MySQL */
const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "grpcsiswa",
});

/* Membuka koneksi dengan database */
dbConnection.connect();

/* Implementasi fungsi untuk menambahkan user baru */
function createNewUser(call, callback) {
  const user = call.request;

  dbConnection.query("INSERT INTO users SET ?", user, (err, result) => {
    if (err) throw err;
    user.id = result.insertId;
    callback(null, user);
  });
}

/* Implementasi fungsi untuk mendapatkan user berdasarkan ID */
function getUser(call, callback) {
  const id = call.request.id;

  dbConnection.query("SELECT * FROM users WHERE id = ?", id, (err, results) => {
    if (err) throw err;

    const user = results[0];
    callback(null, user);
  });
}

/* Implementasi fungsi untuk mendapatkan user yang tersimpan dalam database*/
function getAll(call, callback) {
  dbConnection.query("SELECT * FROM users", (err, results) => {
    if (err) throw err;

    console.log(results);
    const users = results.map((result) => result);
    console.log(users);
    const userList = { users };
    callback(null, userList);
  });
}

/* Implementasi fungsi untuk memperbarui detail user */
function updateUserDetails(call, callback) {
  const user = call.request;

  dbConnection.query(
    "UPDATE users SET name = ?, absenNumber = ?, mathScore = ?, physicsScore = ?, biologyScore = ? WHERE id = ?",
    [
      user.name,
      user.absenNumber,
      user.mathScore,
      user.physicsScore,
      user.biologyScore,
      user.id,
    ],
    (err, result) => {
      if (err) throw err;
      callback(null, user);
    }
  );
}

/* Implementasi fungsi untuk menghapus user berdasarkan ID */
function removeUser(call, callback) {
  const id = call.request.id;

  dbConnection.query("DELETE FROM users WHERE id = ?", id, (err, result) => {
    if (err) throw err;
    callback(null, "User deleted successfully");
  });
}

/* Membuat server gRPC */
function startGRPCServer() {
  const server = new grpc.Server();

  /* Menambahkan service userManagement ke server */
  server.addService(userManagement.service, {
    createNewUser: createNewUser,
    getUser: getUser,
    updateUserDetails: updateUserDetails,
    removeUser: removeUser,
    getAll: getAll,
  });

  /* Binding server dengan port dan memulai server */
  server.bindAsync(
    "localhost:50052", // Binding server dengan port 50052 pada localhost
    grpc.ServerCredentials.createInsecure(), // Menggunakan credentials insecure
    () => {
      server.start(); // Memulai server gRPC
      console.log("GRPC server started on port 50052"); // Menampilkan pesan jika server telah dimulai
    }
  );
}

/* Memulai server gRPC */
startGRPCServer();

```

```
.proto
syntax = "proto3";

package data;

service UserManagement {
rpc createNewUser (User) returns (User) {}
rpc getUser (UserRequest) returns (User) {}
rpc updateUserDetails (User) returns (User) {}
rpc removeUser (UserRequest) returns (User) {}
rpc getAll (Empty) returns (UserList) {}
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

message Empty {

}

message UserList {
repeated User users = 1;
}
```

## Testing dengan postman

- Create User
  [![grpc.png](https://i.postimg.cc/2SmJFmCm/grpc.png)](https://postimg.cc/nCR0pysw)
- Read User
  [![grpc.png](https://i.postimg.cc/FR2CfXTM/grpc.png)](https://postimg.cc/njGG5gb2)
- Update User
  [![grpc.png](https://i.postimg.cc/9FB129j5/grpc.png)](https://postimg.cc/3dd2CdRn)
- Delete User
  [![grpc.png](https://i.postimg.cc/MTyVDk62/grpc.png)](https://postimg.cc/zbGyzcH0)
- Get All
  [![image.png](https://i.postimg.cc/7PMNpV0N/image.png)](https://postimg.cc/7bh7zSBC)
