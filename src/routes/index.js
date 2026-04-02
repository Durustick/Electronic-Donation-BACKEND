const express = require("express");
const LoginController = require("../controllers/user.controller");
const UserController = require("../controllers/user.controller");

const router = express.Router();

router.post("/login", UserController.login);

router.post("/register", UserController.register);

//router.get("/minha-rota", authMiddleware, dashboardController)

module.exports = router;
