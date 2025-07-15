import { loadPackageDefinition, credentials } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROTO_PATH = join(__dirname, '../proto/user.proto');
const packageDefinition = loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const userProto = loadPackageDefinition(packageDefinition).user;

const client = new userProto.UserService(
  'localhost:50051',
  credentials.createInsecure()
);

async function testGRPCMethods() {
  console.log('=== Testando API gRPC ===\n');

  console.log('1. Criando novo usuário:');
client.CreateUser({
  name: 'Pedro Oliveira',
  email: 'lucas@email.com',
  password: 'senha123'
}, (err, response) => {
  if (err) return console.error('Erro ao criar:', err);

  console.log('Usuário criado:', response.user);

  console.log('2. Buscando usuário recém-criado:');
  client.GetUser({ id: response.user.id }, (err, response) => {
    if (err) return console.error('Erro ao buscar:', err);

    console.log('Usuário encontrado:', response.user);

    console.log('3. Listando todos:');
    client.ListUsers({}, (err, response) => {
      if (err) return console.error('Erro ao listar:', err);

      console.log('Usuários:', response.users);
      client.close();
    });
  });
});
}

testGRPCMethods();