import { loadPackageDefinition, Server, ServerCredentials } from '@grpc/grpc-js'
import { loadSync } from '@grpc/proto-loader'
import path from 'path'
import { fileURLToPath } from 'url'
import { userService } from './services/userService.js'
import { carService } from './services/carService.js'
import { orderService } from './services/orderService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const [USER_PROTO_PATH, CAR_PROTO_PATH, ORDER_PROTO_PATH] = ["user", "car", "order"].map(item => {
  return path.join(__dirname, `../proto/${item}.proto`)
})

const userPackage = loadSync(USER_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})

const carPackage = loadSync(CAR_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})

const orderPackage = loadSync(ORDER_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})

const userProto = loadPackageDefinition(userPackage).user
const carProto = loadPackageDefinition(carPackage).car
const orderProto = loadPackageDefinition(orderPackage).order

const server = new Server();
server.addService(userProto.UserService.service, userService)
server.addService(carProto.CarService.service, carService)
server.addService(orderProto.OrderService.service, orderService)

const PORT = '50051';
server.bindAsync(`0.0.0.0:${PORT}`, ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Erro ao iniciar servidor:', err);
    return;
  }
  console.log(`Servidor gRPC rodando na porta ${port}`);
});

process.on('SIGINT', () => {
  console.log('\nDesligando servidor...');
  server.tryShutdown(() => {
    console.log('Servidor desligado com sucesso');
    process.exit(0);
  });
});