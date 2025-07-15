import { loadPackageDefinition, status, Server, ServerCredentials } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, '../proto/user.proto');

const packageDefinition = loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const userProto = loadPackageDefinition(packageDefinition).user;

const userService = {
  GetUser: async(call, callback) => {
    const userId = call.request.id;
    const user = await db.user.findUnique({
      where: {
        id: userId
      }
    })
    
    if (user) {
      callback(null, {
        user: user,
        message: 'Usuário encontrado com sucesso'
      });
    } else {
      callback({
        code: status.NOT_FOUND,
        message: 'Usuário não encontrado'
      });
    }
  },

  CreateUser: async(call, callback) => {
    const { name, email, password } = call.request;

    if (!name || !email || !password) {
      callback({
        code: status.INVALID_ARGUMENT,
        message: 'Nome e email são obrigatórios'
      });
      return;
    }

    let newUser = await db.user.create({
      data: {
        email,
        password,
        name,
      }
    })

    callback(null, {
      user: newUser,
      message: 'Usuário criado com sucesso' 
    });
  },

  ListUsers: async(call, callback) => {
    const users = await db.user.findMany()

    callback(null, {
      users: users,
      message: 'Usuários encontrados com sucesso'
    });
  }
};

const server = new Server();
server.addService(userProto.UserService.service, userService);

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