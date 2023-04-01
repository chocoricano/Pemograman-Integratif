const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = "./mahasiswa.proto";
const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

const mahasiswaProto =
  grpc.loadPackageDefinition(packageDefinition).MahasiswaService;

const client = new mahasiswaProto(
  "localhost:3000",
  grpc.credentials.createInsecure()
);

client.getAll({}, (error, response) => {
  if (error) {
    console.error(`Error: ${error}`);
    return;
  }
  console.log(`Mahasiswa: ${JSON.stringify(response.mahasiswa)}`);
});
