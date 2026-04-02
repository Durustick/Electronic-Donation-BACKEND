const userService = require("../services/user.service");
const { z } = require("zod");

class UserController {
  async login(request, response) {
    try {
      const { email, password } = request.body;

      const { userData, token } = await userService.login(email, password);

      response.json({ userData, token });
    } catch (error) {
      if (
        error.message === "Email inválido" ||
        error.message === "Senha inválida"
      ) {
        return response.status(401).json({ error: error.message });
      }
      console.error(error);
      response.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async register(request, response) {
    try {
      console.log(request.body);
      const registerSchema = z
        .object({
          name: z.string(),
          email: z.string().email("Email inválido"),
          password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
          confirmPassword: z
            .string()
            .min(6, "Senha deve ter no mínimo 6 caracteres"),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "As senhas não coincidem",
          path: ["confirmPassword"],
        });

      const { name, email, password } = registerSchema.parse(request.body);
      console.log({ name, email, password });

      const payload = {
        nome: name,
        email,
        password,
      };

      const { userData, token } = await userService.register(payload);

      response.json({ userData, token });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return response.status(400).json({ error: error.errors });
      }
      if (
        error.message === "Erro ao registrar usuário" ||
        error.message === "O usuario ja possui cadastro"
      ) {
        return response.status(400).json({ error: error.message });
      }
      console.error(error);
      response.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}

module.exports = new UserController();
