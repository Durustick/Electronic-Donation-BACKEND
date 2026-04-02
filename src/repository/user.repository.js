const supabase = require("../config/database");

class UserRepository {
  async login(email) {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(error.message);
    }

    return data;
  }

  async verifyExistingUser(email) {
    const { data } = await supabase
      .from("usuarios")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (data) {
      return true;
    }
    return false;
  }

  async register({ nome, email, password }) {
    const { data, error } = await supabase
      .from("usuarios")
      .insert([{ nome, email, senha: password }])
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(error.message);
    }

    return data;
  }
}

module.exports = new UserRepository();
