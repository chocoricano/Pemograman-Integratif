//Import package
const grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

// Define Proto Path
const PROTO_PATH = "./mahasiswa.proto";

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

// Load Proto
const mahasiswaProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

// Dummy Data
let mahasiswa = [
  {
    id: 1,
    nama: "Andy",
    nrp: "5002",
    nilai: 90,
  },
  {
    id: 2,
    nama: "Anda",
    nrp: "5003",
    nilai: 73,
  },
];

server.addService(mahasiswaProto.MahasiswaService.service, {
  getAll: (_, callback) => {
    callback(null, mahasiswa);
  },
});

server.bindAsync(
  "127.0.0.1:3000",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log("Server running at http://localhost:3000");
    server.start();
  }
);
