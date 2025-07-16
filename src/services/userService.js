import { db } from '../../prisma.js'

export const userService = {
  GetUser: async(call, callback) => {
    const userId = call.request.id
    const user = await db.user.findUnique({
      where: {
        id: userId
      }
    })
    
    if (user) {
      callback(null, {
        user: user,
        message: 'Usuário encontrado com sucesso'
      })
    } else {
      callback({
        code: status.NOT_FOUND,
        message: 'Usuário não encontrado'
      })
    }
  },

  CreateUser: async(call, callback) => {
    const { name, email, password } = call.request

    if (!name || !email || !password) {
      callback({
        code: status.INVALID_ARGUMENT,
        message: 'Nome e email são obrigatórios'
      })
      return
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
  },

  LoginUser: async (call, callback) => {
    const { email, password } = call.request;

    if (!email || !password) {
      return callback({
        code: status.INVALID_ARGUMENT,
        message: 'Email e senha são obrigatórios.'
      });
    }

    try {
      const user = await db.user.findUnique({
        where: { email }
      });

      if (!user || user.password !== password) {
        return callback({
          code: status.UNAUTHENTICATED,
          message: 'Credenciais inválidas.'
        });
      }

      callback(null, {
        uuid: user.id,
        message: "Usuário Encontrado"
      });
    } catch (error) {
      callback({
        code: status.INTERNAL,
        message: 'Erro interno no servidor'
      });
    }
  }
};