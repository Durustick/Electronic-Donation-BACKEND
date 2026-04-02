const supabase = require("../config/database");
const userRepository = require("../repository/user.repository");
const { generateToken } = require("../utils/generateToken");

class UserService {
  async login(email, password) {
    const user = await userRepository.login(email);

    if (!user) {
      throw new Error("Email inválido");
    }

    if (user.senha !== password) {
      throw new Error("Senha inválida");
    }

    const token = generateToken(user);

    return {
      userData: { id: user.id, nome: user.nome, email: user.email },
      token,
    };
  }

  async register(payload) {
    console.log(payload);
    const isUserExist = await userRepository.verifyExistingUser(payload.email);

    if (isUserExist) {
      throw new Error("O usuario ja possui cadastro");
    }

    const user = await userRepository.register(payload);

    if (!user) {
      throw new Error("Erro ao registrar usuário");
    }

    const token = generateToken(user);

    return {
      userData: { id: user.id, nome: user.nome, email: user.email },
      token,
    };
  }
}

module.exports = new UserService();
