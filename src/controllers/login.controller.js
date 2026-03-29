const LoginRepository = require("../repository/login.repository");

class LoginController {
  async login(request, response) {
    try {
      const { email, password } = request.body;

      const payload = {
        email,
        password,
      };

      const data = LoginRepository.login(payload);

      response.json({ message: "API funcionando 🚀" });
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = new LoginController();
