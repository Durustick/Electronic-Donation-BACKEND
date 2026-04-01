const userService = require("../services/user.service");
const { generateToken } = require("../utils/generateToken");
// Para validar a senha, você precisará de uma biblioteca como 'bcryptjs'
// > npm install bcryptjs
// const bcrypt = require('bcryptjs');

class UserController {
  async login(request, response) {
    try {
      const { email, password } = request.body;

      const user = await userService.login(email);

      if (!user) {
        return response.status(401).json({ error: "Email inválido" });
      }

      if (user.senha !== password) {
        return response.status(401).json({ error: "Senha inválida" });
      }

      const token = generateToken(user);

      const userData = {
        id: user.id,
        nome: user.nome,
        email: user.email,
      };

      response.json({ userData, token });
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}

module.exports = new UserController();
