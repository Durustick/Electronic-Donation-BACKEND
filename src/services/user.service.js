const supabase = require("../config/database");
const userRepository = require("../repository/user.repository");

class UserService {
  async login(email) {
    return userRepository.login(email);
  }
}
module.exports = new UserService();
